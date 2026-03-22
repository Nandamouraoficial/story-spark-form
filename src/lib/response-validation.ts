import { MentorshipType } from './testimonial-data';

const GENERIC_PATTERNS = [
  /^(foi|era|é|estava|estou|fiquei|ficou)\s+(bom|boa|ótimo|ótima|legal|interessante|incrível|maravilhos[oa]|divertid[oa]|bacana|show|top|excelente|massa)\.?$/i,
  /^me (ajudou|ajuda|inspirou|motivou)\.?$/i,
  /^(muito|super|bem)\s+(bom|boa|legal|interessante|top)\.?$/i,
  /^(gostei|amei|adorei|curti|recomendo)\.?$/i,
  /^(siga em frente|vá em frente|não desista|vai dar certo|vale a pena)\.?$/i,
  /^(estava triste|estou feliz|estou melhor|me sinto melhor|mudou minha vida)\.?$/i,
  /^(sim|não|claro|com certeza|óbvio|sempre|nunca)\.?$/i,
  /^(tudo|nada|muito|pouco|bastante|demais)\.?$/i,
];

const CONTEXT_INDICATORS = [
  'quando', 'porque', 'pois', 'já que', 'antes', 'depois', 'durante',
  'exemplo', 'situação', 'momento', 'período', 'fase', 'etapa',
  'consegui', 'percebi', 'entendi', 'aprendi', 'descobri', 'decidi',
  'resultado', 'impacto', 'mudança', 'transformação', 'diferença',
  'empresa', 'equipe', 'projeto', 'cliente', 'cargo', 'posição',
  'promoção', 'aumento', 'contrato', 'proposta', 'oportunidade',
  'clareza', 'direção', 'segurança', 'confiança', 'estratégia',
  'específic', 'concret', 'prático', 'real',
];

export type QualityLevel = 'empty' | 'weak' | 'fair' | 'strong';

export interface QualityAnalysis {
  level: QualityLevel;
  reason: string;
  /** @deprecated use level instead */
  isGeneric: boolean;
}

export function analyzeResponseQuality(text: string, hasChips = false): QualityAnalysis {
  const trimmed = text.trim();
  if (!trimmed) return { level: 'empty', reason: 'empty', isGeneric: true };

  const lower = trimmed.toLowerCase();

  // Check generic patterns
  for (const pattern of GENERIC_PATTERNS) {
    if (pattern.test(lower)) {
      return { level: 'weak', reason: 'vague', isGeneric: true };
    }
  }

  // If very short and no chips selected, suggest improvement (non-blocking)
  if (trimmed.length < 10 && !hasChips) {
    return { level: 'weak', reason: 'short', isGeneric: false };
  }

  // Check for context indicators
  const hasContext = CONTEXT_INDICATORS.some((ind) => lower.includes(ind));
  if (hasContext) {
    return { level: 'strong', reason: '', isGeneric: false };
  }

  return { level: 'fair', reason: '', isGeneric: false };
}

const EXAMPLES_BY_TYPE: Record<MentorshipType, string[]> = {
  empreendedorismo: [
    'Eu estava há 15 anos no corporativo e não conseguia enxergar como começar algo próprio. Tinha medo de perder a estabilidade.',
    'A Fulana me fez enxergar que eu já tinha as competências — faltava um plano. Em 3 meses estruturei meu primeiro produto.',
    'O resultado mais concreto foi faturar R$ 40 mil no primeiro trimestre e montar uma carteira de 8 clientes recorrentes.',
    'Se você sente que chegou no teto do corporativo, essa mentoria vai mostrar que existe um caminho possível — e mais perto do que você imagina.',
  ],
  crescimento: [
    'Eu tinha acabado de ser promovida e me sentia insegura no novo cargo. Não sabia como me posicionar com pares mais seniores.',
    'Mudou completamente minha forma de me apresentar — passei a comunicar meu valor com clareza e assertividade.',
    'A diferença é que ela não dá fórmulas prontas. Ela entende o contexto e constrói junto. É uma parceria real.',
    'Se você está num momento de transição, ter alguém com experiência real ao lado faz toda a diferença na velocidade e na segurança.',
  ],
  virada: [
    'Eu estava num momento de esgotamento total — não conseguia tomar decisões, me sentia paralisada profissionalmente.',
    'Depois daquela conversa eu finalmente tive coragem de recusar uma proposta que não fazia sentido e buscar o que eu realmente queria.',
    'Em dois meses mudei de empresa, negociei um salário 30% maior e voltei a ter prazer no trabalho.',
    'Não espere estar pronta. Uma conversa estratégica no momento certo pode economizar anos de indecisão.',
  ],
  linkedin: [
    'Meu perfil estava parado há anos, sem foto profissional, sem resumo, e eu nunca recebia contato de recrutadores.',
    'Fiquei surpresa com a profundidade — não foi só sobre palavras-chave, foi sobre posicionamento real e estratégia de conteúdo.',
    'Em 30 dias recebi 4 propostas de empresas e minha rede cresceu 40%. O perfil passou a trabalhar por mim.',
    'Se seu LinkedIn não está trazendo oportunidades, o problema não é o mercado — é como você está se apresentando nele.',
  ],
};

export function getExampleForQuestion(mentorshipType: MentorshipType, questionIndex: number): string {
  return EXAMPLES_BY_TYPE[mentorshipType]?.[questionIndex] || EXAMPLES_BY_TYPE[mentorshipType]?.[0] || '';
}

export function getComplementaryPrompt(): string {
  return 'Pode dar um exemplo específico do que aconteceu?';
}
