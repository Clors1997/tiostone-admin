<template>
  <div v-if="errorLogs.length>0">
    <a-badge :count="errorLogsCount" :offset="[5,0]" @click="()=>dialogTableVisible=true">
      <a-icon style="font-size:25px;" type="exception" />
    </a-badge>

    <a-modal @ok="()=>dialogTableVisible=false" v-model="dialogTableVisible" width="90%">
      <div slot="title">
        <span style="padding-right: 10px;">Error Log</span>
        <a-button type="primary" icon="delete" @click="clearAll">Clear All</a-button>
      </div>
      <a-table :columns="columns" :dataSource="errorLogs" bordered>
        <template slot="message" slot-scope="row">
          <div>
            <span class="message-title">Msg:</span>
            <a-tag type="danger">{{ row.err.message }}</a-tag>
          </div>
          <br />
          <div>
            <span class="message-title" style="padding-right: 10px;">Info:</span>
            <a-tag type="normal">{{ row.vm.$vnode.tag }} error in {{ row.info }}</a-tag>
          </div>
          <br />
          <div>
            <span class="message-title" style="padding-right: 16px;">Url:</span>
            <a-tag type="primary">{{ row.url }}</a-tag>
          </div>
        </template>
        <template slot="stack" slot-scope="row">{{row.err.stack }}</template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  { title: "訊息", scopedSlots: { customRender: "message" } },
  { title: "詳情", scopedSlots: { customRender: "stack" } }
];
export default {
  name: "ErrorLog",
  data() {
    return {
      columns,
      errorLogsCount: 0,
      dialogTableVisible: false
    };
  },
  computed: {
    errorLogs() {
      this.errorLogsCount = this.$store.getters.errorLogs.length;
      return this.$store.getters.errorLogs;
    }
  },
  methods: { changeSubmit(flag){ this.onSubmiting = flag; },
    clearAll() {
      this.dialogTableVisible = false;
      this.$store.dispatch("errorLog/clearErrorLog");
    }
  }
};
</script>

<style scoped>
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
</style>