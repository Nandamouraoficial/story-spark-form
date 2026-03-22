

## Diagnóstico: Tela Branca após Respostas (Step 3 → Step 4)

### Causa raiz
No Step 3 (linha 509-597), o conteúdo é renderizado por uma IIFE que retorna `null` quando `currentQuestion >= totalQuestions` (linha 512-514). A recuperação acontece via `useEffect` (linhas 79-91), mas há um gap de pelo menos 1 frame onde **nenhum conteúdo é renderizado** — causando a tela branca.

Fluxo do problema:
1. Usuário clica "Continuar" na última pergunta
2. `handleNext` faz `setCurrentQuestion(0)` + `setStep(4)` — mas durante o `navigateStep` há um `setTimeout(200ms)` onde o step ainda é 3
3. No período entre o clique e a transição, o index pode ficar inconsistente
4. A IIFE retorna `null` → tela branca por ~200ms (ou mais, dependendo do dispositivo)

### Correção

**Arquivo: `src/pages/Index.tsx`**

1. **Substituir `return null` por um fallback visual no Step 3** (linha 512-514): Em vez de retornar `null` quando o índice é inválido, renderizar um loading/spinner leve dentro do glass-card, mantendo a estrutura visual enquanto o useEffect faz a recuperação.

2. **Eliminar o gap no `handleNext`** (linhas 183-189): Quando está na última pergunta, em vez de chamar `navigateStep` (que tem o setTimeout de 200ms), fazer a transição direta para step 4 sem o delay — `setStep(4)` imediato — já que `setCurrentQuestion(0)` já está sendo chamado junto.

3. **Adicionar fallback geral para steps sem conteúdo**: Após o bloco do step 5 e antes do step 6, adicionar um catch-all que detecta se nenhum conteúdo foi renderizado para o step atual (steps 1-5) e mostra um fallback em vez de branco.

### Resultado
Nunca mais haverá um frame sem conteúdo visual durante a transição entre perguntas ou entre steps.

