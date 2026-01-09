#!/usr/bin/env node

const { execSync } = require("child_process");

function run(cmd) {
    return execSync(cmd, { encoding: "utf8" }).trim();
}

function runInherit(cmd) {
    execSync(cmd, { stdio: "inherit" });
}

function ensureOnMain() {
    const branch = run("git rev-parse --abbrev-ref HEAD");
    if (branch !== "main") {
        console.error("❌ Você não está na branch main.");
        console.error("➡️ Rode: git checkout main");
        process.exit(1);
    }
}

function ensureCleanWorkingTree() {
    const status = run("git status --porcelain");
    if (status) {
        console.error("❌ Working tree não está limpo.");
        console.error("➡️ Faça commit/stash antes de shippar.");
        process.exit(1);
    }
}

function getLastTag() {
    try {
        return run("git describe --tags --abbrev=0");
    } catch {
        return null;
    }
}

function getVersionArg() {
    return process.argv[2];
}

function ensureGhInstalled() {
    try {
        run("gh --version");
    } catch {
        console.error("❌ GitHub CLI não encontrado (gh).");
        process.exit(1);
    }
}

function main() {
    ensureGhInstalled();
    ensureOnMain();
    ensureCleanWorkingTree();

    const version = getVersionArg() || getLastTag();
    if (!version) {
        console.error("❌ Não encontrei tag anterior e nenhuma versão foi passada.");
        console.error("➡️ Uso: npm run release:ship -- vX.Y.Z");
        process.exit(1);
    }

    console.log(`🚀 Ship do release: ${version}`);

    // criar tag (se ainda não existir)
    const tags = run("git tag");
    if (!tags.split("\n").includes(version)) {
        runInherit(`git tag ${version}`);
        console.log(`✅ Tag criada: ${version}`);
    } else {
        console.log(`ℹ️ Tag já existe: ${version}`);
    }

    // push tag
    runInherit(`git push origin ${version}`);

    // criar GitHub Release (opcional)
    // Se você não quiser, basta comentar esse bloco.
    runInherit(`gh release create ${version} --title "${version}" --generate-notes`);

    console.log("🎉 Release publicado no GitHub!");
}

main();
