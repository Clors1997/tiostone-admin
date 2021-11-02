const getters = {
  domain: state => state.app.domain,
  crumb: state => state.breadcrumb.crumb,
  selectkeys: state => state.breadcrumb.selectkeys,
  TOKEN: state => {
    if (state.TOKEN == "") {
      state.TOKEN = sessionStorage.getItem('TOKEN'); //从sessionStorage中读取状态
    }
    return state.app.TOKEN;
  },
  isLogin(state) {
    if (!state.isLogin) {
      state.isLogin = sessionStorage.getItem('isLogin'); //从sessionStorage中读取状态
      state.username = sessionStorage.getItem('username');
    }
    return state.user.username
  },
  getActiveProperty(state) {
    if (state.PROPERTY === undefined) {
      state.PROPERTY = sessionStorage.getItem('PROPERTY'); //从sessionStorage中读取状态
    }
    return state.app.PROPERTY
  },
  errorLogs: state => state.errorLog.logs
};
// gettes should be a function
export default getters;
