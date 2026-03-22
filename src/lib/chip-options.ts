import { MentorshipType } from './testimonial-data';

const chipMap: Record<MentorshipType, Record<number, string[]>> = {
  empreendedorismo: {
    0: [
      'Estava prestes a ser desligada e sem plano B',
      'Sentia que tinha chegado no teto do corporativo',
      'Queria empreender mas não sabia por onde começar',
      'Tinha medo de abrir mão da estabilidade de 20 anos',
      'Sabia que precisava mudar mas ficava adiando a decisão',
      'Já não me reconhecia no cargo que ocupava',
    ],
    1: [
      'A clareza do método — não foi coaching, foi estratégia real',
      'Ela ouve sem julgamento e devolve com direção',
      'Em poucas sessões eu já tinha um plano concreto na mão',
      'O foco é em ação, não em ficar refletindo sem sair do lugar',
      'Ela personaliza tudo — nada de fórmula pronta',
      'A visão estratégica de quem já esteve em posições de decisão',
    ],
    2: [
      'Lancei meu negócio próprio com estrutura e segurança',
      'Consegui meus primeiros clientes nos primeiros 3 meses',
      'Saí do corporativo com um plano claro de transição',
      'Estruturei minha oferta e comecei a faturar',
      'Ganhei segurança para tomar a decisão que vinha adiando',
      'Passei de ideia abstrata para negócio em funcionamento',
    ],
    3: [
      'Não espere estar 100% pronta — isso não vai acontecer',
      'Ter alguém com experiência real encurta o caminho em anos',
      'O medo não desaparece, mas com clareza ele para de travar',
      'Foi o melhor investimento que fiz na minha carreira',
      'Sozinha eu levaria o dobro do tempo para dar o primeiro passo',
      'Se você sente que chegou no teto, confie nesse sinal',
    ],
  },
  crescimento: {
    0: [
      'Não tinha clareza sobre qual deveria ser o próximo passo',
      'Sentia que minha carreira tinha estagnado',
      'Queria uma promoção mas não sabia como me posicionar para ela',
      'Precisava decidir entre mudar de área ou mudar de empresa',
      'Sabia que tinha que me reposicionar mas não sabia como',
      'Tomava decisões importantes sem segurança nenhuma',
    ],
    1: [
      'Me candidatei a posições que antes eu descartava sozinha',
      'Tive conversas diretas com a liderança sobre meu futuro',
      'Comecei a negociar antes de aceitar qualquer proposta',
      'Assumi protagonismo em vez de esperar ser escolhida',
      'Parei de me sabotar quando a oportunidade aparecia',
      'Passei a tratar minha carreira como projeto estratégico',
    ],
    2: [
      'Ela não dá fórmula pronta — constrói a estratégia junto com você',
      'Entende o contexto corporativo porque já viveu posições de decisão',
      'Foca em ação concreta, não em reflexão sem fim',
      'Trata sua carreira como projeto estratégico, não como terapia',
      'Personaliza tudo — cada sessão é pensada para o seu momento',
      'Combina visão de negócio com sensibilidade para o momento pessoal',
    ],
    3: [
      'Clareza sobre o que você quer economiza anos de carreira',
      'Buscar apoio não é fraqueza — é inteligência estratégica',
      'Posicionamento define quem chega e quem fica esperando',
      'O direcionamento certo muda a velocidade de tudo',
      'Não espere o desconforto virar crise para agir',
      'Se você sabe que precisa mudar, esse já é o sinal',
    ],
  },
  virada: {
    0: [
      'Esgotada — sem energia para tomar nenhuma decisão',
      'Paralisada entre ficar e sair, há meses',
      'Em crise silenciosa — ninguém via, mas eu sabia',
      'Pensando seriamente em desistir de tudo',
      'Funcionando no automático, sem direção',
      'Sentindo que tinha perdido o controle da minha trajetória',
    ],
    1: [
      'Tomei uma decisão que vinha adiando há meses',
      'Recusei uma proposta que não fazia sentido para mim',
      'Mudei de empresa em menos de 60 dias',
      'Renegociei minha posição com clareza e firmeza',
      'Pedi demissão com plano — não por impulso',
      'Voltei a enxergar o caminho com nitidez',
    ],
    2: [
      'Mudei de empresa e de patamar ao mesmo tempo',
      'Negociei um salário significativamente melhor',
      'Voltei a ter satisfação real no que faço',
      'Recuperei a confiança que achei que tinha perdido',
      'Saí da paralisia e comecei a agir com intenção',
      'Passei a tomar decisões com segurança, não com desespero',
    ],
    3: [
      'Uma conversa estratégica no momento certo muda a trajetória inteira',
      'Não espere chegar no burnout para buscar direção',
      'Clareza sobre o próximo passo economiza anos de indecisão',
      'A decisão certa no momento certo vale mais que qualquer título',
      'Você não precisa resolver isso sozinha — e nem deveria',
      'Se está hesitando, esse já é o sinal de que precisa de apoio',
    ],
  },
  linkedin: {
    0: [
      'Meu perfil existia mas não gerava nenhum resultado',
      'Nunca recebia contato de recrutadores ou oportunidades',
      'Não sabia como me posicionar para o público certo',
      'Perfil desatualizado que não refletia quem eu sou hoje',
      'Sem estratégia de conteúdo — postava sem direção',
      'Queria que o LinkedIn trabalhasse por mim, não o contrário',
    ],
    1: [
      'Não foi estética — foi reposicionamento estratégico real',
      'A profundidade do trabalho de posicionamento',
      'Entendi pela primeira vez como o LinkedIn realmente funciona',
      'A clareza sobre quem é meu público e como alcançá-lo',
      'A velocidade com que os resultados apareceram',
      'Ela entende de carreira executiva, não só de rede social',
    ],
    2: [
      'Recebi propostas concretas de empresas que me interessavam',
      'Minha rede cresceu com conexões qualificadas e relevantes',
      'Recrutadores começaram a me procurar ativamente',
      'O perfil passou a trabalhar por mim — mesmo sem eu postar',
      'Ganhei visibilidade com o público que realmente importa',
      'Comecei a receber convites para entrevistas e conversas',
    ],
    3: [
      'Seu LinkedIn é a primeira coisa que um recrutador ou cliente vê',
      'O problema não é o mercado — é como você está aparecendo nele',
      'O retorno vem rápido quando o posicionamento está certo',
      'Posicionamento correto muda quem te encontra e como te percebe',
      'Se seu perfil não traz oportunidades, ele está te custando dinheiro',
      'Investir em posicionamento é a decisão mais estratégica que tomei',
    ],
  },
};

export function getChipsForQuestion(mentorshipType: MentorshipType, questionIndex: number): string[] {
  return chipMap[mentorshipType]?.[questionIndex] || [];
}
