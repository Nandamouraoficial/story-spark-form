

## Correção: Validação da Frase de Impacto (Step 4)

### Problema
A validação do step 4 bloqueia o avanço mesmo quando `impactPhrase` tem conteúdo, por causa da checagem de qualidade `weak` que exige dismiss explícito.

### Correção em `src/pages/Index.tsx` (linhas 149-158)

Simplificar a validação do step 4:
- Se `impactPhrase.trim()` tiver conteúdo → permitir avançar, sem checagem de qualidade
- Só bloquear se o campo estiver vazio
- Remover a lógica de `impactWeakWarning` / `impactWeakDismissed` que complica o fluxo

Código resultante:
```ts
if (step === 4) {
  if (!impactPhrase.trim()) errs.push('Preencha a frase de impacto');
  if (wouldRecommend === null) errs.push('Indique se recomendaria');
}
```

Também remover da UI do step 4 o bloco de warning não-bloqueante relacionado a `impactWeakWarning`, já que não será mais necessário.

### Arquivo alterado
- `src/pages/Index.tsx`

