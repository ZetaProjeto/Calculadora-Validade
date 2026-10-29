# ValidaBR 4.0 — Calculadora de validade

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
