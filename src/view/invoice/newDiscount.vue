<template>
  <a-drawer
    title="New Item Table"
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
            <span class="label">Description</span>
            <a-input :maxLength="510" v-model="info.description"></a-input>
          </p>
          <p class="item">
            <span class="label"></span>
            <span>
              <a-button type="primary" style="width: 100px" @click="() => {
                this.$refs.newSize.showModal()
              }">+ size</a-button>
              <a-button type="dashed"  @click="() => {
                $refs.selectSize.showModal('', product.size, 0)
              }">select</a-button>
            </span>
          </p>
          <p class="item">
            <span class="label required">size</span>
            <a-input disabled :maxLength="250" v-model="info.size"></a-input>
          </p>
          <p class="item">
            <span class="label required">square</span>
            <a-input disabled :maxLength="250" v-model="info.size_square"></a-input>
          </p>
          <p class="item">
            <span class="label required">Count/pallet</span>
            <a-input disabled :maxLength="250" v-model="info.size_pallet"></a-input>
          </p>
          <p class="item">
            <span class="label required">type</span>
            <a-select v-model="info.type" style="width: 300px" >
              <a-select-option v-for="(item, key) in product.type" :key="key" :value="item.value">
                {{item.value}}
              </a-select-option>
            </a-select>
            <a-button type="primary" style="width: 100px" @click="() => {
              this.$refs.newTypeCode.showModal('type')
            }">+ type</a-button>
          </p>

          <p class="item">
            <span class="label required">code</span>
            <a-select v-model="info.code" style="width: 300px" >
              <a-select-option v-for="(item, key) in product.code" :key="key" :value="item.value">
                {{item.value}}
              </a-select-option>
            </a-select>
            <a-button type="primary" style="width: 100px" @click="() => {
              this.$refs.newTypeCode.showModal('code')
            }">+ code</a-button>
          </p>

          <a-divider />
          <p class="item">
            <span class="label required">Quantity</span>
            <a-input-number style="width: 400px;" :min="0" :max="1000000" :step="0.01" v-model="info.discount_quantity" />
          </p>
          <p class="item">
            <span class="label required">Rate</span>
            <a-input-number style="width: 400px;" :min="0" :max="1000000" :step="0.01" v-model="info.discount_rate" />
          </p>
          <p class="item">
            <span class="label">Remark</span>
            <a-textarea :maxLength="2048" :rows="5" v-model="info.remark" />
          </p>

        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>

      <newSize ref="newSize" @done="get_product_meta"></newSize>
      <newTypeCode ref="newTypeCode" @done="get_product_meta"></newTypeCode>
      <selectSize :selectType="'radio'" ref="selectSize" @done="onSelectSize" @update="updateMeta"></selectSize>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import { isHasVal } from "@/utils/validate";
import { c_invoice_discount } from "@/api/invoice_discount.js";
import { r_product_meta } from "@/api/product_meta.js";
import newSize from "@/components/newSize";
import newTypeCode from "@/components/newTypeCode";
import selectSize from "@/components/selectSize";

export default {
  components: { newSize, newTypeCode, selectSize },
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      product: {

      },
      info: {
        invoice_id: "",
        size: "",
        type: "",
        code: "",
        discount_quantity: "",
        discount_rate: "",
        remark: "",
        description: "",
        size_square: "",
        size_pallet: "",
        created_by: "",
      },
    };
  },
  created() {},
  methods: {
    show(invoice_id) {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.invoice_id = invoice_id;
      this.info.discount_rate = 0;
      this.info.discount_quantity = 0;

      this.get_product_meta();

      this.visible = true;
      this.onSubmiting = false;
      console.log(this.info);
    },
    updateMeta() {
      r_product_meta()
        .then(res => {
          this.product = res.data;
          this.$refs.selectSize.showModal('', this.product.size, 0)
        })
        .catch(err => {
        })
    },
    onClose() {
      this.visible = false;
    },
    onSelectSize(e) {
      if(e.selectedRowKeys.length != 0){
        this.info.size = e.list[e.selectedRowKeys[0]].value;
        this.info.size_square = e.list[e.selectedRowKeys[0]].size_square;
        this.info.size_pallet = e.list[e.selectedRowKeys[0]].size_pallet;
      }
    },
    get_product_meta(){
      r_product_meta()
        .then(res => {
          this.product = res.data;
        })
        .catch(err => {

        })
    },

    // accMul(arg1,arg2) {
    //   var m=0,s1=arg1.toString(),s2=arg2.toString();
    //   try{m+=s1.split(".")[1].length}catch(e){}
    //   try{m+=s2.split(".")[1].length}catch(e){}
    //   return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
    // },
    // calTotal(){
    //   let discount_quantity = parseFloat(this.info.discount_quantity);
    //   let unit_price_unit = parseFloat(this.info.unit_price_unit);
    //   let number = parseFloat(this.info.number);
    //   let discount_rate = parseFloat(this.info.discount_rate);
    //   if(number != '' && unit_price_unit != '' && this.accMul(number, unit_price_unit) > 0){
    //     if(this.accMul(number, unit_price_unit)>parseFloat(this.info.product_repertory)){
    //       this.$message.error("總量超出庫存大小！");
    //       this.info.discount_quantity = 0;
    //       this.info.discount_total = 0;
    //     }else{
    //       console.log(111);
    //       this.info.discount_quantity = this.accMul(number, unit_price_unit);

    //       if(number != '' && discount_rate != '' && this.accMul(number, discount_rate) > 0){
    //         this.info.discount_total = this.accMul(number, discount_rate);
    //       }else{
    //         this.info.discount_total = 0;
    //       }
    //     }
    //   }else{
    //     this.info.discount_quantity = 0;
    //   }
    // },
    handle_submit_data(sumbmit_info) {
      //submit info data handling

      sumbmit_info.created_by = sessionStorage.user_id;
      return sumbmit_info;
    },
    submit_validation() {
      //check mandatory
      this.info.discount_quantity = this.info.discount_quantity + "";
      this.info.discount_rate = this.info.discount_rate + "";

      if(this.info.discount_quantity == "0" || this.info.discount_rate == "0"){
        this.$message.error("請檢查必須填寫的資料");
        return false;
      }

      var mandatory_property = [
        "size",
        "type",
        "code",
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
      c_invoice_discount(this.handle_submit_data(this.submit_info))
        .then(res => {
          console.log(res);
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.onSubmiting = false;
            this.$emit("done", this.info.invoice_id);
          } else {
            this.onSubmiting = false;
            this.$message.error("添加失敗 - "+res.msg);
          }
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("添加失敗 - system error");
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
