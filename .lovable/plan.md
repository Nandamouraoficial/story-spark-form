

## Correção Definitiva: Tela Branca no Deploy (Step 3 → Step 4)

### Diagnóstico

O código atual já tem proteções no `handleNext` (linhas 183-191) e um fallback visual (linhas 514-523). Porém, há brechas:

1. **Linha 527**: `if (!q) return null;` — retorna `null` sem fallback visual, causando tela branca
2. **Linha 511**: `step === 3 && mentorshipType && (...)` — se `mentorshipType` for string vazia com step 3, nada renderiza
3. **Fallback geral (linha 802)**: Só cobre `step < 0`, não cobre steps 1-5 sem conteúdo renderizado
4. **Possível race condition no build de produção**: React pode batchear os `setStep`/`setCurrentQuestion` diferente em prod, causando 1-2 frames onde step=3 e currentQuestion é inválido

### Correções em `src/pages/Index.tsx`

**1. Linha 527** — Substituir `return null` por o mesmo fallback visual:
```tsx
if (!q) {
  return (
    <div className="glass-card rounded-2xl shadow-xl px-6 py-10 max-w-lg mx-auto text-center">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Sparkles className="h-5 w-5 animate-pulse" />
        <span className="text-sm">Preparando próxima etapa...</span>
      </div>
    </div>
  );
}
```

**2. Linha 511** — Cobrir o caso `step === 3` sem `mentorshipType`:
```tsx
{step === 3 && !mentorshipType && (
  <div className="glass-card rounded-2xl shadow-xl px-6 py-10 max-w-lg mx-auto text-center">
    <div className="flex items-center justify-center gap-2 text-muted-foreground">
      <Sparkles className="h-5 w-5 animate-pulse" />
      <span className="text-sm">Preparando perguntas...</span>
    </div>
  </div>
)}
```

**3. Linhas 801-806** — Expandir o fallback geral para cobrir qualquer step sem conteúdo:
```tsx
{/* Safety fallback — catch any unrendered step */}
{(step < 0 || (step >= 1 && step <= 5 && !mentorshipType && step === 3)) && (
  ...
)}
```
Substituir por um fallback mais abrangente que cubra qualquer gap.

**4. Adicionar console.log temporário** no `handleNext` (step === 3) para debug no deploy:
```tsx
console.log('STEP3_CONTINUE', { step, currentQuestion, totalQuestions, isLastQuestion: currentQuestion >= totalQuestions - 1 });
```

**5. Forçar `setAnimating(false)` antes do `setStep(4)`** na transição da última pergunta, garantindo que o container não fica com `opacity-0` durante a troca.

### Arquivo alterado
- `src/pages/Index.tsx`

### Resultado
Zero possibilidade de tela branca: todo caminho de renderização tem conteúdo visual. O log temporário permitirá validar o comportamento no deploy.

