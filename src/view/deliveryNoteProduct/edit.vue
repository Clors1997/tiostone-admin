<template>
  <a-drawer
    title="Edit Panel"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
    width="600px"
  >
  <!-- 不使用 -->
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item">
            <span class="label required">Select from P.O.</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectProduct.showModal('')
              }"
            >Select</a-button>
          </p>
          <p class="item" v-if="info.discount_id != ''">
            <span class="label">size</span>
            <a-input read-only :maxLength="255" v-model="info.size"></a-input>
          </p>
          <p class="item" v-if="info.discount_id != ''">
            <span class="label">type</span>
            <a-input read-only :maxLength="255" v-model="info.type"></a-input>
          </p>
          <p class="item" v-if="info.discount_id != ''">
            <span class="label">code</span>
            <a-input read-only :maxLength="255" v-model="info.code"></a-input>
          </p>
<!--          <p class="item" v-if="info.product_id != ''">
            <span class="label">貨物尺寸mm</span>
            <a-input read-only :maxLength="255" v-model="info.product_size"></a-input>
          </p> -->
          <a-divider />
<!--          <p class="item">
            <span class="label required">plate number</span>
            <a-input-number style="width: 400px;" :min="0" :max="10000" v-model="info.plate_number" />
          </p> -->
          <p class="item">
            <span class="label required">quantity m²</span>
            <a-input-number style="width: 400px;" :min="0" :max="10000" :step="0.01" v-model="info.quantity" />
          </p>
        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
      <selectProduct :selectType="'radio'" ref="selectProduct" @done="onProductSelect"></selectProduct>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import { isHasVal } from "@/utils/validate";
import { u_delivery_note_product } from "@/api/delivery_note_product.js";
import selectProduct from "@/components/selectProduct.vue";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        note_id: "",
        product_id: "",
        product_name: "",
        plate_number: "",
        quantity: "",
        created_by: ""
      },
    };
  },
  components: { selectProduct },
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
    onProductSelect(e) {
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        this.info.product_id = e.selectedRowKeys[0]+"";
        this.info.product_name = e.list[e.selectedRowKeys[0]].product_name;
        // this.info.product_size = e.list[e.selectedRowKeys[0]].product_size;
        this.info.can_send = e.list[e.selectedRowKeys[0]].can_send;
      }
    },
    handle_submit_data(sumbmit_info) {
      //submit info data handling

      return sumbmit_info;
    },
    submit_validation() {
      this.info.quantity = this.info.quantity+"";
      //check mandatory
      var mandatory_property = [
        "note_id",
        "product_id",
        "quantity"
      ];
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
      u_delivery_note_product(this.handle_submit_data(this.submit_info))
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
