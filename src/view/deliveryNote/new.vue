<template>
  <a-modal
    title="New Delivery Panel"
    @cancel="onClose"
    :visible="visible"
    width="1000px"
    :footer="null"
  >
    <div class="new-pmaster-modal">
      <a-divider orientation="left">
        Delivery info
      </a-divider>
          <p class="item item-full">
            <span class="label required">Select From P.O.</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $message.info('After select other P.O.,will reset all product item')
              $refs.selectInvoice.showModal('')
              }"
            >Select</a-button>
          </p>
          <p class="item item-helf">
            <span class="label">Client</span>
            <a-input disabled :maxLength="255" v-model="info.name_en"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label">P.O. No</span>
            <a-input disabled :maxLength="255" v-model="info.invoice_no"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label">Address</span>
            <a-input disabled :maxLength="512" v-model="info.address"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label">Return Pallet Number</span>
            <a-input-number :min="0" :max="10000" v-model="info.back_num" />
          </p>
          <p class="item item-helf">
            <span class="label required">Delivery Date</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.note_date" placeholder="select time"></a-date-picker>
          </p>
          <p class="item item-helf">
            <span class="label required">Plate no</span>
            <span style="width: 300px;display:flex;align-items:center">
              <a-checkbox style="width: 200px;" :checked="info.is_self == '1'" @change="info.is_self = info.is_self == '1'?'0':'1'">
                Self delivery
              </a-checkbox>
              <a-input v-if="info.is_self == '1'" :maxLength="16" v-model="info.note_plate_no" />
              <a-select
                v-else
                show-search
                v-model="info.note_plate_no"
                placeholder="Select/Search"
                option-filter-prop="children"
                :filter-option="filterOption"
              >
                <a-select-option v-for="(item, key) in plate_no" :key="item.id" :value="item.plate_no">
                  {{item.plate_no}}
                </a-select-option>
              </a-select>
            </span>
          </p>
          <p class="item item-helf">
            <span class="label">Remark</span>
            <a-input :maxLength="300" v-model="info.remark"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label">Upload Delivery</span>
            <uploadFile style="text-align:left;width:295px" @changeSubmit="changeSubmit" ref="file" v-model="info.tio_file"></uploadFile>
          </p>

      <!-- <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p> -->
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
        <span class="required">Quantity(m²)</span>
      </span>
      <span slot="TitlePlateNumber">
        <span class="required">Number of Pallet</span>
      </span>
      <span slot="TitleSize">
        <span class="required">Size</span>
      </span>
      <span slot="TitleType">
          <span class="required">Type</span>
      </span>
      <span slot="TitleCode">
        <span class="required">Code</span>
      </span>
      <template slot="size" slot-scope="text, record, index, column">
        <span v-if="record.size != ''">
          {{record.size}}
          <a-icon type="redo" @click="() => {
            temp_key = index
            $refs.selectDiscount.showModal('', info.invoice_id)
          }" />
        </span>
        <a-button v-else type="dashed"  @click="() => {
          temp_key = index
          $refs.selectDiscount.showModal('', info.invoice_id)
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
      <template slot="quantity" slot-scope="text, record, index, column">
        <a-tooltip placement="topLeft">
          <template slot="title">
            <span>max: {{record.can_send}}</span>
          </template>
          <a-input-number style="width:100%;" :min="0" :max="record.can_send" :step="0.01" v-model="record.quantity" @change="changeQuantity(index)" />
        </a-tooltip>
      </template>
      <template slot="plateNumber" slot-scope="record">
        {{ record.plate_number }}
      </template>
      <template slot="action"  slot-scope="text, record, index, column">
        <a-icon type="delete" @click="deleteItem(index)"/>
      </template>
    </a-table>

    <p style="text-align:right;margin-top:20px;">
      <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
    </p>
    <selectDiscount :selectType="'radio'" ref="selectDiscount" @done="onProductSelect"></selectDiscount>
    <selectInvoice :selectType="'radio'" ref="selectInvoice" @done="onClienteleSelect"></selectInvoice>
  </a-modal>
