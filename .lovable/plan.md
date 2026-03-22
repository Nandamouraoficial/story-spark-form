

## Mover Autorização do Step 0 para o Final (Step 5)

### O que muda
Remover a pergunta de autorização (switches "Sim, autorizo" / "Não autorizo") do Step 0. A autorização fica apenas no Step 5, que já existe com checkbox + upload de foto, antes da tela de "Obrigada".

### Alterações em `src/pages/Index.tsx`

**Step 0 (linhas 405-419)**: Remover todo o bloco `max-w-md mx-auto mb-6` que contém a pergunta de autorização e os dois switches. Manter apenas o título, subtexto e botão "Começar".

**Step 5 (já existe, linhas 722-799)**: Permanece como está — já tem checkbox de autorização, upload de foto e botão "Enviar". `authorized` continua inicializado como `true` (linha 59), então o checkbox já vem marcado por padrão no Step 5.

**Imports**: Remover `Switch` e `ShieldOff` dos imports se não forem usados em nenhum outro lugar.

### Arquivo alterado
- `src/pages/Index.tsx`

