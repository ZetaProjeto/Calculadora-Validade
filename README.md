# ValidaBR v2 — calculadora de datas de validade

Projeto estático para GitHub Pages. Arquivos: `index.html`, `style.css`, `script.js`.

## Correção da versão 2

- **Dias corridos** (padrão): atalhos de 30, 60, 90, 180 e 365 dias, contando a partir da fabricação sem incluir o dia inicial como dia transcorrido.
- **Meses de calendário**: atalhos de 1, 2, 3, 6 e 12 meses; se não houver dia equivalente no mês de chegada, usa o último dia.
- Prazo personalizado por dias, meses ou anos. O método utilizado aparece no resultado.
- Exemplo de conferência: fabricação `07/07/2026`, adicionar **60 dias corridos** ⇒ `05/09/2026`; adicionar **2 meses de calendário** ⇒ `07/09/2026`.
- Horário de Brasília (`America/Sao_Paulo`) para sugerir a data inicial. A consulta online é opcional, com fallback para o relógio local.

## Publicação

Crie um repositório, envie os três arquivos para a raiz e habilite **Settings → Pages → Deploy from a branch → main / (root)**.

## Limites e segurança alimentar

O aplicativo **não define a vida útil** de alimentos. Para queijos e outros perecíveis, respeite a data impressa, o armazenamento e as orientações do fabricante. **Não substitua ou prorrogue a validade de um rótulo com a data calculada.** A conversão de meses em dias depende da unidade de prazo efetivamente definida pelo responsável técnico: não há equivalência geral obrigatória de 1 mês = 30 dias.

Fontes:
- https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2025/anvisa-atualiza-guia-sobre-validade-de-alimentos/
- https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2018/guia-orienta-sobre-prazos-de-validade-de-alimentos/

Sem dependências, instalação ou chave de API.
