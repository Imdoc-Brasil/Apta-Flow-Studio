#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function run(cmd) {
    return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function runInherit(cmd) {
    execSync(cmd, { stdio: "inherit" });
}

function formatDate(date = new Date()) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function ensureCleanWorkingTree() {
    const status = run("git status --porcelain");
    if (status) {
        console.error("❌ Working tree não está limpo.");
        console.error("➡️ Faça commit, stash ou descarte alterações antes de criar o PR.");
        process.exit(1);
    }
}

function getCurrentBranch() {
    return run("git rev-parse --abbrev-ref HEAD");
}

function getLastTag() {
    try {
        return run("git describe --tags --abbrev=0");
    } catch {
        return null;
    }
}

function parseVersion(tag) {
    const clean = tag.replace(/^v/, "");
    const parts = clean.split(".").map((n) => Number(n));
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
    return { major: parts[0], minor: parts[1], patch: parts[2] };
}

function bumpVersion(v, type) {
    const next = { ...v };
    if (type === "major") {
        next.major += 1;
        next.minor = 0;
        next.patch = 0;
    } else if (type === "minor") {
        next.minor += 1;
        next.patch = 0;
    } else {
        next.patch += 1;
    }
    return next;
}

function formatVersion(v) {
    return `v${v.major}.${v.minor}.${v.patch}`;
}

function ensureGhInstalled() {
    try {
        run("gh --version");
    } catch {
        console.error("❌ GitHub CLI (gh) não encontrado.");
        console.error("➡️ Instale e rode `gh auth login`.");
        process.exit(1);
    }
}

function ensureGhAuth() {
    try {
        run("gh auth status");
    } catch {
        console.error("❌ Você não está autenticado no GitHub CLI.");
        console.error("➡️ Rode: gh auth login");
        process.exit(1);
    }
}

function createReleaseNotes({ version, today }) {
    const templatePath = path.join(process.cwd(), "docs", "release-notes-template.md");
    const releasesDir = path.join(process.cwd(), "docs", "releases");
    const targetPath = path.join(releasesDir, `${today}-${version}.md`);

    if (!fs.existsSync(templatePath)) {
        console.error(`❌ Template não encontrado: ${templatePath}`);
        process.exit(1);
    }

    if (!fs.existsSync(releasesDir)) {
        fs.mkdirSync(releasesDir, { recursive: true });
    }

    if (fs.existsSync(targetPath)) {
        console.error(`❌ Já existe um release note para essa data/versão: ${targetPath}`);
        process.exit(1);
    }

    let content = fs.readFileSync(templatePath, "utf8");
    content = content.replace("**Data:** YYYY-MM-DD", `**Data:** ${today}`);
    content = content.replace("**Versão:** vX.Y.Z", `**Versão:** ${version}`);
    content = content.replace(
        "**Status:** ☐ Em andamento ☐ Staging aprovado ☐ Deploy em produção ☐ Finalizado",
        "**Status:** ☑ Em andamento ☐ Staging aprovado ☐ Deploy em produção ☐ Finalizado"
    );

    fs.writeFileSync(targetPath, content, "utf8");
    return targetPath;
}

function getRepoSlug() {
    // retorna "owner/repo"
    return run("gh repo view --json nameWithOwner -q .nameWithOwner");
}

function main() {
    ensureGhInstalled();
    ensureGhAuth();
    ensureCleanWorkingTree();

    const bumpType = process.argv[2] || "patch";
    const allowed = ["patch", "minor", "major"];
    if (!allowed.includes(bumpType)) {
        console.error("❌ Tipo inválido. Use: patch | minor | major");
        process.exit(1);
    }

    const baseBranch = "dev"; // seu fluxo: PR para dev ou para main? (recomendado: dev)
    const today = formatDate();
    const lastTag = getLastTag();

    let nextVersion;

    if (!lastTag) {
        nextVersion = "v0.1.0";
        console.log("ℹ️ Nenhuma tag encontrada. Usando versão inicial: v0.1.0");
    } else {
        const parsed = parseVersion(lastTag);
        if (!parsed) {
            console.error(`❌ Última tag não está no formato semver vX.Y.Z: ${lastTag}`);
            process.exit(1);
        }
        nextVersion = formatVersion(bumpVersion(parsed, bumpType));
    }

    const branchName = `release/${nextVersion}`;
    const title = `Release ${nextVersion}`;
    const repo = getRepoSlug();

    console.log(`✅ Última tag: ${lastTag ?? "(nenhuma)"}`);
    console.log(`➡️ Próxima versão (${bumpType}): ${nextVersion}`);
    console.log(`🌿 Branch: ${branchName}`);
    console.log(`📌 Base branch (PR alvo): ${baseBranch}`);
    console.log(`📦 Repo: ${repo}`);

    // garantir que estamos no dev
    const current = getCurrentBranch();
    if (current !== baseBranch) {
        console.log(`ℹ️ Mudando para ${baseBranch}...`);
        runInherit(`git checkout ${baseBranch}`);
    }

    runInherit("git pull");

    // criar branch release
    runInherit(`git checkout -b ${branchName}`);

    // criar release notes
    const releasePath = createReleaseNotes({ version: nextVersion, today });
    console.log(`📄 Release note criado: ${releasePath}`);

    // commit
    runInherit(`git add ${releasePath}`);
    runInherit(`git commit -m "docs: add release notes for ${nextVersion}"`);

    // push
    runInherit(`git push -u origin ${branchName}`);

    // criar PR
    const body = [
        `## Release ${nextVersion}`,
        ``,
        `✅ Release notes criado em: \`${releasePath}\``,
        ``,
        `### Checklist`,
        `- [ ] \`npm run validate\``,
        `- [ ] Deploy em staging`,
        `- [ ] Smoke tests (Antigravity)`,
        `- [ ] Go/No-Go`,
        `- [ ] Deploy produção`,
        ``,
        `> Dica: atualize o arquivo de release notes conforme o release evolui.`,
    ].join("\n");

    runInherit(
        `gh pr create --repo ${repo} --base ${baseBranch} --head ${branchName} --title "${title}" --body "${body.replace(
            /"/g,
            '\\"'
        )}"`
    );

    console.log("🎉 PR criado com sucesso!");
    console.log("➡️ Abra o PR e siga o checklist de staging/smoke tests.");
}

main();
