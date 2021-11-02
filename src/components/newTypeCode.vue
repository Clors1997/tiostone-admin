<template>
  <span>
    <a-modal :title="'New '+info.meta_name" @cancel="close" v-model="visible" width="600px" :footer="null">
      <div class="new-pmaster-modal">
        <a-row>
          <a-col>
            <p class="item">
              <span class="label">{{info.meta_name}}</span>
              <a-input v-model="info.meta_value"/>
            </p>
          </a-col>
        </a-row>
      </div>
      <br/>
      <p style="margin:0;text-align:right">
        <a-button type="default" @click="close">Cancel</a-button>
        <a-button type="primary" @click="onSure" :loading="loading">Confirm</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { c_product_meta } from "@/api/product_meta";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      info: {
        meta_name: "type",
        meta_value: "",
        created_by: 0,
      }
    };
  },
  created() {},
  methods: {
    showModal(type) {
      this.info.meta_name = type;
      this.visible = true;
    },
    close(){
      this.visible = false;
      this.info = {
        meta_name: "type",
        meta_value: "",
        created_by: 0
      };
    },
    onSure() {
      if(this.info.meta_value == ''){
        this.$message.info("Please input item")
        return false;
      }
      this.info.created_by = sessionStorage.user_id;

      this.loading = true;
      c_product_meta(this.info)
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
