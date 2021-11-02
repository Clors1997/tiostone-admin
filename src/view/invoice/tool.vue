<template>
  <span>
    <a-modal title="Tool" v-model="visible" width="600px" :footer="null">
      <a-button v-if="record.deposit != 0" class="tool-btn" @click="action('seedeposit')" block>
        Deposit
      </a-button>
      <a-button v-else class="tool-btn" @click="action('deposit')" block>
        Issue Deposit
      </a-button>
      <a-button class="tool-btn" @click="action('pdf')" type="primary" block>
        Issue Invoice
      </a-button>
      <a-button class="tool-btn" @click="action('invoice')" block>
        Relate Invoice
      </a-button>
      <a-button class="tool-btn" @click="action('relate')" type="primary" block>
        Relate Note
      </a-button>
      <a-button class="tool-btn" @click="action('new')" block>
        New Item Table
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
      console.log(record.deposit)
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
