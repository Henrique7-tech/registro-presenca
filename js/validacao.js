/**
 * validacao.js
 * Regras de validação dos formulários.
 * Cada função retorna um objeto de erros: { campo: "mensagem" }.
 * Se o objeto vier vazio, os dados são válidos.
 */
const Validacao = {
  REGEX_EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** Valida os dados de uma lista (nome e data). */
  validarLista({ nome, data }) {
    const erros = {};

    if (!nome) {
      erros.nome = "Informe o nome do evento ou aula.";
    } else if (nome.length < 3) {
      erros.nome = "O nome precisa ter pelo menos 3 caracteres.";
    }

    if (!data) {
      erros.data = "Informe a data.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || isNaN(new Date(data).getTime())) {
      erros.data = "Data inválida.";
    }

    return erros;
  },

  /**
   * Valida os dados de um participante.
   * @param dados            { nome, identificador }
   * @param participantes    participantes que já estão na lista (para evitar duplicados)
   * @param idIgnorado       id do participante sendo editado (ele não conta como duplicado de si mesmo)
   */
  validarParticipante({ nome, identificador }, participantes = [], idIgnorado = null) {
    const erros = {};

    if (!nome) {
      erros.nome = "Informe o nome do participante.";
    } else if (nome.length < 2) {
      erros.nome = "O nome precisa ter pelo menos 2 caracteres.";
    }

    if (!identificador) {
      erros.identificador = "Informe o e-mail ou identificador.";
    } else if (identificador.includes("@") && !this.REGEX_EMAIL.test(identificador)) {
      erros.identificador = "E-mail inválido.";
    } else {
      const jaExiste = participantes.some(
        (p) => p.id !== idIgnorado && Utils.normalizar(p.identificador) === Utils.normalizar(identificador)
      );
      if (jaExiste) {
        erros.identificador = "Esse participante já está registrado nesta lista.";
      }
    }

    return erros;
  },

  /** Atalho: o objeto de erros está vazio? */
  ehValido(erros) {
    return Object.keys(erros).length === 0;
  },
};
