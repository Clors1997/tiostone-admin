import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress"; // progress bar
import { getCrumbStatus } from "@/utils/crumb";

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/tiostone/"
    },
    {
      path: "/tiostone/",
      redirect: "/tiostone/login"
    },
    {
      path: "/tiostone/pdf1",
      component: () => import("@/view/pdf1.vue")
    },
    //主頁
    {
      path: "/tiostone/home",
      name: "home",
      redirect: "/tiostone/home/clientele",
      component: resolve => require(["@/layout/home.vue"], resolve),
      children: [
        {
          path: "clientele",
          name: "home_clientele",
          meta:{
            slelectkey: [0],
          },
          component: resolve => require(["@/view/clientele"], resolve)
        },
        {
          path: "plate",
          name: "home_plate",
          meta:{
            slelectkey: [5],
          },
          component: resolve => require(["@/view/plate/index2.vue"], resolve)
        },
        {
          path: "product",
          name: "home_product",
          meta:{
            slelectkey: [1],
          },
          component: resolve => require(["@/view/product"], resolve)
        },
        {
          path: "invoice",
          name: "home_invoice",
          meta:{
            slelectkey: [2],
          },
          component: resolve => require(["@/view/invoice"], resolve)
        },
        {
          path: "record",
          name: "home_record",
          meta:{
            slelectkey: [6],
          },
          component: resolve => require(["@/view/record"], resolve)
        },
        {
          path: "deliveryNote",
          name: "home_deliveryNote",
          meta:{
            slelectkey: [3],
          },
          component: resolve => require(["@/view/deliveryNote"], resolve)
        },
        {
          path: "deliveryNoteProduct",
          name: "home_deliveryNoteProduct",
          meta:{
            slelectkey: [3],
          },
          component: resolve => require(["@/view/deliveryNoteProduct"], resolve)
        },
        {
          path: "factory",
          name: "home_factory",
          meta:{
            slelectkey: [4],
          },
          component: resolve => require(["@/view/factory"], resolve)
        }
      ]
    },
    // 登入頁面
    {
      path: "/tiostone/login",
      component: () => import("@/view/login.vue")
    },
    //登入頁面
    {
      path: "*",
      name: "404",
      component: () => import("@/view/404.vue")
    }
  ],
  linkActiveClass: "ant-menu-item-selected"
});

router.beforeEach((to, from, next) => {
  // start progress bar
  console.log(to);
  // let url_path_array = to.fullPath.split("/").filter(element => element != "");
  // console.log(url_path_array, to.meta.limit);
  if(to.meta.slelectkey != undefined){
    router.app.$store.commit('breadcrumb/SET_SELECT', to.meta.slelectkey);
  }
  NProgress.start();

  // if(to.meta.limit == 0){
  //   router.replace({ path: "/404" });
  // }


  if(from.name != undefined && from.name != '404' && to.name != undefined && to.name != '404'){
    let temp_crumb_obj = getCrumbStatus(from.name, to.name);
    console.log(from.name, to.name, temp_crumb_obj)
    if(temp_crumb_obj.status == 0){
      router.app.$store.commit('breadcrumb/POP_CRUMB');
      router.app.$store.commit('breadcrumb/PUSH_CRUMB', temp_crumb_obj.newCrumb);
    }
    if(temp_crumb_obj.status == 1){
      router.app.$store.commit('breadcrumb/PUSH_CRUMB', temp_crumb_obj.newCrumb);
    }
    if(temp_crumb_obj.status == -1){
      router.app.$store.commit('breadcrumb/POP_CRUMB');
    }
  }


  // if(to.path !== "/404"){
  //   if (to.path !== "/admin/login" && !sessionStorage.token) {
  //     errorModalPopUp("e_0003");
  //     return next("/admin/login");
  //   } else if (url_path_array[1] == "property") {
  //     // update vuex state app/property when from home to property Detail
  //     // Step1: check if sessionStory and vuex state empty, if Yes -> go to Home Page. Error Code - e_property_0001
  //     // Step2: check if app/property.property_id match router bid or not, if No -> go to Home.

  //     if (to.params.bid == undefined) {
  //       errorModalPopUp("e_0001");
  //       sessionStorage.log_property_id = "0";
  //       return next("/admin/home");
  //     } else if (sessionStorage.log_property_id != to.params.bid) {
  //       errorModalPopUp("e_0002");
  //       sessionStorage.log_property_id = "0";
  //       return next("/admin/home");
  //     }
  //   }
  // }

  next();
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

var errorModalPopUp = errorCode => {
  router.app.$error({
    title: getErrorCodeByCode(errorCode).title,
    content: getErrorCodeByCode(errorCode).content
  });
  NProgress.done();
};

export default router;
