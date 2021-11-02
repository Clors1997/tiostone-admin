const state = {
  domain: "http://34.92.191.50/",
  TOKEN: "",
  PROPERTY: {},
};
const mutations = {
  SET_TOKEN(state, TOKEN) {
    sessionStorage.setItem("TOKEN", TOKEN);
    state.TOKEN = TOKEN;
  },
  CLEAR_TOKEN(state) {
    sessionStorage.removeItem("TOKEN");
    state.TOKEN = "";
  },
  SET_ACTIVE_PROPERTY(state, PROPERTY) {
    sessionStorage.setItem("PROPERTY", PROPERTY);
    state.PROPERTY = PROPERTY;
  },
  CLEAR_ACTIVE_PROPERTY(state) {
    sessionStorage.removeItem("PROPERTY");
    state.PROPERTY = {};
  }
};

const actions = {
  setActiveProperty({ commit }, info) {
    commit('SET_ACTIVE_PROPERTY', info)
  },
  clearActiveProperty({ commit }) {
    commit('CLEAR_ACTIVE_PROPERTY', info)
  },
  setToken({ commit }, Token) {
    commit("SET_TOKEN", Token);
  },
  clearToken({ commit }) {
    commit("CLEAR_TOKEN");
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
