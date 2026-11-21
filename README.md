# Registro de Presença Eletrônica

Aplicação web para criar e gerenciar **listas de presença** de eventos, aulas e reuniões, substituindo pranchetas, listas impressas e planilhas soltas.
Projeto Integrador do 3º semestre, 2ª etapa: *Desenvolvimento da Aplicação Web utilizando Boas Práticas de Desenvolvimento de Software*.

## Acesse a aplicação

**https://henrique7-tech.github.io/registro-presenca/**

A aplicação está publicada no GitHub Pages e abre direto no navegador, sem instalar nada.

## Integrantes

| Integrante | Atividade |
|---|---|
| Mariucha Jobim Soriano | Levantamento de informações |
| Caio Cesar Luna | Esboço do aplicativo (protótipo no Figma) |
| Felipe Yudi Higashi | Desenvolvimento HTML/CSS |
| Henrique Nascimento de Souza | Desenvolvimento JavaScript |
| Andrey de Souza Sezario | Testes e documentação |
| Todos | Testes e documentação |

## Como executar no computador

1. Baixe o projeto: botão verde **Code → Download ZIP**.
2. **Extraia** o arquivo ZIP. Não abra o `index.html` de dentro do ZIP, porque as pastas `js` e o `style.css` não são carregados.
3. Dê dois cliques no arquivo **`index.html`** para abrir no navegador (Chrome, Edge ou Firefox).

Não é preciso instalar nada nem ter internet. Os dados ficam salvos no **LocalStorage** do navegador e continuam lá depois de fechar a página.

Para rodar os testes automatizados, abra o arquivo **`testes.html`**.

## Funcionalidades

| Funcionalidade | Tipo (enunciado) |
|---|---|
| Cadastro de listas de presença (nome, data e descrição) | ✅ Obrigatória: cadastro |
| Listagem das listas com o total de presentes | ✅ Obrigatória: listagem |
| Registro de presença do participante (nome e e-mail ou identificador, com data e hora automáticas) | ✅ Obrigatória: cadastro |
| Listagem dos participantes de cada lista e contagem em tempo real | ✅ Obrigatória: listagem |
| Edição de listas e de participantes (a data e a hora do registro não podem ser alteradas) | ⭐ Opcional: alteração |
| Exclusão de listas e de participantes, com confirmação | ⭐ Opcional: exclusão |
| Pesquisa de listas e de participantes (ignora acentos e maiúsculas) | ⭐ Opcional: pesquisa |

## Tecnologias

- **HTML5:** estrutura das telas e formulários
- **CSS3:** estilo, layout e responsividade
- **JavaScript (Vanilla):** regras de negócio, validações, manipulação do DOM e navegação entre telas
- **LocalStorage:** armazenamento dos dados no navegador, sem banco de dados externo
- **Git e GitHub:** controle de versão e trabalho em equipe
- **VS Code:** ambiente de desenvolvimento
- **Figma:** protótipo e guia de estilo

## Estrutura do projeto

```
registro-presenca/
├── index.html              → telas da aplicação (HTML)
├── style.css               → estilos (CSS)
├── testes.html             → testes automatizados das regras de negócio
├── CONTRATO-HTML.md        → ids e classes que ligam o HTML ao JavaScript
├── js/
│   ├── utils.js            → funções auxiliares (formatar data, gerar id, normalizar texto)
│   ├── storage.js          → leitura e gravação no LocalStorage
│   ├── validacao.js        → validação dos formulários
│   ├── listas.js           → regras de negócio (criar, editar, excluir, pesquisar)
│   ├── ui.js               → desenha as informações na tela
│   └── app.js              → navegação entre telas e eventos dos botões
└── docs/
    ├── levantamento-informacoes.md  → requisitos e regras de negócio
    └── prints/                      → prints das telas (evidências)
```

## Boas práticas aplicadas

1. **Separação de responsabilidades:** HTML (estrutura), CSS (aparência) e JavaScript (comportamento) ficam em arquivos separados. Dentro do JavaScript, cada arquivo tem uma única função: armazenamento, validação, regras de negócio, interface e navegação.
2. **Camada de armazenamento isolada:** só o `storage.js` acessa o LocalStorage. Para trocar por um banco de dados no futuro, como foi planejado na 1ª etapa, basta alterar esse arquivo.
3. **Contrato entre HTML e JavaScript:** o arquivo `CONTRATO-HTML.md` define os ids e classes usados pelos dois lados. Isso permitiu que o HTML e o JS fossem desenvolvidos por pessoas diferentes, em paralelo.
4. **Validação de dados:** campos obrigatórios, tamanho mínimo, formato de e-mail e bloqueio de participante repetido na mesma lista. Os erros aparecem embaixo de cada campo.
5. **Integridade do registro:** a data e a hora da presença são geradas automaticamente e não podem ser alteradas.
6. **Confirmação antes de excluir**, para evitar perda de dados por clique acidental.
7. **Segurança contra XSS:** os textos digitados pelo usuário são inseridos na tela com `textContent`, nunca com `innerHTML`, para impedir a execução de código malicioso.
8. **Tratamento de erros:** se os dados do LocalStorage estiverem corrompidos, a aplicação não quebra (`try/catch`).
9. **Código legível:** nomes de variáveis, funções e arquivos em português, com comentários explicando cada parte.
10. **Variáveis CSS:** cores, bordas e sombras centralizadas em `:root`, o que facilita manter um visual consistente.
11. **Responsividade:** o layout se adapta a telas de celular.
12. **Usabilidade:** a tecla `Esc` e o clique fora da janela fecham os modais, avisos rápidos confirmam cada ação e há mensagens quando a lista está vazia ou a pesquisa não encontra nada.
13. **Testes:** testes automatizados das regras de negócio (`testes.html`) e testes manuais de todas as telas.
14. **Controle de versão:** Git e GitHub, com commits por integrante e Pull Request.

