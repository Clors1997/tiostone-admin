<template>
  <div class="home-container">
    <a-layout id="components-layout-demo-fixed">
        <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
          <span>
             <span style="float: right;">
               <a-dropdown>
                 <a-menu slot="overlay">
                   <a-menu-item
                     @click="
                       () => {
                         admin_logout();
                       }
                     "
                   >
                     <a-icon type="arrow-left" />Logout
                   </a-menu-item>
                 </a-menu>
                 <p class="user" style="background-color: #001529;">
                   <a-icon type="user" style="color: #FFF;" />
                 </p>
               </a-dropdown>
               <p class="sync" style="background-color: #001529;">
                 <a-icon type="sync" style="color: #FFF;" :spin="flash" @click="reload"/>
               </p>
             </span>
             <a-menu
               theme="dark"
               mode="horizontal"
               :selectedKeys="vuex_selectkeys"
               :style="{ lineHeight: '64px',width: '50%' }"
             >
               <a-menu-item
                 v-for="(item) in memu"
                 :key="item.key"
                 @click="onMenuSelect(item)"
               >
                 <a-icon :type="item.icon"></a-icon>
                 <span >{{ item.title }}</span>
               </a-menu-item>
             </a-menu>

          </span>



        </a-layout-header>
        <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
          <a-breadcrumb :style="{ margin: '16px 0' }">
            <a-breadcrumb-item class="breadcrumb-items" v-for="(item,key) in vuex_crumb" :key="key"><a href="javascript:void(0)" @click="breadcrumbClick(item)">{{item.title}}</a></a-breadcrumb-item>
          </a-breadcrumb>
          <div :style="{ background: '#fff', padding: '24px', 'min-height': '80px' }">
            <router-view v-if="isRouterAlive" :screenwidth="screenWidth" />
          </div>
        </a-layout-content>
      </a-layout>

  </div>
</template>
<script>
import uuidv1 from "uuid/v1";
import { mapGetters, mapMutations } from 'vuex';

export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      memu: [
        {
          r_name: "home_clientele",
          title: "Client",
          icon: "team",
          key: 0
        },
        {
          r_name: "home_invoice",
          title: "P.O.",
          icon: "container",
          key: 2
        },
        {
          r_name: "home_deliveryNote",
          title: "Delivery Note",
          icon: "container",
          key: 3
        },
        {
          r_name: "home_record",
          title: "Invoice",
          icon: "container",
          key: 6
        },
        {
          r_name: "home_plate",
          title: "Plate",
          icon: "car",
          key: 5
        }
      ],
      breadcrumb: [

      ],
      isRouterAlive: true,
      flash: false,
      screenWidth: document.documentElement.clientWidth,
      timer: false
    };
  },
  watch:{
      screenWidth(val){
          if(!this.timer){
              this.screenWidth = val
              this.timer = true
              let that = this
              setTimeout(function(){
                  that.timer = false
              },500)
          }
      }
  },
  created() {
    this.memu.some(item => {
      if (this.$route.name == item.r_name) {
        this.breadcrumb.push(item.title);
        return true;
      }
    });
    console.log(this.$route.params.firstactive)
    if(sessionStorage.firstactive == 'isfirst'){
      this.vuex_set_crumb([{
        r_name: "home_clientele",
        title: "Client"
      }]);
      sessionStorage.firstactive = '';
    }else{
      let temp_breadcrumb = JSON.parse(sessionStorage.breadcrumb);
      if(temp_breadcrumb != ""){
        this.vuex_set_crumb(temp_breadcrumb);
      }
    }
  },
  mounted() {
      this.screenWidth = document.body.clientWidth;
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth;
        })();
      };
  },
  computed: {
    ...mapGetters({
    	vuex_crumb: "crumb",
      vuex_selectkeys: "selectkeys",
    })
  },
  methods: {
    ...mapMutations({
        vuex_set_crumb: "breadcrumb/SET_CRUMB",
        vuex_push_crumb: "breadcrumb/PUSH_CRUMB",
        vuex_pop_crumb: "breadcrumb/POP_CRUMB"
    }),
    reload() {
      this.isRouterAlive = false;
      let that = this;
      this.$nextTick(function (){
        that.isRouterAlive = true;
        that.flash = true;
        setTimeout(function (){
        	that.flash = false;
        }, 1000);
      })
    },
    onMenuSelect(item) {
      console.log(this.vuex_selectkeys)
      console.log(item, 111)
      this.$router.push({ name: item.r_name });
    },
    breadcrumbClick(item){
      if(item.r_name == ''){

      }else{
        this.onMenuSelect(item);
      }
    },
    admin_logout() {
      sessionStorage.token = "";
      this.$message.success("登出成功");
      this.$router.push({ path: "/tiostone/login" });
    }
  }
};
</script>

<style lang="scss">
.home-container {
  min-height: 100%;
  background: #f0f2f5;

  .user {
    cursor: pointer;
    width: auto;
    height: 31px;
    font-size: 25px;
    padding: 3px 8px;
    float: right;
    margin: 16px 16px 16px 0;
    line-height: 100%;
    background: rgba(255, 255, 255, 0.2);
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    color: black;
    text-align: center;
  }

  .sync {
    cursor: pointer;
    width: auto;
    height: 31px;
    font-size: 25px;
    padding: 3px 8px;
    float: right;
    margin: 16px 16px 16px 0;
    line-height: 100%;
    background: rgba(255, 255, 255, 0.2);
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    color: black;
    text-align: center;
  }

  .menu-style{
    width: 80%;
  }

}
  #components-layout-demo-fixed{
    height: 90%;
  }

  #components-layout-demo-fixed .logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 24px 16px 0;
    float: left;
  }

  .breadcrumb-items {
    color: #276297 !important;
  }
</style>
