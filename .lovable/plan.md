

## Módulo de Marketing AI para Depoimentos

### Visão Geral
Adicionar um botão "Gerar versão marketing" em cada depoimento no painel `/admin`. Ao clicar, o sistema envia as respostas brutas para a Lovable AI Gateway (via edge function) e retorna o depoimento transformado em 5 formatos prontos para uso. O resultado é exibido em um modal/drawer premium com abas para cada formato e botões de copiar.

### Arquitetura

```text
Admin Card → Botão "✨ Gerar Marketing"
     ↓
Edge Function (supabase/functions/generate-marketing/index.ts)
     ↓
Lovable AI Gateway (gemini-3-flash-preview)
     ↓
JSON estruturado via tool calling
     ↓
Modal com abas: Headline | Completo | Curto | Quotes | Classificação
```

### Arquivos a Criar/Modificar

#### 1. Habilitar Lovable Cloud
Necessário para deploy da edge function e uso do LOVABLE_API_KEY (já disponível).

#### 2. `supabase/functions/generate-marketing/index.ts` (novo)
Edge function que:
- Recebe: `{ name, role, company, mentorshipType, answers, impactPhrase, measurableResult }`
- Monta prompt em português com regras de tom, fidelidade e ajuste por tipo de mentoria
- Usa tool calling para retornar JSON estruturado com os 5 formatos
- Schema de saída:
  - `headline`: string (frase de impacto)
  - `fullTestimonial`: string (depoimento completo para página de vendas)
  - `shortVersion`: string (versão curta 2-3 linhas)
  - `quotes`: string[] (3 frases destacáveis)
  - `classification`: { before, during, after, result, socialProof, differentiator }
  - `suggestedPageTitle`: string
  - `bestQuote`: string
  - `formattedAttribution`: string (ex: "Ana Silva, VP de Operações — Grupo ABC")

#### 3. `src/lib/marketing-types.ts` (novo)
Interface `MarketingOutput` com os campos acima.

#### 4. `src/components/MarketingModal.tsx` (novo)
Modal/dialog premium com:
- Abas: Headline | Depoimento Completo | Versão Curta | Quotes | Classificação
- Botão de copiar em cada seção
- Visual consistente com o design glass morphism
- Estado de loading com skeleton animado
- Responsivo (sheet no mobile, dialog no desktop)

#### 5. `src/pages/Admin.tsx` (modificar)
- Adicionar botão "✨ Gerar Marketing" no footer de cada card
- Estado para controlar modal aberto e dados gerados
- Chamada à edge function via `supabase.functions.invoke`
- Cache local dos resultados já gerados (evitar chamadas repetidas)

#### 6. `src/integrations/supabase/` (novo — setup mínimo)
Client Supabase para invocar edge functions (usa env vars VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY providos pelo Lovable Cloud).

### Prompt da AI (resumo)
O system prompt instrui o modelo a:
- Reescrever mantendo a voz original da cliente
- Ajustar foco por tipo de mentoria (LinkedIn → visibilidade; Empreendedorismo → decisão; Carreira → posicionamento; Virada → clareza interna)
- Não inventar resultados ou exagerar números
- Gerar texto fluido, elegante, em parágrafos curtos
- Estruturar o depoimento completo em: Antes → Experiência → Transformação → Resultado → Diferencial → Recomendação

### UX no Admin
- Botão discreto mas visível no footer de cada card
- Loading state com shimmer/skeleton
- Resultado abre em modal com tabs navegáveis
- Cada seção tem ícone de copiar que muda para checkmark ao clicar
- Toast de confirmação ao copiar

