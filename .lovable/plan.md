

## Parte 3: Aprimorar Transformação de Depoimentos

### Situação atual
A Edge Function `generate-marketing` já existe e faz a transformação via IA. O que falta é incorporar as regras específicas da Parte 3 no prompt para garantir que mesmo respostas simples sejam transformadas em conteúdo forte.

### O que muda

#### 1. `supabase/functions/generate-marketing/index.ts`
Aprimorar o `systemPrompt` com as regras de transformação:

- Adicionar regras explícitas de **priorização**: mudança de comportamento, clareza estratégica, tomada de decisão, posicionamento
- Adicionar **blacklist de linguagem genérica**: "foi incrível", "me ajudou muito", "foi bom", "é divertida" — com instrução para substituir por frases concretas
- Adicionar **contexto de público**: mulheres executivas e líderes, linguagem sofisticada
- Adicionar **exemplo de transformação** no prompt: entrada "criei um plano e implementei" → saída "Passei de um cenário sem direção para um plano estruturado e execução clara"
- Reforçar que mesmo respostas curtas/simples devem gerar saídas fortes e utilizáveis

Também ajustar as descriptions do tool calling para reforçar:
- `quotes`: mudar de 3 para "2-3 frases destacáveis" e reforçar foco em decisão e posicionamento
- `fullTestimonial`: reforçar estrutura História (antes + depois) + Resultado + Frase final de impacto

### Impacto
Apenas a Edge Function é alterada. Nenhuma mudança no frontend — a estrutura de dados (`MarketingOutput`) permanece idêntica.

