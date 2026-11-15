/**
 * storage.js
 * Única parte do sistema que conversa com o LocalStorage.
 * Se um dia o grupo trocar o LocalStorage por um banco de dados,
 * só este arquivo precisa mudar.
 */
const Storage = {
  CHAVE: "presenca.listas",

  /** Lê todas as listas salvas. Se não houver nada (ou o dado estiver corrompido), retorna []. */
  carregar() {
    try {
      const dados = localStorage.getItem(this.CHAVE);
      const listas = dados ? JSON.parse(dados) : [];
      return Array.isArray(listas) ? listas : [];
    } catch (erro) {
      console.error("Erro ao ler os dados do LocalStorage:", erro);
      return [];
    }
  },

  /** Salva o array completo de listas. Retorna true se deu certo. */
  salvar(listas) {
    try {
      localStorage.setItem(this.CHAVE, JSON.stringify(listas));
      return true;
    } catch (erro) {
      console.error("Erro ao salvar no LocalStorage:", erro);
      return false;
    }
  },
};
