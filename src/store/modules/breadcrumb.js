const state = {
  crumb: [],
  selectkeys: []
};
const mutations = {
  SET_CRUMB(state, first) {
    state.crumb = first;
    console.log(state.crumb)
    sessionStorage.setItem("breadcrumb", JSON.stringify(state.crumb));
  },
  PUSH_CRUMB(state, next) {
    state.crumb.push(next);
    sessionStorage.setItem("breadcrumb", JSON.stringify(state.crumb));
  },
  POP_CRUMB(state) {
    state.crumb.pop();
    sessionStorage.setItem("breadcrumb", JSON.stringify(state.crumb));
  },
  SET_SELECT(state, selectkeys) {
    state.selectkeys = selectkeys;
    console.log(state.selectkeys);
    sessionStorage.setItem("selectkeys", JSON.stringify(state.selectkeys));
  },
};

const actions = {

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
