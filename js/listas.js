/**
 * listas.js
 * Regras de negócio: criar, consultar, editar e excluir listas e participantes.
 * Não mexe na tela (HTML) — só nos dados. Quem desenha a tela é o ui.js.
 *
 * As funções que alteram dados retornam: { ok: true, item } ou { ok: false, erros }.
 */
const Listas = {
  /* ---------------- Listas ---------------- */

  /** Retorna todas as listas, ordenadas pela data do evento. */
  todas() {
    return Storage.carregar().sort((a, b) => a.data.localeCompare(b.data));
  },

  /** Busca uma lista pelo id (ou retorna null). */
  buscar(id) {
    return Storage.carregar().find((lista) => lista.id === id) || null;
  },

  /** Cria uma nova lista. */
  criar(dados) {
    const lista = {
      nome: Utils.limparTexto(dados.nome),
      data: dados.data,
      descricao: Utils.limparTexto(dados.descricao),
    };

    const erros = Validacao.validarLista(lista);
    if (!Validacao.ehValido(erros)) return { ok: false, erros };

    const novaLista = {
      id: Utils.gerarId(),
      ...lista,
      criadaEm: new Date().toISOString(),
      participantes: [],
    };

    const listas = Storage.carregar();
    listas.push(novaLista);
    Storage.salvar(listas);
    return { ok: true, item: novaLista };
  },

  /** Altera nome, data e descrição de uma lista existente. */
  atualizar(id, dados) {
    const alteracoes = {
      nome: Utils.limparTexto(dados.nome),
      data: dados.data,
      descricao: Utils.limparTexto(dados.descricao),
    };

    const erros = Validacao.validarLista(alteracoes);
    if (!Validacao.ehValido(erros)) return { ok: false, erros };

    const listas = Storage.carregar();
    const lista = listas.find((l) => l.id === id);
    if (!lista) return { ok: false, erros: { geral: "Lista não encontrada." } };

    Object.assign(lista, alteracoes);
    Storage.salvar(listas);
    return { ok: true, item: lista };
  },

  /** Exclui uma lista (e todos os participantes dela). */
  excluir(id) {
    const listas = Storage.carregar();
    const restantes = listas.filter((l) => l.id !== id);
    if (restantes.length === listas.length) {
      return { ok: false, erros: { geral: "Lista não encontrada." } };
    }
    Storage.salvar(restantes);
    return { ok: true };
  },

  /** Pesquisa: filtra listas pelo nome ou pela descrição. */
  filtrar(listas, termo) {
    const busca = Utils.normalizar(termo);
    if (!busca) return listas;
    return listas.filter(
      (l) => Utils.normalizar(l.nome).includes(busca) || Utils.normalizar(l.descricao).includes(busca)
    );
  },

  /* ---------------- Participantes ---------------- */

  /** Registra a presença de um participante (data e hora são automáticas). */
  adicionarParticipante(listaId, dados, agora = new Date()) {
    const listas = Storage.carregar();
    const lista = listas.find((l) => l.id === listaId);
    if (!lista) return { ok: false, erros: { geral: "Lista não encontrada." } };

    const participante = {
      nome: Utils.limparTexto(dados.nome),
      identificador: Utils.limparTexto(dados.identificador),
    };

    const erros = Validacao.validarParticipante(participante, lista.participantes);
    if (!Validacao.ehValido(erros)) return { ok: false, erros };

    const novo = {
      id: Utils.gerarId(),
      ...participante,
      data: Utils.dataAtual(agora),
      hora: Utils.horaAtual(agora),
    };

    lista.participantes.push(novo);
    Storage.salvar(listas);
    return { ok: true, item: novo };
  },

  /** Altera nome e e-mail de um participante. Data e hora NÃO mudam. */
  atualizarParticipante(listaId, participanteId, dados) {
    const listas = Storage.carregar();
    const lista = listas.find((l) => l.id === listaId);
    const participante = lista && lista.participantes.find((p) => p.id === participanteId);
    if (!participante) return { ok: false, erros: { geral: "Participante não encontrado." } };

    const alteracoes = {
      nome: Utils.limparTexto(dados.nome),
      identificador: Utils.limparTexto(dados.identificador),
    };

    const erros = Validacao.validarParticipante(alteracoes, lista.participantes, participanteId);
    if (!Validacao.ehValido(erros)) return { ok: false, erros };

    Object.assign(participante, alteracoes);
    Storage.salvar(listas);
    return { ok: true, item: participante };
  },

  /** Remove um participante da lista. */
  removerParticipante(listaId, participanteId) {
    const listas = Storage.carregar();
    const lista = listas.find((l) => l.id === listaId);
    if (!lista) return { ok: false, erros: { geral: "Lista não encontrada." } };

    const antes = lista.participantes.length;
    lista.participantes = lista.participantes.filter((p) => p.id !== participanteId);
    if (lista.participantes.length === antes) {
      return { ok: false, erros: { geral: "Participante não encontrado." } };
    }

    Storage.salvar(listas);
    return { ok: true };
  },

  /** Pesquisa: filtra participantes pelo nome ou pelo e-mail/identificador. */
  filtrarParticipantes(participantes, termo) {
    const busca = Utils.normalizar(termo);
    if (!busca) return participantes;
    return participantes.filter(
      (p) => Utils.normalizar(p.nome).includes(busca) || Utils.normalizar(p.identificador).includes(busca)
    );
  },
};
