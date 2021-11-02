<template>
  <span>
    <a-modal title="New Size" @cancel="close" v-model="visible" width="600px" :footer="null">
      <div class="new-pmaster-modal">
        <a-row>
          <a-col>
            <p class="item require">
              <span>
                L : <a-input-number size="large" :min="0" :precision="2" :step="0.01" :max="10000" v-model="info.size_x"/>
                W : <a-input-number size="large" :min="0" :precision="2" :step="0.01" :max="10000" v-model="info.size_y"/>
                H : <a-input-number size="large" :min="0" :precision="2" :step="0.01" :max="10000" v-model="info.size_z"/>
              </span>
              <br/>

            </p>
            <p class="item require">
              <span>
                Count per pallet: <a-input-number style="width:245px;" size="large" :min="0" :precision="2" :step="0.01" :max="10000" v-model="info.size_pallet"/>
              </span>
            </p>
            <p class="item">
              <span>
                Metre Square (Count per m2): <a-input-number style="width:245px;" size="large" :min="0" :precision="2" :step="0.01" :max="10000" v-model="info.size_square"/>
              </span>
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
        meta_name: "size",
        meta_value: "",
        created_by: 0,
        size_x: 0,
        size_y: 0,
        size_z: 0,
        size_square: 0,
        size_pallet: 0
      }
    };
  },
  created() {},
  methods: {
    showModal() {
      this.visible = true;
    },
    close(){
      this.visible = false;
      this.info = {
        meta_name: "size",
        meta_value: "",
        created_by: 0,
        size_x: 0,
        size_y: 0,
        size_z: 0,
        size_square: 0,
        size_pallet: 0
      };
    },
    onSure() {
      if(this.info.size_x == 0 || this.info.size_y == 0 || this.info.size_z == 0 || this.info.size_pallet == 0){
        this.$message.info("All info is not be empty")
        return false;
      }

      this.info.meta_value = this.info.size_x+","+this.info.size_y+","+this.info.size_z;
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
