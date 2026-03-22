

## Chips em Lista Vertical

### O que muda
Trocar o layout dos chips de `flex flex-wrap` (horizontal) para `flex flex-col` (lista vertical), para que cada opção apareça em sua própria linha.

### Alteração em `src/pages/Index.tsx`

**Linha 277**: Mudar `flex flex-wrap gap-2` para `flex flex-col gap-2`

**Linhas 293-296**: Ajustar o estilo dos botões de chip — remover `rounded-full` e usar `rounded-lg`, alinhar texto à esquerda com `text-left w-full`, para ficarem como itens de lista clicáveis.

O chip "Outro..." (linha 304-314) segue o mesmo estilo de lista.

### Resultado
Cada opção aparece como um item de lista, uma abaixo da outra, mais fácil de ler e selecionar.

