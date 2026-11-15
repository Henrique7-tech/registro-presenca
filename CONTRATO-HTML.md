# Contrato entre o HTML e o JavaScript

O JavaScript (pasta `js/`) encontra os elementos da página pelos **ids**, **names** e **classes** abaixo.
O HTML (`index.html`) precisa usar exatamente esses nomes, senão o JS não acha o elemento e a função para de funcionar.
O visual (CSS, cores, layout) é livre. Só os nomes precisam bater.

## Ordem dos scripts no fim do `<body>` do index.html

```html
<script src="js/utils.js"></script>
<script src="js/storage.js"></script>
<script src="js/validacao.js"></script>
<script src="js/listas.js"></script>
<script src="js/ui.js"></script>
<script src="js/app.js"></script>
```

## Telas

Cada tela é uma `<section>` com a classe `tela` e o atributo `hidden`. O JS mostra uma tela por vez.

| id da section | Tela |
|---|---|
| `tela-listas` | Minhas listas |
| `tela-form-lista` | Nova lista / Editar lista |
| `tela-detalhe` | Detalhe da lista (participantes) |
| `tela-nao-encontrada` | Mensagem "Lista não encontrada" |

Links de navegação usam `#`: `href="#/"` (início) e `href="#/nova"` (nova lista).

## Tela "Minhas listas"

| id | Elemento | Para que serve |
|---|---|---|
| `pesquisa-listas` | `<input type="search">` | Campo de pesquisa |
| `grade-listas` | `<div>` vazia | O JS cria os cartões aqui dentro |
| `listas-vazio` | `<p hidden>` | Mensagem quando não há listas |

## Tela "Nova lista / Editar lista"

| id | Elemento | name |
|---|---|---|
| `titulo-form-lista` | `<h1>` | – |
| `form-lista` | `<form novalidate>` | – |
| `lista-nome` | `<input type="text">` | `nome` |
| `lista-data` | `<input type="date">` | `data` |
| `lista-descricao` | `<input type="text">` | `descricao` |
| `botao-salvar-lista` | `<button type="submit">` | – |

## Tela "Detalhe da lista"

| id | Elemento | name |
|---|---|---|
| `detalhe-nome` | `<h1>` | – |
| `detalhe-data` | `<p>` | – |
| `detalhe-descricao` | `<p>` | – |
| `detalhe-total` | `<span>` (número de presentes) | – |
| `detalhe-total-rotulo` | `<span>` ("presentes") | – |
| `form-participante` | `<form novalidate>` | – |
| (sem id) | `<input>` do nome | `nome` |
| (sem id) | `<input>` do e-mail/identificador | `identificador` |
| `pesquisa-participantes` | `<input type="search">` | – |
| `tabela-participantes` | `<tbody>` vazio | O JS cria as linhas aqui |
| `participantes-vazio` | `<p hidden>` | Mensagem quando não há participantes |

## Modal "Editar participante"

| id | Elemento | name |
|---|---|---|
| `modal-participante` | `<div class="modal" hidden>` | – |
| `form-editar-participante` | `<form novalidate>` | – |
| (sem id) | `<input>` do nome | `nome` |
| (sem id) | `<input>` do e-mail | `identificador` |
| `editar-data` | `<p>` (data do registro) | – |
| `editar-hora` | `<p>` (hora do registro) | – |

## Modal "Confirmar exclusão"

| id | Elemento |
|---|---|
| `modal-confirmar` | `<div class="modal" hidden>` |
| `confirmar-mensagem` | `<p>` |
| `botao-confirmar` | `<button>` Excluir |

Os botões de fechar e cancelar dos dois modais precisam do atributo `data-fechar-modal`.

## Aviso rápido (toast)

| id | Elemento |
|---|---|
| `aviso` | `<div role="status" hidden>` |

## Mensagens de erro dos formulários

Embaixo de cada campo, coloque um `<span class="erro-campo" data-erro="NOME_DO_CAMPO"></span>`.
Exemplo: `data-erro="nome"`, `data-erro="data"` ou `data-erro="identificador"`.

## Classes que o JS cria ou usa (o CSS precisa estilizá-las)

- `tela`, `modal`, `modal__fechar`, `erro-campo`, `campo--invalido` (campo com erro), `aviso--erro`
- Cartão da lista: `cartao cartao-lista`, `cartao-lista__nome`, `cartao-lista__descricao`, `cartao-lista__total`, `cartao-lista__acoes`, `texto-suave`
- Botões: `botao`, `botao--secundario`, `botao--perigo`, `botao--pequeno`
- Tabela: `tabela__acoes`
