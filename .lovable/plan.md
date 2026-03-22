

## Autorização na Tela Inicial (Step 0)

### O que muda
Substituir o texto estático de autorização no step 0 por dois botões claros. A escolha define o valor de `authorized` desde o início do formulário.

### Alterações em `src/pages/Index.tsx`

**Step 0** — Substituir o glass-card com texto passivo por dois botões de seleção:
- "Sim, autorizo" → `setAuthorized(true)` + avança para step 1
- "Prefiro não identificar meu nome" → `setAuthorized(false)` + avança para step 1
- Remover o botão "Começar" genérico — a escolha de autorização já serve como ação de avanço
- Estilo: dois cards clicáveis lado a lado (ou empilhados no mobile), com ícones (CheckCircle / ShieldOff)

**Step 5** — Manter a checkbox de autorização existente, mas pré-popular com o valor escolhido no step 0. A pessoa pode mudar de ideia antes de enviar.

**Validação step 5** — Remover a validação `if (!authorized) errs.push(...)` pois agora a pessoa pode conscientemente escolher não autorizar.

### Arquivos alterados
- `src/pages/Index.tsx` — step 0 (botões de autorização), step 5 (pré-populado), validação

