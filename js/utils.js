/**
 * utils.js
 * Funções auxiliares pequenas e reutilizáveis (formatação, IDs, texto).
 * Não dependem de nenhum outro arquivo.
 */
const Utils = {
  /** Gera um identificador único para listas e participantes. */
  gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },

  /** Converte "2026-03-12" (formato do input date) em "12/03/2026". */
  formatarData(dataIso) {
    if (!dataIso) return "";
    const [ano, mes, dia] = dataIso.split("-");
    return `${dia}/${mes}/${ano}`;
  },

  /** Retorna a data atual no formato "dd/mm/aaaa". */
  dataAtual(agora = new Date()) {
    return agora.toLocaleDateString("pt-BR");
  },

  /** Retorna a hora atual no formato "hh:mm". */
  horaAtual(agora = new Date()) {
    return agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  },

  /** Remove acentos e deixa minúsculo, para a pesquisa ignorar "á/a" e "A/a". */
  normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
  },

  /** Remove espaços extras do começo, do fim e do meio do texto. */
  limparTexto(texto) {
    return String(texto || "").trim().replace(/\s+/g, " ");
  },

  /** Escreve "1 presente" ou "N presentes". */
  textoPresentes(total) {
    return total === 1 ? "1 presente" : `${total} presentes`;
  },
};
