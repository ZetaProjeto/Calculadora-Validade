# ValidaBR — Calculadora de validade

Página estática HTML/CSS/JavaScript pronta para GitHub Pages.

## Publicar

1. Crie um repositório no GitHub, por exemplo `calculadora-validade`.
2. Envie `index.html`, `style.css` e `script.js` para a raiz da branch `main`.
3. Entre em **Settings → Pages → Build and deployment**.
4. Em **Source**, selecione **Deploy from a branch** e escolha **main / (root)**. Salve.
5. Abra `https://SEU-USUARIO.github.io/calculadora-validade/` após a publicação.

## Regras do cálculo

- Meses são meses civis, sem assumir 30 dias. Se não houver o dia de origem no mês de destino, usa-se o último dia daquele mês.
- Anos equivalem a 12 meses para o cálculo. Dias personalizados são dias corridos.
- Sábados, domingos e feriados não alteram automaticamente uma validade.
- O cálculo usa o calendário gregoriano. A data atual considera `America/Sao_Paulo`, com tentativa de verificação via `worldtimeapi.org`, e fallback para o relógio do dispositivo.
- Prazos e resultados não são avaliação de vida útil nem autorização sanitária. Informe somente prazos tecnicamente justificados.

## Referências

- RDC Anvisa 727/2022: requisitos de rotulagem de alimentos embalados.
- Guia Anvisa nº 16, versão 3 (2025): orientação para determinação técnica da vida útil de alimentos.
- Outras categorias de produtos podem ter requisitos diferentes.
