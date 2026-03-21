import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const mentorshipFocus: Record<string, string> = {
  empreendedorismo:
    "Foco em clareza, decisão e construção. A pessoa saiu do corporativo para empreender.",
  crescimento:
    "Foco em posicionamento executivo e avanço de carreira. A pessoa buscou crescimento, mudança de área ou nova empresa.",
  virada:
    "Foco em mudança interna e clareza. A pessoa teve uma virada de chave a partir de uma conversa estratégica pontual.",
  linkedin:
    "Foco em posicionamento, visibilidade e oportunidades via LinkedIn.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, role, company, mentorshipType, answers, impactPhrase, measurableResult } =
      await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const focus = mentorshipFocus[mentorshipType] || "";

    const systemPrompt = `Você é um especialista em copywriting para páginas de vendas de mentorias executivas femininas, voltadas para mulheres em posições de liderança e decisão.

Regras obrigatórias:
- Mantenha a voz e linguagem original da cliente
- NÃO invente resultados ou números que não foram mencionados
- NÃO exagere ou adicione informações falsas
- Melhore clareza e fluidez sem perder autenticidade
- Tom: profissional, confiável, elegante, sofisticado
- Parágrafos curtos e fluidos
- ${focus}

PRIORIDADES DE TRANSFORMAÇÃO:
- Mudança de comportamento (como a pessoa age diferente agora)
- Clareza estratégica (como passou a enxergar cenários com mais nitidez)
- Tomada de decisão (como passou a decidir com mais segurança)
- Posicionamento (como se posiciona profissionalmente agora)

LINGUAGEM PROIBIDA — nunca use estas expressões:
- "foi incrível", "me ajudou muito", "foi bom", "é divertida", "foi maravilhoso", "super recomendo", "amei", "mudou minha vida"
- Substitua sempre por descrições concretas de mudança, ação ou resultado

PÚBLICO-ALVO:
- Mulheres executivas e líderes
- Linguagem sofisticada, sem diminutivos ou informalidade excessiva
- Foco em decisão, posicionamento e resultado estratégico

TRANSFORMAÇÃO DE RESPOSTAS SIMPLES:
- Mesmo respostas curtas devem gerar saídas fortes e utilizáveis
- Exemplo: entrada "criei um plano e implementei" → saída "Passei de um cenário sem direção para um plano estruturado e execução clara"
- Exemplo: entrada "me sinto mais confiante" → saída "Conquistei uma segurança que me permite tomar decisões estratégicas sem hesitação"

A atribuição formatada é: "${name}, ${role} — ${company}"`;

    const userPrompt = `Transforme estas respostas brutas de depoimento em conteúdo de marketing pronto para uso.

Nome: ${name}
Cargo: ${role}
Empresa: ${company}
Tipo de mentoria: ${mentorshipType}

Respostas do formulário:
${answers.map((a: string, i: number) => `${i + 1}. ${a}`).join("\n")}

Frase de impacto: ${impactPhrase || "Não informada"}
Resultado mensurável: ${measurableResult || "Não informado"}

Gere o conteúdo de marketing estruturado.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_marketing_content",
              description:
                "Gera conteúdo de marketing estruturado a partir de um depoimento bruto",
              parameters: {
                type: "object",
                properties: {
                  headline: {
                    type: "string",
                    description: "Frase de impacto curta baseada na transformação",
                  },
                    fullTestimonial: {
                    type: "string",
                    description:
                      "Depoimento completo estruturado: História (Antes — situação/dor) → Experiência (Durante — o que viveu) → Transformação (Depois — mudança concreta) → Resultado (concreto ou comportamental) → Frase final de impacto. Parágrafos curtos. Linguagem sofisticada, sem clichês.",
                  },
                  shortVersion: {
                    type: "string",
                    description: "Versão curta (2-3 linhas) para redes sociais, focada em transformação e resultado",
                  },
                  quotes: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-3 frases fortes e destacáveis para artes e carrosséis, com foco em decisão, posicionamento e clareza estratégica. Nunca usar linguagem genérica.",
                  },
                  classification: {
                    type: "object",
                    properties: {
                      before: { type: "string", description: "Situação antes da mentoria" },
                      during: { type: "string", description: "Experiência durante a mentoria" },
                      after: { type: "string", description: "Transformação após a mentoria" },
                      result: { type: "string", description: "Resultado concreto ou percebido" },
                      socialProof: { type: "string", description: "Elemento de prova social" },
                      differentiator: { type: "string", description: "Diferencial percebido da mentora" },
                    },
                    required: ["before", "during", "after", "result", "socialProof", "differentiator"],
                    additionalProperties: false,
                  },
                  suggestedPageTitle: {
                    type: "string",
                    description: "Título sugerido para landing page",
                  },
                  bestQuote: {
                    type: "string",
                    description: "A melhor frase única do depoimento",
                  },
                  formattedAttribution: {
                    type: "string",
                    description: "Nome + cargo formatados (ex: Ana Silva, VP de Operações — Grupo ABC)",
                  },
                },
                required: [
                  "headline",
                  "fullTestimonial",
                  "shortVersion",
                  "quotes",
                  "classification",
                  "suggestedPageTitle",
                  "bestQuote",
                  "formattedAttribution",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_marketing_content" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos na sua conta Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar conteúdo de marketing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      return new Response(
        JSON.stringify({ error: "Resposta inesperada da IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const marketingContent = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(marketingContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-marketing error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
