# ValidaBR 6.0 — quatro anúncios — Calculadora de validade

Site estático para GitHub Pages. Publique `index.html`, `style.css` e `script.js` na raiz do repositório.

## Funcionalidades
- **Data de Fabricação** começa automaticamente em **hoje no fuso de Brasília**, e acompanha a virada de dia enquanto a aba estiver aberta. Caso o usuário escolha outra data manualmente, essa escolha é preservada; **Usar hoje** restaura a data atual e o acompanhamento automático.
- **Prazo de dias corridos** em botões: 30, 60, 90, 180, 365 dias. Nenhuma opção de meses de calendário.
- **Prazo personalizado funcional:** abra a seção e digite qualquer quantidade inteira de 1 a 36.500 dias. O resultado é atualizado enquanto você digita e também ao clicar em **Calcular prazo personalizado**.
- O nome do produto começa em branco e aparece automaticamente na conferência e etiqueta.
- Copiar resultado e imprimir etiqueta.

## Testes de referência
- 07/07/2026 + 60 dias = 05/09/2026.
- 28/02/2028 + 1 dia = 29/02/2028 (ano bissexto).
- 31/12/2026 + 1 dia = 01/01/2027.

## Publicação
Em GitHub → Settings → Pages, selecione **Deploy from a branch**, branch **main**, diretório **/(root)**. A página será servida com HTTPS.

## Impressão
Para remover a data, URL e título que o Chrome/Edge adiciona automaticamente à folha, desative **Cabeçalhos e rodapés** nas configurações de impressão do navegador. O CSS da página define margens de impressão zero.

## Segurança
A ferramenta soma dias corridos e **não determina a validade sanitária do alimento**. Use o prazo estabelecido pelo fabricante ou responsável técnico; não substitua a validade impressa no rótulo.


## Anúncios (V6)
- Espaço 1 (`pbd10cc8a4f`): após apresentação, antes da calculadora.
- Espaço 2 (`g5c0049fd98`): após calculadora e resultado, antes de "Como funciona?".
- Espaço 3 (`ode9866d7d0`) e espaço 4 (`r6b887408b0`): após "Como funciona?", lado a lado em telas largas e empilhados em celulares.
- Removidos o antigo bloco `s6fcb0d1b56` e o script `cdn-server.live`.
- Os quatro scripts fornecidos foram incluídos sem alterar seus identificadores. O funcionamento e preenchimento dos anúncios dependem da rede externa.
- Os anúncios são ocultados na impressão.
- Confirme com a rede de publicidade as políticas para quatro placements e verifique privacidade/consentimento aplicável antes da publicação.
