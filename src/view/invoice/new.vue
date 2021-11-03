<template>
  <a-modal
    title="New P.O. Panel"
    @cancel="onClose"
    :visible="visible"
    width="1120px"
    :footer="null"
  >
    <div class="new-pmaster-modal">
      <a-divider orientation="left">
        P.O. info
      </a-divider>
          <p class="item item-helf">
            <span class="label required">Number</span>
            <a-input :maxLength="400" v-model="info.invoice_number"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label required">Client</span>
            <a-input readOnly @click="()=>{
              $refs.selectClientele.showModal('')
              }" :maxLength="255" v-model="info.name_en"></a-input>
          </p>
          <!-- </p> -->
          <p class="item item-helf">
            <span class="label required">Order Date</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.invoice_date" placeholder="select time"></a-date-picker>
          </p>
          <p class="item item-helf">
            <span class="label required">PO Number</span>
            <a-input :maxLength="400" v-model="info.invoice_no"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label">Project</span>
            <a-input :maxLength="510" v-model="info.invoice_project"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label">Delivery Address</span>
            <a-input :maxLength="510" v-model="info.invoice_site"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label">Site Contact Person</span>
            <a-input :maxLength="510" v-model="info.invoice_site_contact"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label">Status</span>
            <a-select v-model="info.invoice_status">
              <a-select-option v-for="(item, key) in status_array" :key="key" :value="item">
                {{item}}
              </a-select-option>
            </a-select>
          </p>
          <p class="item item-helf">
            <span class="label">Remark</span>
            <a-textarea :maxLength="2048" :rows="1" v-model="info.remark" />
          </p>
    </div>
    <div style="display:flex;justify-content: space-between;margin-bottom: 10px;">
      <span></span>
      <span>
        <a-button type="primary" @click="addItem">add item</a-button>
      </span>
    </div>
    <a-table
      size="small"
      :columns="itemColumns"
      :dataSource="itemInfoArr"
      bordered
      :pagination="false">
      <span slot="TitleQuantity">
        <span class="required">Quantity</span>
      </span>
      <!-- <span slot="MetreSquare">
        <span>Metre Square</span>
      </span> -->
      <span slot="size_pallet">
        <span class="required">Count/Pallet</span>
      </span>
      <span slot="TitleRate">
        <span class="required">Rate</span>
      </span>
      <span slot="TitleSize">
        <span class="required">Size</span>
          <a-button type="primary" icon="plus"  @click="() => {
            $refs.newSize.showModal()
          }"></a-button>
      </span>
      <span slot="TitleType">
          <span class="required">Type</span>
          <a-button type="primary" icon="plus"  @click="() => {
            $refs.newTypeCode.showModal('type')
          }"></a-button>
      </span>
      <span slot="TitleCode">
        <span class="required">Code</span>
        <a-button type="primary" icon="plus"  @click="() => {
          $refs.newTypeCode.showModal('code')
        }"></a-button>
      </span>
      <template slot="size" slot-scope="text, record, index, column">
        <span v-if="record.size != ''">
          {{record.size}}
          <a-icon type="redo" @click="() => {
            $refs.selectSize.showModal('', product.size, index)
          }" />
        </span>
        <a-button v-else type="dashed"  @click="() => {
          $refs.selectSize.showModal('', product.size, index)
        }">select</a-button>
      </template>
      <template slot="type" slot-scope="record">
        <a-select v-model="record.type" style="width:100%;">
          <a-select-option v-for="(item, key) in product.type" :key="key" :value="item.value">
            <a-tooltip placement="topLeft">
              <template slot="title">
                <span>{{item.value}}</span>
              </template>
              {{item.value}}
            </a-tooltip>
          </a-select-option>
        </a-select>
      </template>
      <template slot="code" slot-scope="record">
        <a-select v-model="record.code" style="width:100%;">
          <a-select-option v-for="(item, key) in product.code" :key="key" :value="item.value">
            <a-tooltip placement="topLeft">
              <template slot="title">
                <span>{{item.value}}</span>
              </template>
              {{item.value}}
            </a-tooltip>
          </a-select-option>
        </a-select>
      </template>
      <template slot="description" slot-scope="record">
        <a-input :maxLength="510" style="width:100%;" v-model="record.description"></a-input>
      </template>
      <template slot="quantity" slot-scope="record">
        <a-input-number style="width:100%;" :min="0" :max="1000000" :step="0.01" v-model="record.discount_quantity" />
      </template>
      <template slot="rate" slot-scope="record">
        <a-input-number style="width:100%;" :min="0" :max="1000000" :step="0.01" v-model="record.discount_rate" />
      </template>
      <template slot="remark" slot-scope="record">
        <a-textarea style="width:100%;" :maxLength="2048" :rows="1" v-model="record.remark" />
      </template>
      <template slot="action"  slot-scope="text, record, index, column">
        <a-icon type="delete" @click="deleteItem(index)"/>
      </template>
    </a-table>


      <!-- <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p> -->
    </div>
    <p style="text-align:right;margin-top: 20px;">
      <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
    </p>
    <newSize ref="newSize" @done="get_product_meta"></newSize>
    <newTypeCode ref="newTypeCode" @done="get_product_meta"></newTypeCode>
    <selectSize :selectType="'radio'" ref="selectSize" @done="onSelectSize" @update="updateMeta"></selectSize>
    <selectClientele :selectType="'radio'" ref="selectClientele" @done="onClienteleSelect"></selectClientele>
  </a-modal>
