

## Atualização Visual dos Chips

### O que muda
Apenas visual — sem alterar dados, fluxo, validação ou banco.

### 1. `src/lib/chip-options.ts` — Sem alteração de texto
Os chips já contêm exatamente os textos fornecidos anteriormente. Nenhum texto a substituir (o usuário indicou "cola seus chips aqui" mas não colou novos). Arquivo permanece igual.

### 2. `src/pages/Index.tsx` — `renderQuestionChips` (linhas 259-320)

Alterações visuais:

- **Numeração visual**: Cada chip recebe prefixo `{index + 1}.` no texto renderizado (apenas UI, o valor salvo em `selectedChips` continua sem número)
- **Layout**: Trocar `flex flex-col` para `flex flex-wrap` para permitir quebra de linha natural
- **Gap**: `gap-2` → `gap-2.5`
- **Border-radius**: `rounded-lg` → `rounded-xl`
- **Padding**: Manter `px-4 py-2.5` (já está assim)
- **Font**: Manter `text-sm` (já está assim)
- **Estado selecionado**: `bg-primary/10` → `bg-primary/15`, manter `border-primary`
- **"Outro..."**: Sem numeração, manter `border-dashed`, aplicar mesmo `rounded-xl` e `gap`

### Arquivo alterado
- `src/pages/Index.tsx` — apenas `renderQuestionChips`

