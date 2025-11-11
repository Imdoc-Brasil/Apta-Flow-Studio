
// Mapeamento de CNAE para Grau de Risco (NR-4)
// Esta é uma lista de exemplos e não é exaustiva.
// Em uma aplicação real, isso poderia vir de um banco de dados ou uma API.

export const cnaeToRiskLevelMap: { [key: string]: number } = {
  // Grau de Risco 1
  '6201501': 1, // Desenvolvimento de programas de computador sob encomenda
  '8550302': 1, // Atividades de apoio à educação, exceto caixas escolares
  '9319101': 1, // Produção e promoção de eventos esportivos

  // Grau de Risco 2
  '4711302': 2, // Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados
  '5611201': 2, // Restaurantes e similares
  '8630503': 2, // Atividade médica ambulatorial restrita a consultas

  // Grau de Risco 3
  '0111302': 3, // Cultivo de milho
  '1012101': 3, // Abate de aves
  '4930202': 3, // Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal, interestadual e internacional
  '8610101': 3, // Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências
  
  // Grau de Risco 4
  '0500301': 4, // Extração de carvão mineral
  '0910600': 4, // Atividades de apoio à extração de petróleo e gás natural
  '2399101': 4, // Decoração, lapidação, gravação, vitrificação e outros trabalhos em cerâmica, louça, vidro e cristal
};