</template>
<script>
import moment from "moment";
import { isHasVal } from "@/utils/validate";
import { c_invoice_discount } from "@/api/invoice_discount.js";
import { r_product_meta } from "@/api/product_meta.js";
import { c_invoice } from "@/api/invoice.js";
import selectClientele from "@/components/selectClientele.vue";
import newSize from "@/components/newSize";
import newTypeCode from "@/components/newTypeCode";
import selectSize from "@/components/selectSize";
import {r_invoice_test } from "@/api/number.js";
import {c_invoice_test } from "@/api/number.js";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      status_array: [],
      product: {

      },
      info: {
        invoice_number:"",
        clientele_id: "",
        name_en: "",
        invoice_no: "",
        invoice_date: "",
        invoice_project: "",
        invoice_site: "",
        invoice_site_contact: "",
        invoice_status: "",
        remark: "",
        created_by: ""
      },
      itemColumns: [
        { slots: { title: 'TitleSize' }, width: 70, key:"size", scopedSlots: { customRender: "size" } },
        // { slots: { title: 'MetreSquare' }, width: 70, dataIndex: "size_square"  },
        { slots: { title: 'size_pallet' }, width: 80, dataIndex: "size_pallet"  },
        { slots: { title: 'TitleType' }, width: 70, key:"type", scopedSlots: { customRender: "type" } },
        { slots: { title: 'TitleCode' }, width: 70, key:"code", scopedSlots: { customRender: "code" } },
        { title: "Description", "customHeaderCell": (column) => {
          return {
            on: {
              mouseenter: () => {
                console.log(column)
              },        // 点击表头行
            }
          };
        },width: 120, key:"description", scopedSlots: { customRender: "description" } },
        { slots: { title: 'TitleQuantity' }, width: 70, key:"quantity", scopedSlots: { customRender: "quantity" } },
        { slots: { title: 'TitleRate' }, width: 70, key:"rate", scopedSlots: { customRender: "rate" } },
        { title: "Remark", width: 140, key:"remark", scopedSlots: { customRender: "remark" } },
        { width: 20, key:"action", scopedSlots: { customRender: "action" } },
      ],
      itemInfoArr: [],
      submit_num: 0
    };
  },
  components: { selectClientele, newSize, newTypeCode, selectSize },
  created(){

  },
  methods: {
    show(status_array) {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      r_invoice_test().then(res=>{
      this.info.invoice_number=res.maxnum;
      this.visible = true;
      this.onSubmiting = false;
      console.log(res);
      })
      .catch(err => {
        console.log(err.message)
        this.onTableLoading = false;  
        this.$message.error("fail - system error");
        });
      this.info.invoice_date = null;
      this.status_array = status_array;
      this.info.invoice_status = this.status_array[0];
      this.get_product_meta();
      console.log(this.info);
    },
    onClose() {
      this.itemInfoArr = [];
      this.submit_num = 0;
      this.info = {
        invoice_number:"",
        clientele_id: "",
        name_en: "",
        invoice_no: "",
        invoice_date: "",
        invoice_project: "",
        invoice_site: "",
        invoice_site_contact: "",
        invoice_status: "",
        remark: "",
        created_by: ""
      };
      this.visible = false;
    },
    get_product_meta(){
      r_product_meta()
        .then(res => {
          this.product = res.data;
        })
        .catch(err => {

        })
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
    addItem(){
      this.itemInfoArr.push({
        invoice_id: 0,
        size: "",
        type: "",
        code: "",
        size_square: "",
        size_pallet: "",
        discount_quantity: 0,
        discount_rate: 0,
        remark: "",
        description: "",
        created_by: sessionStorage.user_id,
      })
    },
    deleteItem(key) {
      this.itemInfoArr.splice(key, 1)
    },
    onSelectSize(e) {
      if(e.selectedRowKeys.length != 0){
        this.itemInfoArr[e.id].size = e.list[e.selectedRowKeys[0]].value;
        this.itemInfoArr[e.id].size_square = e.list[e.selectedRowKeys[0]].size_square;
        this.itemInfoArr[e.id].size_pallet = e.list[e.selectedRowKeys[0]].size_pallet;
      }
    },
    onClienteleSelect(e) {
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        this.info.clientele_id = e.selectedRowKeys[0]+"";
        console.log(e.list[e.selectedRowKeys[0]]);
        this.info.name_en = e.list[e.selectedRowKeys[0]].name_en;
      }
    },
    handle_submit_data(sumbmit_info) {
      //submit info data handling
      if (sumbmit_info.invoice_date != null) {
        sumbmit_info.invoice_date = sumbmit_info.invoice_date._isValid
          ? sumbmit_info.invoice_date.format("YYYY-MM-DD")
          : "";
      } else {
        submit_info.invoice_date = "0000-00-00";
      }

      sumbmit_info.created_by = sessionStorage.user_id;
      return sumbmit_info;
    },
    submit_validation() {
      //check mandatory
      if(this.info.invoice_date == null){
        this.$message.error("Please check the required information");
        return false;
      }

      var mandatory_property = [
        "clientele_id"
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

      //Item
      for(let key in this.itemInfoArr){
        let value = this.itemInfoArr[key]

        if(value.discount_quantity == 0 || value.discount_rate == 0){
          this.$message.error("請檢查必須填寫的資料");
          return false;
        }

        var mandatory_property = [
          "size",
          "type",
          "code",
        ];
        for (let i = 0; i < mandatory_property.length; i++) {
          if (value.hasOwnProperty(mandatory_property[i])) {
            if (!isHasVal(value[mandatory_property[i]])) {
              this.$message.error("請檢查必須填寫的資料");
              return false;
            }
          } else {
            this.$message.error("mandatory status wrong");
            return false;
          }
        }
      }
      for(let key in this.itemInfoArr){
        this.itemInfoArr[key].discount_quantity = this.itemInfoArr[key].discount_quantity + "";
        this.itemInfoArr[key].discount_rate = this.itemInfoArr[key].discount_rate + "";
      }

      return this.onSubmit();
    },
    submitMethod(){
      this.submit_num++;
      if(this.submit_num == this.itemInfoArr.length){
        this.itemInfoArr = [];
        this.submit_num = 0;
        this.info = {
          invoice_number:"",
          clientele_id: "",
          name_en: "",
          invoice_no: "",
          invoice_date: "",
          invoice_project: "",
          invoice_site: "",
          invoice_site_contact: "",
          invoice_status: "",
          remark: "",
          created_by: ""
        };
        this.$message.success("成功添加");
        this.visible = false;
        this.onSubmiting = false;
        this.$emit("done", {});
      }
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      console.log(this.submit_info);
      c_invoice_test(this.handle_submit_data(this.submit_info))
        .then(res => {
          console.log(res);
          if (res.status) {
            if(this.itemInfoArr.length == 0) {
              this.$message.success("success");
              this.visible = false;
              this.onSubmiting = false;
              this.$emit("done", {});
            }else {
              for(let key in this.itemInfoArr){
                this.itemInfoArr[key].invoice_id = res.new_id;
                c_invoice_discount(this.itemInfoArr[key])
                  .then(res => {
                    if (res.status) {
                      this.submitMethod();
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
<style lang="scss" scoped>
.new-pmaster-modal {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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
  .item-full {
    width: 100%;
  }
  .item-helf {
    width: 48%;
  }
  .item-33 {
    width: 32%;
  }
  .item-15 {
    width: 15%;
  }
  .ant-select {
    width: 100%;
  }
}
</style>
