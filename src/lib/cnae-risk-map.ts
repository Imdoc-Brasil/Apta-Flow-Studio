
// Mapeamento de CNAE para Grau de Risco (NR-4)
// Esta é uma lista de exemplos e não é exaustiva.
// Em uma aplicação real, isso poderia vir de um banco de dados ou uma API.

export interface CnaeData {
  code: string
  description: string
  riskLevel: number
}

export const cnaeList: CnaeData[] = [
  // Grau de Risco 1
  { code: '4753900', description: 'Comércio varejista especializado de eletrodomésticos e equipamentos de áudio e vídeo', riskLevel: 1 },
  { code: '4761001', description: 'Comércio varejista de livros', riskLevel: 1 },
  { code: '4761003', description: 'Comércio varejista de artigos de papelaria', riskLevel: 1 },
  { code: '5811500', description: 'Edição de livros', riskLevel: 1 },
  { code: '6201501', description: 'Desenvolvimento de programas de computador sob encomenda', riskLevel: 1 },
  { code: '6202300', description: 'Desenvolvimento e licenciamento de programas de computador customizáveis', riskLevel: 1 },
  { code: '6203100', description: 'Desenvolvimento e licenciamento de programas de computador não-customizáveis', riskLevel: 1 },
  { code: '6204000', description: 'Consultoria em tecnologia da informação', riskLevel: 1 },
  { code: '6209100', description: 'Suporte técnico, manutenção e outros serviços em tecnologia da informação', riskLevel: 1 },
  { code: '6311900', description: 'Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet', riskLevel: 1 },
  { code: '6319400', description: 'Portais, provedores de conteúdo e outros serviços de informação na internet', riskLevel: 1 },
  { code: '6920601', description: 'Atividades de contabilidade', riskLevel: 1 },
  { code: '7020400', description: 'Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica', riskLevel: 1 },
  { code: '7311400', description: 'Agências de publicidade', riskLevel: 1 },
  { code: '7319003', description: 'Marketing direto', riskLevel: 1 },
  { code: '7490104', description: 'Atividades de consultoria em gestão da qualidade', riskLevel: 1 },
  { code: '8211300', description: 'Serviços combinados de escritório e apoio administrativo', riskLevel: 1 },
  { code: '8230001', description: 'Serviços de organização de feiras, congressos, exposições e festas', riskLevel: 1 },
  { code: '8550302', description: 'Atividades de apoio à educação, exceto caixas escolares', riskLevel: 1 },
  { code: '8599604', description: 'Treinamento em desenvolvimento profissional e gerencial', riskLevel: 1 },
  { code: '9319101', description: 'Produção e promoção de eventos esportivos', riskLevel: 1 },

  // Grau de Risco 2
  { code: '4530703', description: 'Comércio a varejo de peças e acessórios novos para veículos automotores', riskLevel: 2 },
  { code: '4649401', description: 'Comércio atacadista de equipamentos elétricos de uso pessoal e doméstico', riskLevel: 2 },
  { code: '4711302', description: 'Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados', riskLevel: 2 },
  { code: "4721102", description: "Padaria e confeitaria com predominância de revenda", riskLevel: 2 },
  { code: '4744001', description: 'Comércio varejista de ferragens e ferramentas', riskLevel: 2 },
  { code: '4744099', description: 'Comércio varejista de materiais de construção em geral', riskLevel: 2 },
  { code: '4751201', description: 'Comércio varejista especializado de equipamentos e suprimentos de informática', riskLevel: 2 },
  { code: '4771701', description: 'Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas', riskLevel: 2 },
  { code: '4772500', description: 'Comércio varejista de cosméticos, produtos de perfumaria e de higiene pessoal', riskLevel: 2 },
  { code: '4781400', description: 'Comércio varejista de artigos do vestuário e acessórios', riskLevel: 2 },
  { code: '5211799', description: 'Depósitos de mercadorias para terceiros, exceto armazéns gerais e guarda-móveis', riskLevel: 2 },
  { code: '5611201', description: 'Restaurantes e similares', riskLevel: 2 },
  { code: '5611203', description: 'Lanchonetes, casas de chá, de sucos e similares', riskLevel: 2 },
  { code: '7739099', description: 'Aluguel de outras máquinas e equipamentos comerciais e industriais não especificados anteriormente, sem operador', riskLevel: 2 },
  { code: '8121400', description: 'Limpeza em prédios e em domicílios', riskLevel: 2 },
  { code: '8630502', description: 'Atividade médica ambulatorial com recursos para realização de exames complementares', riskLevel: 2 },
  { code: '8630503', description: 'Atividade médica ambulatorial restrita a consultas', riskLevel: 2 },
  { code: '8650001', description: 'Atividades de enfermagem', riskLevel: 2 },
  { code: '8650002', description: 'Atividades de profissionais da nutrição', riskLevel: 2 },
  { code: '8650003', description: 'Atividades de psicologia e psicanálise', riskLevel: 2 },
  { code: '8650004', description: 'Atividades de fisioterapia', riskLevel: 2 },

  // Grau de Risco 3
  { code: '0111302', description: 'Cultivo de milho', riskLevel: 3 },
  { code: '0113000', description: 'Cultivo de cana-de-açúcar', riskLevel: 3 },
  { code: '0151201', description: 'Criação de bovinos para corte', riskLevel: 3 },
  { code: '0210107', description: 'Extração de madeira em florestas plantadas', riskLevel: 3 },
  { code: '1011201', description: 'Frigorífico - abate de bovinos', riskLevel: 3 },
  { code: '1012101', description: 'Abate de aves', riskLevel: 3 },
  { code: '1091101', description: 'Fabricação de produtos de panificação industrial', riskLevel: 3 },
  { code: '2062200', description: 'Fabricação de produtos de limpeza e polimento', riskLevel: 3 },
  { code: '2330301', description: 'Fabricação de estruturas pré-moldadas de concreto armado, em série e sob encomenda', riskLevel: 3 },
  { code: '2441501', description: 'Produção de alumínio e suas ligas em formas primárias', riskLevel: 3 },
  { code: '2511000', description: 'Fabricação de estruturas metálicas', riskLevel: 3 },
  { code: '2539001', description: 'Serviços de usinagem, tornearia e solda', riskLevel: 3 },
  { code: '3314710', description: 'Manutenção e reparação de máquinas e equipamentos para uso geral não especificados anteriormente', riskLevel: 3 },
  { code: '3811400', description: 'Coleta de resíduos não-perigosos', riskLevel: 3 },
  { code: '4120400', description: 'Construção de edifícios', riskLevel: 3 },
  { code: '4211101', description: 'Construção de rodovias e ferrovias', riskLevel: 3 },
  { code: '4321500', description: 'Instalação e manutenção elétrica', riskLevel: 3 },
  { code: '4330404', description: 'Serviços de pintura de edifícios em geral', riskLevel: 3 },
  { code: '4921301', description: 'Transporte rodoviário coletivo de passageiros, com itinerário fixo, municipal', riskLevel: 3 },
  { code: '4930202', description: 'Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal, interestadual e internacional', riskLevel: 3 },
  { code: '8610101', description: 'Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências', riskLevel: 3 },
  { code: '8610102', description: 'Atividades de atendimento em pronto-socorro e unidades hospitalares para atendimento a urgências', riskLevel: 3 },

  // Grau de Risco 4
  { code: '0500301', description: 'Extração de carvão mineral', riskLevel: 4 },
  { code: '0600001', description: 'Extração de petróleo e gás natural', riskLevel: 4 },
  { code: '0710301', description: 'Extração de minério de ferro', riskLevel: 4 },
  { code: '0910600', description: 'Atividades de apoio à extração de petróleo e gás natural', riskLevel: 4 },
  { code: '1921700', description: 'Fabricação de produtos do refino de petróleo', riskLevel: 4 },
  { code: '2011800', description: 'Fabricação de cloro e álcalis', riskLevel: 4 },
  { code: '2021500', description: 'Fabricação de produtos petroquímicos básicos', riskLevel: 4 },
  { code: '2320600', description: 'Fabricação de cimento', riskLevel: 4 },
  { code: '2399101', description: 'Decoração, lapidação, gravação, vitrificação e outros trabalhos em cerâmica, louça, vidro e cristal', riskLevel: 4 },
  { code: '2411300', description: 'Produção de ferro-gusa', riskLevel: 4 },
  { code: '2422901', description: 'Produção de laminados planos de aço ao carbono, revestidos ou não', riskLevel: 4 },
  { code: '2591800', description: 'Fabricação de artigos de cutelaria', riskLevel: 4 },
  { code: '2910701', description: 'Fabricação de automóveis, camionetas e utilitários', riskLevel: 4 },
  { code: '3511501', description: 'Geração de energia elétrica', riskLevel: 4 },
  { code: '3822000', description: 'Tratamento e disposição de resíduos perigosos', riskLevel: 4 }
]

export const cnaeToRiskLevelMap: { [key: string]: number } = cnaeList.reduce(
  (acc, item) => {
    acc[item.code] = item.riskLevel
    return acc
  },
  {} as { [key: string]: number }
)
