

## Experiencia Disney/Apple para o Formulario

### Filosofia
Criar uma experiencia que sinta **mágica e sem esforço** -- como um produto Apple. Cada interação deve ter feedback visual imediato, transições fluidas, e micro-interações que encantam sem distrair.

### Mudanças Planejadas

#### 1. Transições entre Steps (framer-motion-like com CSS)
- Substituir o `animate-in fade-in` atual por transições CSS customizadas com slide + fade + scale
- Cada step entra com um sutil deslizar para cima + fade, e sai com fade para baixo
- Usar `useRef` + `key` para forçar re-render animado entre steps
- Adicionar `transition` no progresso com easing cubic-bezier Apple-style

#### 2. Tela de Boas-vindas Cinematográfica
- Título com animação de entrada sequencial (palavra por palavra ou linha por linha) usando staggered CSS animations
- Subtle gradient glow atrás do titulo (radial gradient animado com primary color)
- Botão "Começar" com hover que escala suavemente + glow sutil
- Breathing animation no ícone de seta

#### 3. Progress Bar Premium
- Substituir barra fina por progress indicator com dots/steps conectados
- Dot ativo pulsa suavemente
- Transição suave entre dots com spring-like easing
- Label do step atual aparece com fade

#### 4. Inputs com Micro-interações
- Focus: border faz transição suave para primary, sutil glow/shadow aparece
- Labels flutuam para cima ao focar (floating label pattern)
- Campos preenchidos ganham um sutil checkmark verde
- Textareas crescem suavemente conforme o usuario digita (auto-resize)

#### 5. Radio Buttons / Cards de Seleção Elegantes
- Seleção com animação de escala + ripple effect sutil
- Ícone/emoji contextual para cada tipo de mentoria
- Card selecionado tem glow sutil na borda + elevação (shadow)
- Transição de cores suave (300ms ease-out)

#### 6. Slider de Satisfação Experiencial
- Número grande animado que muda com spring effect
- Emoji que muda conforme a nota (😐 → 😊 → 🤩)
- Track com gradiente de cor (vermelho → amarelo → verde)
- Thumb com shadow e hover scale

#### 7. Botões Sim/Não com Delight
- Seleção com bounce sutil
- Ícone de check aparece com animação dentro do botão selecionado
- Feedback háptico visual (escala rápida 1.05 → 1.0)

#### 8. Upload de Foto com Preview Elegante
- Drag area com animação de borda pontilhada pulsante
- Preview da foto aparece com scale-in + border glow
- Animação de progresso circular sutil durante upload

#### 9. Tela de Confirmação Mágica
- Confetti/sparkle animation sutil (CSS-only, sem lib)
- Checkmark animado (draw SVG path animation)
- Texto aparece com staggered fade-in
- Partículas flutuantes sutis no background

#### 10. Background e Atmosfera Geral
- Gradient mesh sutil no background (blobs animados com CSS)
- Glass morphism sutil nos cards/containers (backdrop-blur)
- Sombras suaves e elevação nos elementos interativos

### Arquivos a Modificar
- **`tailwind.config.ts`** -- Adicionar keyframes customizados (float, glow, draw, stagger, bounce-subtle, shimmer)
- **`src/index.css`** -- Adicionar animações CSS globais, floating labels, gradient backgrounds, glass effects
- **`src/pages/Index.tsx`** -- Refatorar completamente com AnimatePresence-style transitions, micro-interações, auto-resize textareas, emoji slider, animated progress dots, staggered welcome, animated confirmation
- **`src/components/ui/input.tsx`** -- Adicionar focus glow styles

### Sem Dependências Novas
Tudo implementado com CSS puro + React state. Sem framer-motion ou libs extras -- mantendo o projeto leve como solicitado.

