

## Plano: Duas Correções Pontuais

### 1. Corrigir chips de `crescimento[2]` em `src/lib/chip-options.ts`

**Linhas 55-62**: Substituir os 6 chips atuais (que falam sobre ações da cliente) pelos 6 novos chips sobre diferenciais da mentora.

### 2. Adicionar toast de erro no salvamento em `src/pages/Index.tsx`

- **Linha 1 (ou após imports existentes)**: Adicionar `import { toast } from '@/hooks/use-toast';`
- **Linha 222**: Substituir o `.catch` simples pelo bloco com `toast({ variant: 'destructive', ... })`

### 3. Políticas RLS — Já existem

As políticas "Allow anon update" e "Allow anon delete" **já estão ativas** na tabela `testimonials` (confirmado na configuração atual). Nenhuma migração necessária.

### Arquivos alterados
- `src/lib/chip-options.ts` — 6 linhas substituídas
- `src/pages/Index.tsx` — 1 import adicionado + 1 linha substituída

