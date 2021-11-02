<template>
    <div id="app">
        <router-view v-show="app_show" />
    </div>
</template>

<script>
import  "babel-polyfill";   //兼容ie设置

export default {
  name: "App",
  data() {
    return {
      app_show: false
    }
  },
  mounted() {
    this.$nextTick(function () {
      document.getElementById("cssloading").style.display = 'none';
      this.app_show = true;
    })
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;

  color: #2c3e50;
}

[v-cloak]{
    display:none;
}

.ant-select-disabled {
  color: rgba(0, 0, 0, 0.7) !important;
}

.ant-input-disabled {
  color: rgba(0, 0, 0, 0.7) !important;
}

.ant-table-footer {
  background: #fff  !important;
}

</style>
