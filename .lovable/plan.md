

## Problema Identificado

Os depoimentos estão sendo salvos em **localStorage** (armazenamento local do navegador). Quando a Bel preencheu o formulário no celular dela, os dados ficaram **apenas no navegador dela**. Quando você acessa o `/admin` no seu computador, o localStorage está vazio — por isso aparece "Nenhum depoimento coletado ainda".

## Solução: Persistir no Banco de Dados

Migrar o armazenamento de localStorage para o banco de dados do Lovable Cloud, para que depoimentos preenchidos por qualquer pessoa em qualquer dispositivo apareçam no admin.

### 1. Criar tabela `testimonials` no banco
- Colunas: id, name, role, company, mentorship_type, answers (jsonb), impact_phrase, measurable_result, satisfaction_score, would_recommend, authorized, photo, summary, quote, before_text, after_text, result_text, created_at
- RLS: INSERT liberado para anônimos (formulário público), SELECT protegido (apenas via senha no admin)

### 2. Atualizar `src/lib/testimonial-data.ts`
- `saveTestimonial()` → inserir no banco via Supabase client
- `getTestimonials()` → buscar do banco via Supabase client
- Manter funções síncronas de fallback para não quebrar nada

### 3. Atualizar `src/pages/Index.tsx`
- Chamar a versão async de `saveTestimonial()` no submit

### 4. Atualizar `src/pages/Admin.tsx`
- Carregar depoimentos do banco (async) em vez de localStorage

### Resultado
O depoimento da Bel (e de qualquer pessoa futura) aparecerá no admin independente do dispositivo.

