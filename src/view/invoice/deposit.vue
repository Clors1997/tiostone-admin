<template>
  <span>
    <a-modal :title="flag?'Issue Deposit':'See Deposit'" @cancel="close" v-model="visible" width="600px" :footer="null">
      <div class="new-pmaster-modal">
        <a-row>
          <a-col>
            <p class="item">
              <span>
                Deposit : <a-input-number
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/(,*)/g, '')"
                :disabled="!flag" size="large" style="width: 300px" :min="0" :precision="2" :step="0.01" :max="100000000" v-model="info.deposit"/>
              </span>
            </p>
          </a-col>
        </a-row>
      </div>
      <br/>
      <p style="margin:0;text-align:right" v-if="flag">
        <a-button type="default" @click="close">Cancel</a-button>
        <a-popconfirm
          :disabled="loading"
          title="Please check deposit agant(Only be defined once)!"
          okText="yes"
          cancelText="no"
          @confirm="onSure"
        >
          <a-button type="primary" :loading="loading">Confirm</a-button>
        </a-popconfirm>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { u_deposit } from "@/api/invoice";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      info: {
        id: 0,
        deposit: 0
      },
      flag: false
    };
  },
  created() {},
  methods: {
    showModal(record, flag) {
      this.flag = flag;
      this.info.id = record.id;
      this.info.deposit = record.deposit;
      this.visible = true;
    },
    close(){
      this.visible = false;
      this.info = {
        id: 0,
        deposit: 0
      };
    },
    onSure() {
      if(this.info.deposit == 0){
        this.$message.info("Deposit info is not be empty")
        return false;
      }

      this.loading = true;
      u_deposit(this.info)
        .then(res => {
          console.log(res);
          if (res.status) {
            this.$message.success("success");
            this.loading = false;
            this.$emit("done");
            this.close();
          } else {
            this.loading = false;
            this.$message.error("fail - "+res.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("fail - system error");
        });
    }
  }
};
</script>
<style lang="scss">
.new-pmaster-modal {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      min-width: 160px;
    }
    .ant-calendar-picker {
      width: 100%;
    }
  }
  .ant-select {
    width: 100%;
  }
}

.type-X{
  font-size: 20px;
}
</style>
