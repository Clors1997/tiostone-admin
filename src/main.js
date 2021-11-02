// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from "./store"
import router from './router'
import ant from 'ant-design-vue'
import './utils/error-log.js' // error log
import "ant-design-vue/dist/antd.less"
import 'nprogress/nprogress.css' // progress bar style
import defaultlimit from "@/utils/limit.js"
import htmlToPdf from '@/utils/htmlToPdf';
import VueDraggableResizable from 'vue-draggable-resizable'

Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.use(htmlToPdf);
Vue.use(ant)
Vue.config.productionTip = false
Vue.prototype.$defaultlimit = defaultlimit

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
