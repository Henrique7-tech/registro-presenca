/**
 * app.js
 * Ponto de entrada: controla a navegação entre as telas (rotas)
 * e liga os botões/formulários às regras de negócio.
 *
 * Rotas (ficam depois do # na URL):
 *   #/              -> Minhas listas
 *   #/nova          -> Nova lista
 *   #/editar/ID     -> Editar lista
 *   #/lista/ID      -> Detalhe da lista (participantes)
 */
const App = {
  // Estado atual da aplicação
  estado: {
    listaAtualId: null,         // lista aberta (detalhe) ou sendo editada
    participanteEditandoId: null,
    acaoConfirmar: null,        // função executada ao confirmar uma exclusão
  },

  iniciar() {
    this.registrarEventos();
    window.addEventListener("hashchange", () => this.rotear());
    this.rotear();
  },

  /* ================= Navegação ================= */

  rotear() {
    const partes = (location.hash || "#/").replace(/^#\/?/, "").split("/");
    const [rota, id] = partes;
    UI.fecharModais();

    if (rota === "") return this.abrirTelaListas();
    if (rota === "nova") return this.abrirFormLista(null);
    if (rota === "editar" && id) return this.abrirFormLista(id);
    if (rota === "lista" && id) return this.abrirDetalhe(id);

    location.hash = "#/"; // rota desconhecida: volta para o início
  },

  irPara(hash) {
    location.hash = hash;
  },

  /* ================= Tela 1: Minhas listas ================= */

  abrirTelaListas() {
    this.estado.listaAtualId = null;
    UI.el("pesquisa-listas").value = "";
    this.atualizarListas();
    UI.mostrarTela("tela-listas");
  },

  atualizarListas() {
    const todas = Listas.todas();
    const filtradas = Listas.filtrar(todas, UI.el("pesquisa-listas").value);
    UI.renderizarListas(filtradas, todas.length);
  },

  confirmarExclusaoLista(id) {
    const lista = Listas.buscar(id);
    if (!lista) return;
    const qtd = lista.participantes.length;
    let mensagem = `Deseja excluir a lista "${lista.nome}"?`;
    if (qtd === 1) mensagem += " O registro de presença dela também será removido.";
    if (qtd > 1) mensagem += ` Os ${qtd} registros de presença dela também serão removidos.`;
    mensagem += " Essa ação não pode ser desfeita.";

    this.pedirConfirmacao(mensagem, () => {
      Listas.excluir(id);
      UI.avisar("Lista excluída.");
      this.atualizarListas();
    });
  },

  /* ================= Tela 2: Nova / Editar lista ================= */

  abrirFormLista(id) {
    if (id) {
      const lista = Listas.buscar(id);
      if (!lista) return UI.mostrarTela("tela-nao-encontrada");
      this.estado.listaAtualId = id;
      UI.preencherFormLista(lista);
    } else {
      this.estado.listaAtualId = null;
      UI.preencherFormLista(null);
    }
    UI.mostrarTela("tela-form-lista");
    UI.el("lista-nome").focus();
  },

  salvarLista(evento) {
    evento.preventDefault();
    const form = evento.target;
    const dados = {
      nome: form.nome.value,
      data: form.data.value,
      descricao: form.descricao.value,
    };

    const editando = Boolean(this.estado.listaAtualId);
    const resultado = editando
      ? Listas.atualizar(this.estado.listaAtualId, dados)
      : Listas.criar(dados);

    if (!resultado.ok) return UI.mostrarErros(form, resultado.erros);

    UI.avisar(editando ? "Lista atualizada." : "Lista criada com sucesso.");
    // Depois de criar, já abre a lista para registrar presenças
    this.irPara(editando ? "#/" : `#/lista/${resultado.item.id}`);
  },

  /* ================= Tela 3: Detalhe da lista ================= */

  abrirDetalhe(id) {
    const lista = Listas.buscar(id);
    if (!lista) return UI.mostrarTela("tela-nao-encontrada");

    this.estado.listaAtualId = id;
    const form = UI.el("form-participante");
    form.reset();
    UI.limparErros(form);
    UI.el("pesquisa-participantes").value = "";
    this.atualizarDetalhe();
    UI.mostrarTela("tela-detalhe");
  },

  atualizarDetalhe() {
    const lista = Listas.buscar(this.estado.listaAtualId);
    if (!lista) return UI.mostrarTela("tela-nao-encontrada");

    UI.renderizarCabecalhoDetalhe(lista);
    const filtrados = Listas.filtrarParticipantes(lista.participantes, UI.el("pesquisa-participantes").value);
    UI.renderizarParticipantes(filtrados, lista.participantes.length);
  },

  registrarPresenca(evento) {
    evento.preventDefault();
    const form = evento.target;
    const resultado = Listas.adicionarParticipante(this.estado.listaAtualId, {
      nome: form.nome.value,
      identificador: form.identificador.value,
    });

    if (!resultado.ok) return UI.mostrarErros(form, resultado.erros);

    form.reset();
    UI.limparErros(form);
    form.nome.focus(); // pronto para o próximo participante
    UI.avisar(`Presença de ${resultado.item.nome} registrada.`);
    this.atualizarDetalhe();
  },

  abrirEdicaoParticipante(participanteId) {
    const lista = Listas.buscar(this.estado.listaAtualId);
    const participante = lista && lista.participantes.find((p) => p.id === participanteId);
    if (!participante) return;

    this.estado.participanteEditandoId = participanteId;
    const form = UI.el("form-editar-participante");
    UI.limparErros(form);
    form.nome.value = participante.nome;
    form.identificador.value = participante.identificador;
    UI.el("editar-data").textContent = participante.data;
    UI.el("editar-hora").textContent = participante.hora;
    UI.abrirModal("modal-participante");
  },

  salvarEdicaoParticipante(evento) {
    evento.preventDefault();
    const form = evento.target;
    const resultado = Listas.atualizarParticipante(
      this.estado.listaAtualId,
      this.estado.participanteEditandoId,
      { nome: form.nome.value, identificador: form.identificador.value }
    );

    if (!resultado.ok) return UI.mostrarErros(form, resultado.erros);

    UI.fecharModais();
    UI.avisar("Participante atualizado.");
    this.atualizarDetalhe();
  },

  confirmarRemocaoParticipante(participanteId) {
    const lista = Listas.buscar(this.estado.listaAtualId);
    const participante = lista && lista.participantes.find((p) => p.id === participanteId);
    if (!participante) return;

    this.pedirConfirmacao(`Deseja remover a presença de "${participante.nome}"?`, () => {
      Listas.removerParticipante(this.estado.listaAtualId, participanteId);
      UI.avisar("Participante removido.");
      this.atualizarDetalhe();
    });
  },

  /* ================= Confirmação (modal) ================= */

  pedirConfirmacao(mensagem, aoConfirmar) {
    UI.el("confirmar-mensagem").textContent = mensagem;
    this.estado.acaoConfirmar = aoConfirmar;
    UI.abrirModal("modal-confirmar");
  },

  /* ================= Eventos ================= */

  registrarEventos() {
    // Formulários
    UI.el("form-lista").addEventListener("submit", (e) => this.salvarLista(e));
    UI.el("form-participante").addEventListener("submit", (e) => this.registrarPresenca(e));
    UI.el("form-editar-participante").addEventListener("submit", (e) => this.salvarEdicaoParticipante(e));

    // Pesquisa (filtra enquanto digita)
    UI.el("pesquisa-listas").addEventListener("input", () => this.atualizarListas());
    UI.el("pesquisa-participantes").addEventListener("input", () => this.atualizarDetalhe());

    // Botões criados dinamicamente: um único "ouvinte" usando data-acao (delegação de eventos)
    UI.el("grade-listas").addEventListener("click", (e) => {
      const botao = e.target.closest('[data-acao="excluir-lista"]');
      if (botao) this.confirmarExclusaoLista(botao.dataset.id);
    });

    UI.el("tabela-participantes").addEventListener("click", (e) => {
      const botao = e.target.closest("[data-acao]");
      if (!botao) return;
      if (botao.dataset.acao === "editar-participante") this.abrirEdicaoParticipante(botao.dataset.id);
      if (botao.dataset.acao === "remover-participante") this.confirmarRemocaoParticipante(botao.dataset.id);
    });

    // Confirmar exclusão
    UI.el("botao-confirmar").addEventListener("click", () => {
      const acao = this.estado.acaoConfirmar;
      this.estado.acaoConfirmar = null;
      UI.fecharModais();
      if (acao) acao();
    });

    // Fechar modais: botão X / Cancelar, clique fora da caixa, tecla Esc
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.closest("[data-fechar-modal]")) UI.fecharModais();
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") UI.fecharModais();
    });
  },
};

document.addEventListener("DOMContentLoaded", () => App.iniciar());
