

## Ajustes de Responsividade — Formulário e Admin

### Problemas Identificados

1. **Admin — Card header**: O layout `flex justify-between` com avatar+nome à esquerda e badge+estrelas à direita quebra em telas < 400px. O badge e as estrelas ficam apertados.

2. **Admin — Stats grid**: `grid-cols-3` sem breakpoint mobile — em telas muito pequenas (320px) os cards ficam comprimidos.

3. **Admin — Before/After/Result**: Já tem `grid-cols-1 sm:grid-cols-3` (OK), mas o texto dentro pode ter `line-clamp-4` que corta conteúdo no mobile sem indicação visual.

4. **Formulário — Background blobs**: Tamanhos fixos (`w-[500px]`, `w-[400px]`) podem causar scroll horizontal em telas pequenas.

5. **Formulário — Welcome title**: O `<br>` fixo no h1 pode criar quebra estranha em telas muito pequenas.

6. **Formulário — Photo upload**: Layout `flex items-center gap-5` com preview + upload area lado a lado pode ficar apertado no mobile.

7. **Admin — Quote text**: `text-base sm:text-lg` está OK, mas o padding `pl-4` + aspas decorativas podem ocupar muito espaço horizontal no mobile.

### Mudanças

**`src/pages/Index.tsx`**:
- Background blobs: adicionar `max-w-full` ou reduzir tamanhos com classes responsivas
- Welcome h1: remover `<br>` fixo, deixar quebra natural
- Photo upload section: `flex-col sm:flex-row` para empilhar no mobile
- Botão "Enviar": garantir que não transborde com texto + ícone

**`src/pages/Admin.tsx`**:
- Card header: empilhar avatar/nome e badge/estrelas verticalmente no mobile (`flex-col sm:flex-row`)
- Stats grid: `grid-cols-1 sm:grid-cols-3` para empilhar no mobile pequeno (ou manter 3 cols com texto menor)
- Quote section: reduzir padding lateral no mobile
- Footer do card: `flex-wrap` para evitar overflow

