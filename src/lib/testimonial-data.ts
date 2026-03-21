export type MentorshipType = 'empreendedorismo' | 'crescimento' | 'virada' | 'linkedin';

export const mentorshipLabels: Record<MentorshipType, string> = {
  empreendedorismo: 'Transição do corporativo para empreender',
  crescimento: 'Crescimento / mudança de área / nova empresa',
  virada: 'Virada de chave (mentoria pontual / conversa estratégica)',
  linkedin: 'Posicionamento e estratégia de LinkedIn',
};

export const conditionalQuestions: Record<MentorshipType, string[]> = {
  empreendedorismo: [
    'Como você estava quando começou — qual era a sua situação de carreira?',
    'O que mais te surpreendeu na forma como eu trabalho?',
    'Qual foi o resultado mais concreto que você conseguiu durante ou após a mentoria?',
    'O que você diria para uma executiva que está pensando em empreender?',
  ],
  crescimento: [
    'O que te levou a buscar apoio nesse momento de transição?',
    'O que mudou na forma como você passou a se posicionar na sua carreira?',
    'O que eu faço diferente de outros profissionais que orientam executivos?',
    'O que você diria para uma executiva no mesmo momento que você estava?',
  ],
  virada: [
    'Como você estava quando a gente conversou — profissional e pessoalmente?',
    'O que aconteceu depois daquela conversa?',
    'O que mudou na sua vida e carreira após isso?',
    'O que você diria para alguém que está hesitando em dar esse passo?',
  ],
  linkedin: [
    'Por que você buscou ajuda com o LinkedIn — o que não estava funcionando?',
    'O que mais te surpreendeu no processo?',
    'O que mudou após a otimização do seu perfil?',
    'O que você diria para alguém que está considerando fazer o mesmo?',
  ],
};

export interface Testimonial {
  id: string;
  timestamp: string;
  name: string;
  role: string;
  company: string;
  mentorshipType: MentorshipType;
  answers: string[];
  impactPhrase: string;
  measurableResult: string;
  satisfactionScore: number;
  wouldRecommend: boolean;
  authorized: boolean;
  photo?: string;
  // Generated fields
  summary: string;
  quote: string;
  before: string;
  after: string;
  result: string;
}

export function generateSmartFields(
  mentorshipType: MentorshipType,
  answers: string[],
  impactPhrase: string,
  measurableResult: string,
  name: string,
): { summary: string; quote: string; before: string; after: string; result: string } {
  const [a1, a2, a3, a4] = answers;

  // Before: always first answer (situation before)
  const before = a1 || '';

  // After: second or third answer (transformation)
  const after = mentorshipType === 'virada' ? (a3 || a2 || '') : (a2 || '');

  // Result: third answer or measurable result
  const result = measurableResult || a3 || '';

  // Find longest answer as quote
  const longestAnswer = [...answers, impactPhrase].filter(Boolean).sort((a, b) => b.length - a.length)[0] || '';
  // Take first 2 sentences as quote
  const sentences = longestAnswer.match(/[^.!?]+[.!?]+/g) || [longestAnswer];
  const quote = sentences.slice(0, 2).join(' ').trim();

  // Summary: combine key elements
  const summaryParts = [
    impactPhrase,
    measurableResult ? `Resultado: ${measurableResult}` : '',
  ].filter(Boolean);
  const summary = summaryParts.length > 0
    ? summaryParts.join('. ')
    : `${name} passou pela mentoria de ${mentorshipLabels[mentorshipType].toLowerCase()} e obteve resultados significativos.`;

  return { summary, quote, before, after, result };
}

export function getTestimonials(): Testimonial[] {
  try {
    const data = localStorage.getItem('testimonials');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTestimonial(testimonial: Testimonial): void {
  const existing = getTestimonials();
  existing.push(testimonial);
  localStorage.setItem('testimonials', JSON.stringify(existing));
}

export function exportToCSV(testimonials: Testimonial[]): string {
  if (testimonials.length === 0) return '';

  const headers = [
    'Data', 'Nome', 'Cargo', 'Empresa', 'Tipo de Mentoria',
    'Pergunta 1', 'Resposta 1', 'Pergunta 2', 'Resposta 2',
    'Pergunta 3', 'Resposta 3', 'Pergunta 4', 'Resposta 4',
    'Frase de Impacto', 'Resultado Mensurável', 'Nota', 'Indicaria',
    'Resumo', 'Quote', 'Antes', 'Depois', 'Resultado',
  ];

  const escape = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;

  const rows = testimonials.map((t) => {
    const questions = conditionalQuestions[t.mentorshipType];
    return [
      escape(new Date(t.timestamp).toLocaleDateString('pt-BR')),
      escape(t.name), escape(t.role), escape(t.company),
      escape(mentorshipLabels[t.mentorshipType]),
      ...questions.flatMap((q, i) => [escape(q), escape(t.answers[i] || '')]),
      escape(t.impactPhrase), escape(t.measurableResult),
      t.satisfactionScore.toString(), t.wouldRecommend ? 'Sim' : 'Não',
      escape(t.summary), escape(t.quote),
      escape(t.before), escape(t.after), escape(t.result),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
