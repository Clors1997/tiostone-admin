<template>
  <a-drawer
    title="修改產品"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
    width="600px"
  >
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item">
            <span class="label">產品編號</span>
            <a-input :maxLength="120" v-model="info.product_no"></a-input>
          </p>
          <p class="item">
            <span class="label required">產品名稱</span>
            <a-input :maxLength="500" v-model="info.product_name"></a-input>
          </p>
          <p class="item">
            <span class="label">產品尺寸(長mm)</span>
            <a-input-number style="width: 400px;" :min="0" :max="10000" :step="0.01" v-model="info.product_size_long" />
          </p>
          <p class="item">
            <span class="label">產品尺寸(寬mm)</span>
            <a-input-number style="width: 400px;" :min="0" :max="10000" :step="0.01" v-model="info.product_size_width" />
          </p>
          <p class="item">
            <span class="label">產品尺寸(高mm)</span>
            <a-input-number style="width: 400px;" :min="0" :max="10000" :step="0.01" v-model="info.product_size_height" />
          </p>
          <p class="item">
            <span class="label required">產品庫存(m²)</span>
            <a-input-number style="width: 400px;" :min="0" :max="100000000" :step="0.0001" v-model="info.product_repertory" />
          </p>
          <p class="item">
            <span class="label required">產品單位大小(m²)</span>
            <a-input-number style="width: 400px;" :min="0" :max="100000000" :step="0.0001" v-model="info.unit_price_unit" />
          </p>
          <p class="item">
            <span class="label required">產品單價(HKD $)</span>
            <a-input-number style="width: 400px;" :min="0" :max="1000000" :step="0.01" v-model="info.unit_price" />
          </p>
         <!-- <p class="item">
            <span class="label">產品單位</span>
            <a-input :maxLength="60" v-model="info.product_unit"></a-input>
          </p> -->
          <p class="item">
            <span class="label">顏色</span>
            <a-input :maxLength="250" v-model="info.color"></a-input>
          </p>
          <p class="item">
            <span class="label">底部含有粉色</span>
            <a-select v-model="info.is_pink">
              <a-select-option value="1">是</a-select-option>
              <a-select-option value="0">否</a-select-option>
            </a-select>
          </p>
        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
    </div>
  </a-drawer>
</template>
<script>
import { isHasVal } from "@/utils/validate";
import { u_product } from "@/api/product.js";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        product_name: "",
        product_size_long: 0,
        product_size_width: 0,
        product_size_height: 0,
        product_repertory: 0,
        unit_price: '',
        product_unit: 0,
        unit_price_unit: 0,
        color: "",
        is_pink: "1",
        plate_number: "",
        quantity: 0,
        created_by: ""
      },
    };
  },
  created() {},
  methods: {
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));

      this.visible = true;
      this.onSubmiting = false;
      console.log(this.info);
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(sumbmit_info) {
      //submit info data handling

      return sumbmit_info;
    },
    submit_validation() {
      if(this.info.product_repertory == 0 || this.info.unit_price == 0 || this.info.unit_price_unit == 0){
        this.$message.error("請檢查必須填寫的資料");
        return false;
      }

      //check mandatory
      var mandatory_property = ["product_name"];
      for (let i = 0; i < mandatory_property.length; i++) {
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (!isHasVal(this.info[mandatory_property[i]])) {
            this.$message.error("請檢查必須填寫的資料");
            return false;
          }
        } else {
          this.$message.error("mandatory status wrong");
          return false;
        }
      }
      return this.onSubmit();
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      u_product(this.handle_submit_data(this.submit_info))
        .then(res => {
          console.log(res);
          if (res.status) {
            this.$message.success("更新成功");
            this.visible = false;
            this.onSubmiting = false;
            this.$emit("done", {});
          } else {
            this.onSubmiting = false;
            this.$message.error("更新失敗 - "+res.msg);
          }
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("更新失敗 - system error");
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
</style>
