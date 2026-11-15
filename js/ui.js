/**
 * ui.js
 * Tudo o que desenha ou altera a tela (DOM).
 * Os textos digitados pelo usuário são inseridos com textContent,
 * nunca com innerHTML — isso evita que alguém injete código na página (XSS).
 */
const UI = {
  /** Atalho para document.getElementById. */
  el(id) {
    return document.getElementById(id);
  },

  /** Cria um elemento HTML com classe, texto e atributos. */
  criar(tag, { classe, texto, atributos = {} } = {}) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    Object.entries(atributos).forEach(([nome, valor]) => elemento.setAttribute(nome, valor));
    return elemento;
  },

  /** Mostra só a tela pedida e esconde as outras. */
  mostrarTela(idTela) {
    document.querySelectorAll(".tela").forEach((tela) => {
      tela.hidden = tela.id !== idTela;
    });
    window.scrollTo(0, 0);
  },

  /* ---------------- Tela 1: Minhas listas ---------------- */

  renderizarListas(listas, totalSemFiltro) {
    const grade = this.el("grade-listas");
    const vazio = this.el("listas-vazio");
    grade.replaceChildren();

    if (listas.length === 0) {
      vazio.hidden = false;
      vazio.textContent =
        totalSemFiltro === 0
          ? "Você ainda não tem listas. Clique em \"+ Nova lista\" para começar."
          : "Nenhuma lista encontrada para essa pesquisa.";
      return;
    }

    vazio.hidden = true;
    listas.forEach((lista) => grade.appendChild(this.criarCartaoLista(lista)));
  },

  criarCartaoLista(lista) {
    const cartao = this.criar("article", { classe: "cartao cartao-lista", atributos: { "data-id": lista.id } });

    cartao.appendChild(this.criar("h2", { classe: "cartao-lista__nome", texto: lista.nome }));
    cartao.appendChild(this.criar("p", { classe: "texto-suave", texto: Utils.formatarData(lista.data) }));
    if (lista.descricao) {
      cartao.appendChild(this.criar("p", { classe: "cartao-lista__descricao", texto: lista.descricao }));
    }
    cartao.appendChild(
      this.criar("p", { classe: "cartao-lista__total", texto: Utils.textoPresentes(lista.participantes.length) })
    );

    const acoes = this.criar("div", { classe: "cartao-lista__acoes" });
    acoes.appendChild(
      this.criar("a", {
        classe: "botao botao--secundario botao--pequeno",
        texto: "Abrir",
        atributos: { href: `#/lista/${lista.id}` },
      })
    );
    acoes.appendChild(
      this.criar("a", {
        classe: "botao botao--secundario botao--pequeno",
        texto: "Editar",
        atributos: { href: `#/editar/${lista.id}` },
      })
    );
    acoes.appendChild(
      this.criar("button", {
        classe: "botao botao--perigo botao--pequeno",
        texto: "Excluir",
        atributos: { type: "button", "data-acao": "excluir-lista", "data-id": lista.id },
      })
    );
    cartao.appendChild(acoes);
    return cartao;
  },

  /* ---------------- Tela 2: Formulário de lista ---------------- */

  preencherFormLista(lista) {
    const editando = Boolean(lista);
    this.el("titulo-form-lista").textContent = editando ? "Editar lista" : "Nova lista";
    this.el("botao-salvar-lista").textContent = editando ? "Salvar alterações" : "Salvar lista";
    this.el("lista-nome").value = editando ? lista.nome : "";
    this.el("lista-data").value = editando ? lista.data : "";
    this.el("lista-descricao").value = editando ? lista.descricao : "";
    this.limparErros(this.el("form-lista"));
  },

  /* ---------------- Tela 3: Detalhe da lista ---------------- */

  renderizarCabecalhoDetalhe(lista) {
    this.el("detalhe-nome").textContent = lista.nome;
    this.el("detalhe-data").textContent = Utils.formatarData(lista.data);
    const descricao = this.el("detalhe-descricao");
    descricao.textContent = lista.descricao;
    descricao.hidden = !lista.descricao;

    const total = lista.participantes.length;
    this.el("detalhe-total").textContent = total;
    this.el("detalhe-total-rotulo").textContent = total === 1 ? "presente" : "presentes";
  },

  renderizarParticipantes(participantes, totalSemFiltro) {
    const corpo = this.el("tabela-participantes");
    const vazio = this.el("participantes-vazio");
    corpo.replaceChildren();

    if (participantes.length === 0) {
      vazio.hidden = false;
      vazio.textContent =
        totalSemFiltro === 0
          ? "Nenhuma presença registrada ainda."
          : "Nenhum participante encontrado para essa pesquisa.";
      return;
    }

    vazio.hidden = true;
    participantes.forEach((p) => {
      const linha = this.criar("tr", { atributos: { "data-id": p.id } });
      linha.appendChild(this.criar("td", { texto: p.nome }));
      linha.appendChild(this.criar("td", { texto: p.identificador }));
      linha.appendChild(this.criar("td", { texto: p.data }));
      linha.appendChild(this.criar("td", { texto: p.hora }));

      const celulaAcoes = this.criar("td");
      const acoes = this.criar("div", { classe: "tabela__acoes" });
      acoes.appendChild(
        this.criar("button", {
          classe: "botao botao--secundario botao--pequeno",
          texto: "Editar",
          atributos: { type: "button", "data-acao": "editar-participante", "data-id": p.id },
        })
      );
      acoes.appendChild(
        this.criar("button", {
          classe: "botao botao--perigo botao--pequeno",
          texto: "Remover",
          atributos: { type: "button", "data-acao": "remover-participante", "data-id": p.id },
        })
      );
      celulaAcoes.appendChild(acoes);
      linha.appendChild(celulaAcoes);
      corpo.appendChild(linha);
    });
  },

  /* ---------------- Erros de formulário ---------------- */

  /** Mostra as mensagens de erro embaixo de cada campo inválido. */
  mostrarErros(form, erros) {
    this.limparErros(form);
    Object.entries(erros).forEach(([campo, mensagem]) => {
      const span = form.querySelector(`[data-erro="${campo}"]`);
      const input = form.querySelector(`[name="${campo}"]`);
      if (span) span.textContent = mensagem;
      if (input) {
        input.classList.add("campo--invalido");
        input.setAttribute("aria-invalid", "true");
      }
    });
    // Coloca o cursor no primeiro campo com erro
    const primeiro = form.querySelector(".campo--invalido");
    if (primeiro) primeiro.focus();
  },

  limparErros(form) {
    form.querySelectorAll(".erro-campo").forEach((span) => (span.textContent = ""));
    form.querySelectorAll(".campo--invalido").forEach((input) => {
      input.classList.remove("campo--invalido");
      input.removeAttribute("aria-invalid");
    });
  },

  /* ---------------- Modais ---------------- */

  abrirModal(id) {
    const modal = this.el(id);
    modal.hidden = false;
    const primeiroCampo = modal.querySelector("input, button:not(.modal__fechar)");
    if (primeiroCampo) primeiroCampo.focus();
  },

  fecharModais() {
    document.querySelectorAll(".modal").forEach((modal) => (modal.hidden = true));
  },

  /* ---------------- Aviso rápido (toast) ---------------- */

  avisar(mensagem, tipo = "sucesso") {
    const aviso = this.el("aviso");
    aviso.textContent = mensagem;
    aviso.classList.toggle("aviso--erro", tipo === "erro");
    aviso.hidden = false;
    clearTimeout(this._timerAviso);
    this._timerAviso = setTimeout(() => (aviso.hidden = true), 2500);
  },
};
