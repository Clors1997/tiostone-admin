<template>
  <span>
    <a-modal title="Tool" v-model="visible" width="600px" :footer="null">
      <a-button class="tool-btn" @click="action('pdf')" type="primary" block>
        PDF View
      </a-button>
      <a-button v-if="record.status != '5' && record.status != '6' && record.is_po == 0" class="tool-btn" @click="action('new')" block>
        New Product Table
      </a-button>
    </a-modal>
  </span>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      record: {}
    };
  },
  created() {},
  methods: {
    showModal(record) {
      this.record = record;
      this.visible = true;
    },
    action(action_str){
      this.visible = false;
      this.$emit(action_str, this.record)
    }
  }
};
</script>
<style lang="scss">
.tool-btn{
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
