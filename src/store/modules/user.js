const state = {
  userObj: ""
};
const mutations = {
  ADD_LOGIN_USER(state, userObj) { //登入，保存状态 
    sessionStorage.setItem("userObj", userObj); //添加到sessionStorage 
    sessionStorage.setItem("isLogin", true);
    state.userObj = userObj,  //同步的改变store中的状态 
      state.isLogin = true
  },
  SIGN_OUT(state) { //退出，删除状态 
    sessionStorage.removeItem("userObj"); //移除sessionStorage 
    sessionStorage.removeItem("isLogin");
    state.userObj = ''  //同步的改变story中的状态 
    state.isLogin = false
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
