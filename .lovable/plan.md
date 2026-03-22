

## Correção: Chips no índice errado em `crescimento`

### Problema
A edição anterior substituiu os chips de `crescimento[1]` (pergunta 2) pelos novos chips sobre diferenciais da mentora, mas o correto era substituir `crescimento[2]` (pergunta 3: "O que eu faço diferente de outros profissionais que orientam executivos?").

Resultado: pergunta 2 mostra chips de mentor (errado), pergunta 3 mostra chips de ação da cliente (errado).

### Correção em `src/lib/chip-options.ts`

**1. Restaurar `crescimento[1]`** (linhas 48-53) com os chips originais sobre mudanças de posicionamento:
- "Ela não dá fórmula pronta — constrói a estratégia junto com você" → voltar para os originais sobre o que mudou na carreira

**2. Substituir `crescimento[2]`** (linhas 55-62) pelos chips sobre diferenciais da mentora:
- Colocar os 6 chips novos aqui

### Arquivo alterado
- `src/lib/chip-options.ts` — trocar o conteúdo entre os índices 1 e 2

