

## 5 Correções — Plano de Implementação

### 1. Validação Flexível (`response-validation.ts` + `Index.tsx`)

**`response-validation.ts`**: Reescrever `analyzeResponseQuality` para retornar 4 níveis em vez de boolean:
- `"empty"` — string vazia → bloquear
- `"weak"` — < 10 caracteres e sem chip selecionado → sugestão não-bloqueante
- `"fair"` — passou nos genéricos mas sem indicadores de contexto → aceitar com sugestão opcional
- `"strong"` — tem contexto/ação → aceitar direto

Remover checagem de `wordCount < 8` e `wordCount < 15`. Manter apenas lista de padrões genéricos e checagem de vazio.

Atualizar interface `QualityAnalysis` para `level: 'empty' | 'weak' | 'fair' | 'strong'` em vez de `isGeneric: boolean`.

**`Index.tsx` step 3**: Remover bloqueio por qualidade. Apenas bloquear se resposta estiver vazia. Se `level === 'weak'`: mostrar mensagem suave + botão "Continuar assim mesmo" que seta um flag para pular validação daquela pergunta. Se `fair`/`strong`: aceitar sem mensagem.

**`Index.tsx` step 4**: Mesmo comportamento para `impactPhrase`.

### 2. Chips para todos os tipos (`chip-options.ts`)

Adicionar mapeamento completo para `empreendedorismo`, `virada` e `linkedin` com os chips fornecidos pelo usuário. O chip "Outro..." já é renderizado no componente, não precisa estar nos dados.

### 3. Uma pergunta por vez no step 3 (`Index.tsx`)

Adicionar estado `currentQuestion` (0-3). No step 3, renderizar apenas a pergunta `currentQuestion`. Botão "Próxima" avança para próxima pergunta; na última, avança para step 4. Botão "Voltar" retrocede entre perguntas; na primeira, volta para step 2. Transição suave com fade.

### 4. Página de Obrigado

Já existe e funciona (step 6, `ConfirmationScreen`). Verificar que nada quebrou — o componente está intacto no código.

### 5. Edição no Admin (`Admin.tsx`)

Adicionar estado `editingId` e `editFields: { name, role }`. Em cada card, botão "Editar" que torna nome e cargo editáveis inline (inputs). Botão "Salvar" faz UPDATE via Supabase e atualiza o estado local. Precisa de política RLS de UPDATE — criar migração para permitir updates nos campos `name` e `role`.

### Arquivos alterados
- `src/lib/response-validation.ts` — reescrever níveis de qualidade
- `src/lib/chip-options.ts` — adicionar 3 tipos de mentoria
- `src/pages/Index.tsx` — uma pergunta por vez, validação não-bloqueante
- `src/pages/Admin.tsx` — edição inline de nome/cargo
- **Migração SQL** — política RLS de UPDATE para `testimonials` (restrita a `name` e `role`)

### Nota sobre migração
A RLS de UPDATE precisa ser ampla (`anon` pode fazer update) pois o admin não tem autenticação real — usa senha client-side. A política será `FOR UPDATE USING (true) WITH CHECK (true)` para `anon` e `authenticated`.

