

## Chips de Resposta Rápida — Bloco Crescimento

### O que muda
Adicionar chips clicáveis abaixo de cada pergunta do tipo **crescimento** (step 3) para facilitar respostas. Chips são opcionais, permitem múltipla seleção e complementam o texto livre.

### Arquivos

#### 1. `src/lib/chip-options.ts` (novo)
Mapa de chips por tipo de mentoria e índice de pergunta:
```
crescimento[0]: ["falta de clareza sobre próximo passo", "estagnação na carreira", "busca por promoção", "mudança de área ou empresa", "reposicionamento profissional", "insegurança nas decisões"]
crescimento[1]: ["passei a me posicionar com mais segurança", "comecei a participar de processos seletivos", "parei de esperar estar 100% pronta", "comecei a me expor mais estrategicamente", "passei a comunicar melhor o que eu quero", "comecei a me posicionar dentro da empresa", "me sinto mais confiante para negociar", "tomo decisões com mais clareza"]
crescimento[2]: ["me candidatei a novas oportunidades", "participei de processos seletivos", "conversei com lideranças sobre minha carreira", "passei a me posicionar com mais clareza", "comecei a negociar melhor", "assumi mais protagonismo", "parei de me sabotar"]
crescimento[3]: ["mais visibilidade no mercado", "contatos de recrutadores", "convites para entrevistas", "novas oportunidades de carreira", "reposicionamento profissional", "comecei a ser mais procurada pelo mercado"]
```
- Nota: a pergunta 3 do crescimento é "O que eu faço diferente..." e a pergunta 4 é "O que você diria...". Os chips do usuário mapeiam para as perguntas 1, 2, (pula 3), 4. Vou mapear os chips conforme a correspondência semântica com as perguntas reais.
- Exportar função `getChipsForQuestion(mentorshipType, questionIndex): string[]`

#### 2. `src/pages/Index.tsx` (modificar step 3)
- Estado: `selectedChips: Record<number, string[]>` — chips selecionados por pergunta
- Entre o Label e o Textarea de cada pergunta, renderizar chips (se existirem para aquele tipo/pergunta):
  - Chips como botões pequenos (`rounded-full px-3 py-1 text-xs border`) com toggle visual
  - Ao clicar, adiciona/remove do array de selecionados
  - Chips selecionados ficam com `bg-primary/10 border-primary text-primary`
- Ao avançar (ou ao mudar chips), concatenar chips selecionados no início do texto da resposta, separados por " · ", seguido de quebra de linha e o texto livre (se houver)
- Isso garante que o valor salvo no `answers[]` contenha tanto chips quanto texto

### UX
- Chips aparecem com animação sutil (fade-in)
- Máximo 8 chips por pergunta (já respeitado nos dados)
- Não obrigatórios — usuário pode ignorar e só escrever
- Tom visual consistente com o design existente (glass-card, cores suaves)