</template>
<script>
import moment from "moment";
import { isHasVal } from "@/utils/validate";
import uploadFile from "@/components/uploadFile.vue";
import { c_delivery_note } from "@/api/delivery_note.js";
import { r_plate_no } from "@/api/plate.js";
import { c_delivery_note_product } from "@/api/delivery_note_product.js";
import selectInvoice from "@/components/selectInvoice.vue";
import selectDiscount from "@/components/selectDiscount.vue";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        invoice_id: "",
        invoice_no: "",
        name_en: "",
        note_contact: "",
        note_contact_tel: "",
        note_date: "",
        note_address: "",
        note_plate_no: "",
        is_self: '0',
        back_num: 0,
        remark: "",
        created_by: "",
        tio_file: []
      },
      itemColumns: [
        { slots: { title: 'TitleSize' }, width: 70, key:"size", scopedSlots: { customRender: "size" } },
        { slots: { title: 'TitleType' }, width: 70, key:"type", dataIndex: "type" },
        { slots: { title: 'TitleCode' }, width: 70, key:"code", dataIndex: "code" },
        { slots: { title: 'TitlePlateNumber' }, width: 70, key:"plateNumber", scopedSlots: { customRender: "plateNumber" } },
        { slots: { title: 'TitleQuantity' }, width: 70, key:"quantity", scopedSlots: { customRender: "quantity" } },
        { width: 20, key:"action", scopedSlots: { customRender: "action" } },
      ],
      itemInfoArr: [],
      submit_num: 0,
      invoice_id: 0,
      temp_key: -1,
      plate_no: []
    };
  },
  components: { selectInvoice, selectDiscount, uploadFile },
  created() {},
  methods: {
    changeSubmit(flag){ this.onSubmiting = flag; },
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.note_date = null;
      this.info.tio_file = [];
      this.info.plate_number_group = [];


      r_plate_no(1, 50000)
        .then(res => {
          console.log(res);
          if (res.rc == 0) {
            this.plate_no = res.data
            this.visible = true;
            this.onSubmiting = false;
          }  
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("fail - system error");
        });
    },
    onClose() {
      this.itemInfoArr = [];
      this.submit_num = 0;
      this.info = {
        invoice_id: "",
        invoice_no: "",
        name_en: "",
        note_contact: "",
        note_contact_tel: "",
        note_date: "",
        note_address: "",
        note_plate_no: "",
        is_self: '0',
        back_num: 0,
        remark: "",
        created_by: "",
        tio_file: [],
        plate_number_group: []
      };
      this.visible = false;
    },
    addItem(){
      if(this.info.invoice_id == 0){
        this.$message.info("Please select P.O.");
      }else{
        this.itemInfoArr.push({
          note_id: "",
          discount_id: "",
          size: "",
          type: "",
          code: "",
          can_send: 0,
          plate_number: 0,
          quantity: "",
          created_by: ""
        })
      }
    },
    deleteItem(key) {
      this.itemInfoArr.splice(key, 1)
    },
    onProductSelect(e) {
      console.log(this.temp_key)
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        for(let key in this.itemInfoArr){
          if(this.itemInfoArr[key].discount_id == e.selectedRowKeys[0]){
            this.$message.info('This product had selected')
            return false;
          }
        }

        this.itemInfoArr[this.temp_key].discount_id = e.selectedRowKeys[0]+"";
        this.itemInfoArr[this.temp_key].size = e.list[e.selectedRowKeys[0]].size;
        this.itemInfoArr[this.temp_key].type = e.list[e.selectedRowKeys[0]].type;
        this.itemInfoArr[this.temp_key].code = e.list[e.selectedRowKeys[0]].code;
        this.itemInfoArr[this.temp_key].can_send = e.list[e.selectedRowKeys[0]].can_send;
        this.itemInfoArr[this.temp_key].size_square = e.list[e.selectedRowKeys[0]].size_square;
        this.itemInfoArr[this.temp_key].size_pallet = e.list[e.selectedRowKeys[0]].size_pallet;
        this.changeQuantity(this.temp_key)
        console.log(this.itemInfoArr[this.temp_key].can_send)
      }
    },
    onClienteleSelect(e) {
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        let temp_invoice_id = this.info.invoice_id;
        this.info.invoice_id = e.selectedRowKeys[0]+"";
        if(temp_invoice_id != this.info.invoice_id){
          this.itemInfoArr = [];
        }
        this.info.invoice_no = e.list[e.selectedRowKeys[0]].invoice_no;
        this.info.name_en = e.list[e.selectedRowKeys[0]].name_en;
        this.info.address = e.list[e.selectedRowKeys[0]].address;
        this.info.plate_number_group = e.list[e.selectedRowKeys[0]].plate_number_group;
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    changeQuantity(key) {
      console.log(key)
      if(this.itemInfoArr[key].quantity && this.itemInfoArr[key].size_pallet != 0) {
        this.itemInfoArr[key].plate_number = Math.ceil(this.itemInfoArr[key].quantity / this.itemInfoArr[key].size_pallet)
      }
    },
    handle_submit_data(sumbmit_info) {
      sumbmit_info.tio_file = this.$refs.file.get_file_info(
        sumbmit_info.tio_file
      );

      //submit info data handling
      if (sumbmit_info.note_date != null) {
        sumbmit_info.note_date = sumbmit_info.note_date._isValid
          ? sumbmit_info.note_date.format("YYYY-MM-DD")
          : "";
      } else {
        submit_info.note_date = "0000-00-00";
      }
      sumbmit_info.created_by = sessionStorage.user_id;
      console.log(sumbmit_info);
      return sumbmit_info;
    },
    submit_validation() {
      //check mandatory
      if(this.info.note_date == null){
        this.$message.error("Please check the required information");
        return false;
      }

      var mandatory_property = [
        "invoice_id",
        "note_plate_no",
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
      //item
      for(let key in this.itemInfoArr){
        let value = this.itemInfoArr[key]
        if(this.itemInfoArr[key].quantity == 0) {
          this.$message.error("Item quantity is empty!");
          return false;
        }

        this.itemInfoArr[key].quantity = this.itemInfoArr[key].quantity + "";
        
        var mandatory_property = [
          "discount_id",
          "quantity",
          "plate_number"
        ];
        for (let i = 0; i < mandatory_property.length; i++) {
          if (value.hasOwnProperty(mandatory_property[i])) {
            if (!isHasVal(value[mandatory_property[i]] + "")) {
              this.$message.error("Please check the required information");
              return false;
            }
          } else {
            this.$message.error("mandatory status wrong");
            return false;
          }
        }
      }
      for(let key in this.itemInfoArr){
        this.itemInfoArr[key].plate_number = this.itemInfoArr[key].plate_number + "";
        this.itemInfoArr[key].quantity = this.itemInfoArr[key].quantity + "";
      }
      return this.onSubmit();
    },
    submitMethod(){
      this.submit_num++;
      if(this.submit_num == this.itemInfoArr.length){
        this.itemInfoArr = [];
        this.submit_num = 0;
        this.info = {
          invoice_id: "",
          invoice_no: "",
          name_zh: "",
          note_contact: "",
          note_contact_tel: "",
          note_date: "",
          note_address: "",
          note_plate_no: "",
          remark: "",
          created_by: "",
          tio_file: "",
          plate_number_group: []
        };
        this.$message.success("success");
        this.visible = false;
        this.onSubmiting = false;
        this.$emit("done", {});
      }
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_delivery_note(this.handle_submit_data(this.submit_info))
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
                this.itemInfoArr[key].note_id = res.new_id;
                c_delivery_note_product(this.itemInfoArr[key])
                  .then(res => {
                    if (res.status) {
                      this.submitMethod();
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
  .item-25 {
    width: 25%;
  }
  .ant-select {
    width: 100%;
  }
}
</style>
