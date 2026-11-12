// Tudo que é "do fotógrafo" fica aqui. Troque os dados e pronto.
export const site = {
  nome: 'Pedro Gomes',
  url: 'https://pedrogomes.com.br',
  especialidade: 'Fotografia de moda, retrato e campanha',
  cidade: 'São Paulo',
  email: 'contato@pedrogomes.com.br',
  instagram: 'pedrogomes.foto',
  descricao:
    'Pedro Gomes fotografa moda, retrato e campanhas para marcas e editoras. Base em São Paulo, trabalhos em todo o Brasil.',
  bio: [
    'Fotografo pessoas há doze anos. Comecei em laboratório de revelação no Bom Retiro e ainda penso a luz como pensava no papel: pouca, lateral e com sombra de verdade.',
    'Hoje faço editoriais, campanhas e retratos para marcas de moda, varejo e esporte. Trabalho com equipe pequena e gosto de chegar cedo na locação.',
  ],
  clientes: ['Kalunga', 'Confederação Brasileira de Artes Marciais Chinesas', 'Oruã Linho', 'Sabiá Alfaiataria', 'Cardume Surfwear', 'Revista Fôlego'],
  // Reel da home: arquivos gerados por scripts/encode-video.sh com o nome "reel".
  // Se o filme completo estiver no Vimeo, coloque o ID aqui (ex.: '76979871').
  // Vazio = o botão abre o próprio arquivo do reel, com controles.
  reel: { nome: 'reel', vimeoId: '' },
};
