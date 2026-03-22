
## Diagnóstico real encontrado

- A URL publicada **não está presa numa versão muito antiga**: o HTML público já mostra os switches de autorização do step 0, então parte das mudanças recentes **já está em produção**.
- O ponto mais frágil no código atual é o **step 3**:
  - existe recuperação de índice **dentro do render** (`setCurrentQuestion(0)` + `navigateStep(4, 'forward')` dentro do JSX), o que é arriscado e pode causar crash/intermitência em produção;
  - a proteção está **espalhada** entre `validate`, `handleNext`, label de progresso e render da pergunta, em vez de existir uma única fonte segura;
  - o step 3 ainda depende de acessos diretos baseados em `currentQuestion`, então basta um índice inconsistente por um frame para quebrar a tela.

## Plano de correção

### 1. Unificar a lógica segura do step 3 em `src/pages/Index.tsx`
Criar uma resolução única para o estado da pergunta atual, algo como:
- `questions`
- `totalQuestions`
- `safeQuestionIndex`
- `currentPrompt`
- `isQuestionIndexValid`

Tudo no step 3 passa a usar **somente esses valores protegidos**, nunca `questions[currentQuestion]` direto.

### 2. Corrigir o handler do botão “Continuar/Próxima”
No clique do step 3:
- calcular `totalQuestions` com segurança;
- se não houver perguntas, registrar erro e avançar com segurança;
- se estiver na última pergunta, fazer:
  - `setCurrentQuestion(0)`
  - `navigateStep(4, 'forward')`
  - `return`
- caso contrário, só então incrementar o índice.

Também incluir o log pedido:
```ts
console.log('CLICK_CONTINUAR', {
  step,
  currentQuestionIndex: currentQuestion,
  totalQuestions,
  questions,
  currentQuestion: questions?.[currentQuestion],
});
```

### 3. Remover qualquer `setState` durante render
O bloco atual que tenta corrigir índice inválido **dentro do JSX** será substituído por uma abordagem segura:
- renderizar `null`/fallback visual temporário no step 3 se o estado estiver inconsistente;
- fazer a recuperação em `useEffect`, nunca no render:
  - `setCurrentQuestion(0)`
  - `navigateStep(4, 'forward')`

Isso elimina a chance de a própria renderização causar a tela branca.

### 4. Blindar toda a UI do step 3
Revisar e proteger:
- título/progresso (`Pergunta x de y`)
- texto da pergunta
- placeholder do textarea
- texto do botão (`Próxima` / `Continuar`)
- chips
- qualquer leitura de `questions`, `q`, `currentQuestion`

Tudo com checagem prévia ou fallback seguro.

### 5. Revisar pontos indiretos que podem provocar o branco
Ainda em `src/pages/Index.tsx`, revisar:
- `navigateStep`
- animação/transição (`stepKey`, `animating`, `staggerReady`)
- `validate()` no step 3
- qualquer `useEffect` que dependa de `step`, `currentQuestion` ou `mentorshipType`

Objetivo: garantir que a transição do fim do step 3 para o step 4 não dependa de um estado intermediário inválido.

### 6. Fallback forte: nunca tela branca
Adicionar um fallback final para inconsistências do fluxo:
- se o step 3 entrar em estado impossível, forçar recuperação para o step 4;
- se ainda houver falha inesperada de renderização, mostrar um fallback inline em vez de branco.

Se fizer sentido no código, encapsular o conteúdo principal do formulário com um error boundary simples para o fluxo final nunca sumir.

### 7. Verificação real no deploy
Depois da correção:
- publicar novamente;
- validar a **URL pública**;
- confirmar especificamente o fluxo do tipo **LinkedIn** até sair da pergunta 4 e entrar no step 4;
- checar os logs `CLICK_CONTINUAR` no build publicado.

## Nota sobre “versão/build em produção”
Hoje o projeto **não expõe um identificador de build** no frontend. Então, além da correção, vou incluir um **build marker/log de deploy** no app para conseguirmos confirmar de forma objetiva que a versão publicada é a nova.

## Arquivo principal afetado
- `src/pages/Index.tsx`

## Resultado esperado
Ao clicar em **“Continuar”** na pergunta 4 de 4 do step 3, em qualquer tipo de mentoria:
- o app **não** tenta renderizar pergunta inexistente;
- avança corretamente para o **step 4**;
- não há tela branca nem no preview nem na URL publicada.
