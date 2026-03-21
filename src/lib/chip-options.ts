import { MentorshipType } from './testimonial-data';

// Chips mapped by mentorship type and question index
const chipMap: Partial<Record<MentorshipType, Record<number, string[]>>> = {
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
};

export function getChipsForQuestion(mentorshipType: MentorshipType, questionIndex: number): string[] {
  return chipMap[mentorshipType]?.[questionIndex] || [];
}
