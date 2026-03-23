
## Correção definitiva da tela branca no Step 3

### Causa exata
O problema não está em um tipo específico de mentoria, e sim no motor compartilhado do Step 3 em `src/pages/Index.tsx`.

Hoje já existe fallback visual no render, mas a tela branca ainda pode voltar porque a lógica do Step 3 continua lendo `currentQuestion` “cru” em vários pontos antes de garantir que o índice é válido:

- `validate()` usa `answers[currentQuestion]` e chama `.trim()`; se o índice ficar fora do range, isso pode gerar erro em runtime.
- `handleNext()` e `handleBack()` ainda dependem do índice atual sem uma camada única de segurança.
- O progresso e a renderização do conteúdo fazem checagens separadas, então o estado pode ficar momentaneamente inconsistente no build publicado.
- O `useEffect` atual tenta “corrigir depois”, mas isso é reativo; para eliminar a tela branca, a proteção precisa acontecer antes de qualquer leitura insegura.

### O que vou corrigir
#### 1. Centralizar a segurança do Step 3
Em `src/pages/Index.tsx`, criar uma lógica derivada única para o Step 3, baseada em:
- `questions`
- `totalQuestions`
- `safeQuestionIndex`
- `currentStepQuestion`
- `isInvalidStep3State`
- `isLastQuestion`

Isso evita checagens espalhadas e garante o mesmo comportamento para empreendedorismo, crescimento, virada e LinkedIn.

#### 2. Blindar `validate()`
No bloco `step === 3`:
- nunca usar `answers[currentQuestion]` diretamente
- usar `answers[safeQuestionIndex] ?? ''`
- se `mentorshipType` ou `questions` estiverem inválidos, não deixar a UI quebrar; fazer fallback seguro para o próximo step em vez de permitir erro

#### 3. Reescrever a transição da última pergunta
No `handleNext()` do Step 3:
- se não houver perguntas válidas, ir direto para `setStep(4)`
- se estiver na última pergunta, resetar índice e avançar direto com `setStep(4)`
- se o índice estiver inválido por qualquer motivo, resetar e avançar
- só incrementar quando houver próxima pergunta real

Também vou usar atualização funcional quando fizer sentido para reduzir risco de estado stale.

#### 4. Blindar `handleBack()` e qualquer helper ligado ao Step 3
Vou revisar:
- `handleBack()`
- progresso no topo
- render da pergunta atual
- qualquer trecho dependente de `currentQuestion` ou `mentorshipType`

Objetivo: nenhum trecho do Step 3 poderá acessar pergunta inexistente.

#### 5. Eliminar caminhos que possam renderizar “nada”
Vou garantir que:
- nunca exista `return null` em situação inconsistente do Step 3
- qualquer estado inválido mostre fallback visual ou avance com segurança para o Step 4
- o container não fique preso em estado de animação sem conteúdo

#### 6. Manter a correção mínima e focada
A correção ficará concentrada principalmente em:
- `src/pages/Index.tsx`

Sem mexer em design, chips, admin ou backend.

### Como isso resolve em definitivo
Como os quatro tipos de mentoria usam o mesmo fluxo de Step 3 (`conditionalQuestions[mentorshipType]`), ao blindar esse motor central a correção passa a valer para todos os tipos, não apenas para um caso isolado.

### Validação após implementar
Vou validar especificamente:
1. cada uma das 4 mentorias
2. avanço da pergunta 4/4 para o Step 4
3. ausência de tela branca no deploy publicado
4. comportamento seguro mesmo em transição rápida ou estado inconsistente

### Detalhes técnicos
Arquitetura proposta:
```text
Step 3
 ├─ deriva questions + safeQuestionIndex
 ├─ validate usa índice seguro
 ├─ handleNext nunca incrementa além do último
 ├─ render nunca acessa pergunta inexistente
 └─ fallback visual/avanço seguro substitui qualquer estado inválido
```

Resultado esperado:
- zero acesso a `questions[currentQuestion]` inválido
- zero `.trim()` em `undefined`
- zero caminho de renderização vazia no Step 3
- transição estável do Step 3 para o Step 4 em produção
