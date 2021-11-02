<template>
  <a-drawer
    title="New panel"
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
            <span class="label required">Select from P.O.</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectDiscount.showModal('', invoice_id)
              }"
            >Select</a-button>
          </p>
          <p class="item" v-if="info.discount_id != ''">
            <span class="label">Size</span>
            <a-input read-only :maxLength="255" v-model="info.size"></a-input>
          </p>
          <p class="item" v-if="info.discount_id != ''">
            <span class="label">Type</span>
            <a-input read-only :maxLength="255" v-model="info.type"></a-input>
          </p>
          <p class="item" v-if="info.discount_id != ''">
            <span class="label">Code</span>
            <a-input read-only :maxLength="255" v-model="info.code"></a-input>
          </p>
<!--          <p class="item" v-if="info.product_id != ''">
            <span class="label">貨物尺寸mm</span>
            <a-input read-only :maxLength="255" v-model="info.product_size"></a-input>
          </p> -->
          <a-divider />
          <p class="item">
            <span class="label required">Number of Pallet</span>
            <a-input-number style="width: 400px;" :min="0" :max="10000" v-model="info.plate_number" />
          </p>
          <p class="item">
            <span class="label required">Quantity m² <br/> (max {{info.can_send}})</span>
            <a-input-number style="width: 400px;" :min="0" :max="info.can_send" :step="0.01" v-model="info.quantity" @change="changeQuantity(index)"/>
          </p>
        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
      <selectDiscount :selectType="'radio'" ref="selectDiscount" @done="onProductSelect"></selectDiscount>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import { isHasVal } from "@/utils/validate";
import { c_delivery_note_product } from "@/api/delivery_note_product.js";
import selectDiscount from "@/components/selectDiscount.vue";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        note_id: "",
        discount_id: "",
        size: "",
        type: "",
        code: "",
        can_send: 0,
        plate_number: "",
        quantity: "",
        created_by: ""
      },
      invoice_id: 0
    };
  },
  components: { selectDiscount },
  created() {},
  methods: {
    show(note_id, invoice_id) {
      console.log(note_id, invoice_id)
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }

      this.info.note_id = note_id;
      this.invoice_id = invoice_id;
      this.info.can_send = 0;
      this.info.plate_number = 0;

      this.visible = true;
      this.onSubmiting = false;
      console.log(this.info);
    },
    onClose() {
      this.visible = false;
    },
    onProductSelect(e) {
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        this.info.discount_id = e.selectedRowKeys[0]+"";
        this.info.size = e.list[e.selectedRowKeys[0]].size;
        this.info.type = e.list[e.selectedRowKeys[0]].type;
        this.info.code = e.list[e.selectedRowKeys[0]].code;
        this.info.can_send = e.list[e.selectedRowKeys[0]].can_send;
        this.info.size_pallet = e.list[e.selectedRowKeys[0]].size_pallet;
        this.changeQuantity(this.temp_key)

        console.log(this.info.can_send)
      }
    },
    changeQuantity(key) {
      console.log(key)
      if(this.info.quantity && this.info.size_pallet != 0) {
        this.info.plate_number = Math.ceil(this.info.quantity / this.info.size_pallet)
      }
    },
    handle_submit_data(sumbmit_info) {
      //submit info data handling
      sumbmit_info.created_by = sessionStorage.user_id;
      return sumbmit_info;
    },
    submit_validation() {
      this.info.plate_number = this.info.plate_number+"";
      if(this.info.quantity == 0) {
        this.$message.error("Item quantity is empty!");
        return false;
      }
      this.info.quantity = this.info.quantity+"";
      //check mandatory
      var mandatory_property = [
        "note_id",
        "discount_id",
        "plate_number",
        "quantity"
      ];
      for (let i = 0; i < mandatory_property.length; i++) {
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (!isHasVal(this.info[mandatory_property[i]])) {
            this.$message.error("Please check the required information");
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
      c_delivery_note_product(this.handle_submit_data(this.submit_info))
        .then(res => {
          console.log(res);
          if (res.status) {
            this.$message.success("success");
            this.visible = false;
            this.onSubmiting = false;
            this.$emit("done", {});
          } else {
            this.onSubmiting = false;
            this.$message.error("fail - "+res.msg);
          }
        })
        .catch(err => {
          this.onSubmiting = false;
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
</style>