## Testes realizados

### Testes automatizados

O arquivo `testes.html` executa **20 testes** sobre as regras de negócio (`listas.js`, `validacao.js`, `storage.js` e `utils.js`). Resultado: **20 de 20 passaram** ([print](docs/prints/16-testes-automatizados.png)).
Os testes usam uma chave separada do LocalStorage, então não apagam os dados reais da aplicação.

### Testes manuais

| # | Funcionalidade | Ação realizada | Resultado esperado | Resultado obtido | Status | Evidência |
|---|---|---|---|---|---|---|
| 1 | Cadastro de lista | Preencher nome, data e descrição e clicar em *Salvar lista* | Lista criada e aberta para registrar presenças | Lista criada e aberta | ✅ Passou | [02](docs/prints/02-nova-lista.png) |
| 2 | Validação da lista | Clicar em *Salvar lista* com os campos vazios | Mensagens de erro em nome e data, nada salvo | Erros exibidos, nada salvo | ✅ Passou | [03](docs/prints/03-nova-lista-validacao.png) |
| 3 | Listagem de listas | Criar 3 listas e voltar para *Minhas Listas* | 3 cartões ordenados por data, com o total de presentes | 3 cartões exibidos corretamente | ✅ Passou | [04](docs/prints/04-minhas-listas.png) |
| 4 | Lista vazia | Abrir o sistema sem nenhuma lista | Mensagem orientando a criar a primeira lista | Mensagem exibida | ✅ Passou | [01](docs/prints/01-minhas-listas-vazia.png) |
| 5 | Registro de presença | Informar nome e e-mail e clicar em *Registrar* | Participante na tabela com data e hora automáticas | Participante adicionado com data e hora | ✅ Passou | [06](docs/prints/06-registro-presenca-sucesso.png) |
| 6 | Contagem em tempo real | Registrar 4 participantes | Contador mostra "4 presentes" | Contador mostrou 4 | ✅ Passou | [05](docs/prints/05-detalhe-lista.png) |
| 7 | Identificador que não é e-mail | Registrar com "RA 202611" | Registro aceito | Registro aceito | ✅ Passou | [05](docs/prints/05-detalhe-lista.png) |
| 8 | Campos vazios no registro | Clicar em *Registrar* sem preencher | Mensagens de erro nos dois campos | Erros exibidos | ✅ Passou | [07b](docs/prints/07b-validacao-campos-vazios.png) |
| 9 | Participante duplicado | Registrar o mesmo e-mail duas vezes (com maiúsculas diferentes) | Bloquear com mensagem de erro | Bloqueado: "já está registrado" | ✅ Passou | [07](docs/prints/07-validacao-duplicado.png) |
| 10 | E-mail inválido | Registrar com "ana@email" | Mensagem "E-mail inválido" | Mensagem exibida | ✅ Passou | testes.html |
| 11 | Editar participante | Clicar em *Editar*, alterar o nome e salvar | Nome atualizado; data e hora mantidas | Nome atualizado, data e hora iguais | ✅ Passou | [08](docs/prints/08-editar-participante.png), [09](docs/prints/09-participante-editado.png) |
| 12 | Pesquisa de participantes | Digitar "bruno" no filtro | Mostrar só o participante correspondente | 1 participante exibido | ✅ Passou | [10](docs/prints/10-pesquisa-participantes.png) |
| 13 | Remover participante | Clicar em *Remover* e confirmar | Participante removido e contador atualizado | Removido, contador de 4 para 3 | ✅ Passou | [11](docs/prints/11-confirmar-remocao.png) |
| 14 | Cancelar remoção | Clicar em *Remover* e cancelar (botão ou Esc) | Nada é removido | Nada removido | ✅ Passou | – |
| 15 | Editar lista | Clicar em *Editar* no cartão, alterar o nome e salvar | Cartão exibe o novo nome | Nome atualizado | ✅ Passou | [12](docs/prints/12-editar-lista.png) |
| 16 | Pesquisa de listas | Digitar "workshop" na pesquisa | Mostrar só a lista correspondente | 1 lista exibida | ✅ Passou | [13](docs/prints/13-pesquisa-listas.png) |
| 17 | Pesquisa sem resultado | Digitar um termo que não existe | Mensagem "Nenhuma lista encontrada" | Mensagem exibida | ✅ Passou | – |
| 18 | Excluir lista | Clicar em *Excluir* no cartão e confirmar | Lista e participantes removidos | Lista removida | ✅ Passou | [14](docs/prints/14-confirmar-exclusao-lista.png) |
| 19 | Persistência (LocalStorage) | Recarregar a página (F5) | Dados continuam salvos | Dados mantidos | ✅ Passou | – |
| 20 | Segurança (XSS) | Criar lista com o nome `<img src=x onerror=alert(1)>` | Texto exibido sem executar código | Exibido como texto | ✅ Passou | – |
| 21 | Lista inexistente | Acessar o endereço de uma lista excluída | Mensagem de lista não encontrada | Mensagem exibida | ✅ Passou | – |
| 22 | Responsividade | Abrir em tela de celular (390px) | Layout se adapta à tela | Cartões e formulários empilhados | ✅ Passou | [15](docs/prints/15-celular.png) |

## Links

- **Protótipo no Figma:** https://www.figma.com/design/K3lc1RP09ad7dvyjVcV90G/App---Presen%C3%A7a?node-id=0-1&t=10DsDJKvcXhktYrj-1
- **Levantamento de informações e requisitos:** pasta [`docs/`](docs/)
