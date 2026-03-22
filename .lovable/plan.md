

## Autorização com Switches (Sim/Não)

### O que muda no Step 0 (`src/pages/Index.tsx`)

Substituir os dois botões-cards por dois switches (toggles) empilhados:

1. **"Sim, autorizo"** — switch que já vem **ligado** (checked por padrão)
2. **"Não autorizo"** — switch que vem **desligado**

Funcionam como radio: ao ligar um, o outro desliga automaticamente. Como `authorized` já inicia como `false` (linha 57), mudar para `useState(true)` para que "Sim, autorizo" venha pré-selecionado.

Adicionar um botão "Começar" abaixo dos switches para avançar para o step 1 (sem que o clique no switch avance automaticamente).

### Detalhes técnicos

- `useState(true)` para `authorized` — já vem ticado no "Sim"
- Dois componentes `Switch` do shadcn, cada um com label ao lado
- Switch "Sim": `checked={authorized}`, `onCheckedChange={() => setAuthorized(true)}`
- Switch "Não": `checked={!authorized}`, `onCheckedChange={() => setAuthorized(false)}`
- Botão "Começar" abaixo para avançar

### Arquivo alterado
- `src/pages/Index.tsx` — step 0 (UI dos switches) e inicialização de `authorized`

