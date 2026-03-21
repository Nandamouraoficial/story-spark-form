import { supabase } from '@/integrations/supabase/client';

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
  const [a1, a2, a3] = answers;

  const before = a1 || '';
  const after = mentorshipType === 'virada' ? (a3 || a2 || '') : (a2 || '');
  const result = measurableResult || a3 || '';

  const longestAnswer = [...answers, impactPhrase].filter(Boolean).sort((a, b) => b.length - a.length)[0] || '';
  const sentences = longestAnswer.match(/[^.!?]+[.!?]+/g) || [longestAnswer];
  const quote = sentences.slice(0, 2).join(' ').trim();

  const summaryParts = [
    impactPhrase,
    measurableResult ? `Resultado: ${measurableResult}` : '',
  ].filter(Boolean);
  const summary = summaryParts.length > 0
    ? summaryParts.join('. ')
    : `${name} passou pela mentoria de ${mentorshipLabels[mentorshipType].toLowerCase()} e obteve resultados significativos.`;

  return { summary, quote, before, after, result };
}

// Save to Supabase
export async function saveTestimonial(testimonial: Testimonial): Promise<void> {
  const { error } = await supabase.from('testimonials' as any).insert({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    company: testimonial.company,
    mentorship_type: testimonial.mentorshipType,
    answers: testimonial.answers,
    impact_phrase: testimonial.impactPhrase,
    measurable_result: testimonial.measurableResult,
    satisfaction_score: testimonial.satisfactionScore,
    would_recommend: testimonial.wouldRecommend,
    authorized: testimonial.authorized,
    photo: testimonial.photo || null,
    summary: testimonial.summary,
    quote: testimonial.quote,
    before_text: testimonial.before,
    after_text: testimonial.after,
    result_text: testimonial.result,
    created_at: testimonial.timestamp,
  } as any);

  if (error) {
    console.error('Error saving testimonial:', error);
    throw error;
  }
}

// Fetch from Supabase
export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials' as any)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return ((data as any[]) || []).map((row: any) => ({
    id: row.id,
    timestamp: row.created_at,
    name: row.name,
    role: row.role,
    company: row.company,
    mentorshipType: row.mentorship_type as MentorshipType,
    answers: row.answers as string[],
    impactPhrase: row.impact_phrase,
    measurableResult: row.measurable_result,
    satisfactionScore: row.satisfaction_score,
    wouldRecommend: row.would_recommend,
    authorized: row.authorized,
    photo: row.photo,
    summary: row.summary,
    quote: row.quote,
    before: row.before_text,
    after: row.after_text,
    result: row.result_text,
  }));
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
