

## Admin Premium — Cards Visuais com Destaque para Quotes e Notas

### O que muda

Refatorar `/admin` com o mesmo nível visual premium do formulário: glass morphism, animated blobs no background, cards com hierarchy visual clara, inline password field (substituindo `prompt()`), e stats resumidos no topo.

### Mudanças em `src/pages/Admin.tsx`

1. **Login inline** — Substituir `prompt()` nativo por um campo de senha elegante com glass card, ícone de lock, e botão estilizado

2. **Header com stats** — Adicionar cards de resumo no topo: total de depoimentos, nota média, % que indicariam

3. **Background premium** — Mesmos blobs animados e gradiente sutil do formulário

4. **Cards de depoimento redesenhados**:
   - Glass morphism (`glass-card` class já existe no CSS)
   - Avatar maior (48px) com ring/glow na borda
   - Quote em destaque: fonte maior, Playfair Display italic, aspas decorativas grandes (`"`) em cor primary com opacidade, fundo sutil com borda esquerda gradiente
   - Badge de mentoria com ícone/emoji contextual (🚀 🎯 ⚡ 💼)
   - Nota de satisfação com estrelas visuais (filled stars) em vez de número
   - Seção Antes/Depois/Resultado com ícones e visual mais rico (bordas coloridas, ícones de seta)
   - Indicação com badge verde/vermelho
   - Hover com elevação sutil (shadow transition)
   - Entrada animada com staggered fade-up

5. **Botão de exportação** — Estilo premium com hover glow, consistente com o formulário

### Nenhum arquivo novo — apenas `src/pages/Admin.tsx`

