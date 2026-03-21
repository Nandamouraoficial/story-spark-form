

## Formulário Inteligente de Coleta de Depoimentos

### Visão Geral
Formulário multi-step premium para captar depoimentos estruturados de mentoradas, com lógica condicional baseada no tipo de mentoria, geração automática de resumos e exportação CSV.

### Design System
- **Cores**: #3eafe0 (principal), #eaeaf1 (neutro), branco como base
- **Tipografia**: Playfair Display (títulos) + Inter (corpo)
- **Estilo**: Minimalista, sofisticado, mobile-first, bastante espaço em branco

### Fluxo de Telas (Step-by-step)

**Tela 1 — Boas-vindas**
- Headline em Playfair Display: "Sua experiência pode transformar outras carreiras"
- Subtítulo e contexto sobre autorização de uso
- Botão CTA "Começar"

**Tela 2 — Identificação**
- Nome completo, cargo atual, empresa/segmento (obrigatórios)

**Tela 3 — Segmentação**
- Radio buttons elegantes para tipo de mentoria (A/B/C/D)

**Tela 4 — Perguntas Condicionais**
- 4 perguntas específicas renderizadas dinamicamente conforme a escolha anterior
- Textareas com placeholders orientadores

**Tela 5 — Bloco Complementar**
- Frase de impacto (texto curto)
- Resultado mensurável (texto)
- Nota de satisfação (slider 0-10)
- Indicaria? (Sim/Não)

**Tela 6 — Autorização e Envio**
- Checkbox obrigatório de autorização
- Upload de foto opcional
- Botão "Enviar meu depoimento"

**Tela 7 — Confirmação**
- Mensagem de agradecimento

### Funcionalidades Inteligentes
- **Geração automática client-side** ao submeter:
  - Resumo curto (2-3 linhas) combinando respostas-chave
  - Destaque de frase forte (quote) extraído da resposta de maior impacto
  - Separação em "Antes / Depois / Resultado" a partir das respostas condicionais
- **Armazenamento em localStorage** como JSON estruturado
- **Painel admin simples** (rota /admin) para visualizar depoimentos e exportar CSV

### Estrutura de Dados
Cada depoimento armazena: identificação, tipo de mentoria, respostas condicionais, bloco complementar, nota, indicação, autorização, foto (base64), timestamp, e campos gerados (resumo, quote, antes/depois/resultado).

### Páginas
- `/` — Formulário multi-step
- `/admin` — Painel de visualização + exportação CSV (protegido por senha simples via prompt)

