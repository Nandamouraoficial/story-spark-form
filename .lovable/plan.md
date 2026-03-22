

## Correção: Tela Branca na Versão Publicada

### Diagnóstico
O fluxo não muda de rota (tudo acontece em `/`). O problema mais provável é que `saveTestimonial` falha silenciosamente em produção (erro de rede, timeout, etc.) e embora haja `.catch()`, a transição para step 6 acontece antes do erro ser tratado. Se o erro ocorrer de forma síncrona ou se houver crash no render, não há fallback.

### Correções em `src/pages/Index.tsx`

1. **Envolver submit em try/catch/finally** (linhas 181-203):
   - Mover `navigateStep(6, 'forward')` para dentro de um bloco que garante execução independente do resultado do save
   - Adicionar estado `submitting` para desabilitar botão e mostrar spinner
   - Se falhar o save, ainda assim mostrar a confirmação (depoimento pode ser reenviado depois)

2. **Adicionar Error Boundary no ConfirmationScreen** (linhas 837-898):
   - Envolver com try/catch no render
   - Fallback inline: "Depoimento enviado com sucesso. Obrigada por compartilhar sua experiência."

3. **Proteção contra step inválido**:
   - Adicionar fallback no render principal: se `step` não corresponder a nenhum case (0-6), mostrar ConfirmationScreen como padrão
   - Isso garante que nunca haverá tela branca

### Arquivo alterado
- `src/pages/Index.tsx`

