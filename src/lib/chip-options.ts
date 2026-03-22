import { MentorshipType } from './testimonial-data';

const chipMap: Record<MentorshipType, Record<number, string[]>> = {
  crescimento: {
    0: [
      'falta de clareza sobre próximo passo',
      'estagnação na carreira',
      'busca por promoção',
      'mudança de área ou empresa',
      'reposicionamento profissional',
      'insegurança nas decisões',
    ],
    1: [
      'passei a me posicionar com mais segurança',
      'comecei a participar de processos seletivos',
      'parei de esperar estar 100% pronta',
      'comecei a me expor mais estrategicamente',
      'passei a comunicar melhor o que eu quero',
      'comecei a me posicionar dentro da empresa',
      'me sinto mais confiante para negociar',
      'tomo decisões com mais clareza',
    ],
    2: [
      'me candidatei a novas oportunidades',
      'participei de processos seletivos',
      'conversei com lideranças sobre minha carreira',
      'passei a me posicionar com mais clareza',
      'comecei a negociar melhor',
      'assumi mais protagonismo',
      'parei de me sabotar',
    ],
    3: [
      'não espere estar pronta',
      'clareza economiza tempo',
      'buscar apoio acelera decisões',
      'posicionamento define o próximo passo',
      'vale pelo direcionamento estratégico',
    ],
  },
  empreendedorismo: {
    0: [
      'prestes a ser demitida',
      'insatisfeita no corporativo',
      'sem saber por onde começar',
      'com medo de perder estabilidade',
      'sentindo que chegou no teto',
      'querendo algo próprio mas sem plano',
    ],
    1: [
      'a clareza do método',
      'a escuta sem julgamento',
      'a velocidade do processo',
      'a visão estratégica',
      'o foco em ação e não só reflexão',
      'a personalização do acompanhamento',
    ],
    2: [
      'comecei a empreender',
      'consegui primeiros clientes',
      'lancei meu produto/serviço',
      'saí do corporativo com plano',
      'estruturei meu negócio',
      'ganhei segurança para decidir',
    ],
    3: [
      'não espere estar pronta',
      'ter apoio acelera tudo',
      'o medo diminui com clareza',
      'vale cada centavo',
      'muda sua perspectiva de carreira',
    ],
  },
  virada: {
    0: [
      'esgotada profissionalmente',
      'paralisada para decidir',
      'em crise na carreira',
      'pensando em desistir',
      'sem energia para continuar',
      'sentindo que perdi o rumo',
    ],
    1: [
      'tomei uma decisão que adiava há meses',
      'recusei algo que não fazia sentido',
      'mudei de empresa',
      'renegociei minha posição',
      'pedi demissão com plano',
      'voltei a ter clareza',
    ],
    2: [
      'mudei de empresa',
      'negociei melhor salário',
      'voltei a ter prazer no trabalho',
      'recuperei confiança',
      'saí da paralisia',
      'tomei decisões com mais segurança',
    ],
    3: [
      'uma conversa muda tudo',
      'não espere o burnout',
      'clareza economiza anos',
      'decisão certa no momento certo',
      'não precisa fazer sozinha',
    ],
  },
  linkedin: {
    0: [
      'perfil parado sem resultado',
      'não recebia contatos',
      'sem saber como me posicionar',
      'perfil desatualizado',
      'sem estratégia de conteúdo',
      'queria atrair oportunidades',
    ],
    1: [
      'a profundidade do trabalho',
      'não foi só estética, foi estratégia',
      'a clareza sobre posicionamento',
      'entendi como o LinkedIn funciona de verdade',
      'a velocidade do resultado',
    ],
    2: [
      'recebi propostas de empresas',
      'minha rede cresceu significativamente',
      'recrutadores começaram a me procurar',
      'o perfil trabalha por mim agora',
      'mais visibilidade no mercado',
      'convites para entrevistas',
    ],
    3: [
      'seu LinkedIn é sua vitrine profissional',
      'o problema não é o mercado, é como você aparece',
      'investir no perfil traz retorno rápido',
      'posicionamento muda tudo',
    ],
  },
};

export function getChipsForQuestion(mentorshipType: MentorshipType, questionIndex: number): string[] {
  return chipMap[mentorshipType]?.[questionIndex] || [];
}
