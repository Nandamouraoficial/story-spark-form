

## Validação Inteligente de Respostas — Anti-Genérico

### O que muda

Adicionar validação de qualidade no step 3 (perguntas condicionais) e no step 4 (frase de impacto), impedindo respostas vagas com orientação elegante e não-agressiva.

### Arquivos

#### 1. `src/lib/response-validation.ts` (novo)
Utilitário de validação com:
- **Lista de padrões genéricos** em português: "foi bom", "me ajudou", "estava triste", "estou melhor", "siga em frente", "é divertida", etc.
- **Função `analyzeResponseQuality(text: string)`** que retorna `{ isGeneric: boolean; reason: string }`:
  - Genérica se < 8 palavras
  - Genérica se match em padrões vagos (regex)
  - Genérica se não contém indicadores de contexto/ação/mudança/exemplo (heurística por presença de verbos no passado, palavras como "quando", "porque", "exemplo", "resultado", "consegui", "antes", "depois", etc.)
- **Função `getExampleForQuestion(mentorshipType, questionIndex)`** que retorna um exemplo forte contextualizado para cada pergunta/tipo de mentoria
- **Função `getComplementaryPrompt()`** que retorna a pergunta complementar obrigatória

#### 2. `src/pages/Index.tsx` (modificar)
No step 3 (perguntas condicionais):
- Ao tentar avançar, validar cada resposta com `analyzeResponseQuality()`
- Se genérica: exibir inline abaixo do textarea afetado:
  - Mensagem suave: "Pode detalhar melhor? Nos ajude com um exemplo real ou situação concreta."
  - Exemplo contextualizado em bloco sutil (glass card pequeno)
  - Campo complementar obrigatório: "Pode dar um exemplo específico do que aconteceu?" (aparece com animação fade-in)
- Estilo: tom orientativo, ícone de 💡, cor primary suave, sem vermelho agressivo
- Só permite avançar quando todas as respostas passam na validação (ou o campo complementar é preenchido)

No step 4 (frase de impacto):
- Mesma validação para o campo `impactPhrase`

### UX
- Feedback aparece com fade-in suave (animação CSS existente)
- Cor de borda do textarea muda para um amarelo/dourado suave (warning, não erro)
- Mensagem desaparece quando o usuário edita e a resposta passa
- Não bloqueia digitação, apenas o avanço

