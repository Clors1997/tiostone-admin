<template>
  <a-drawer
    title="Edit Delivery Panel"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
    width="600px"
  >
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item" v-if="limit">
            <span class="label required">Select From P.O.</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectInvoice.showModal('')
              }"
            >Select</a-button>
          </p>
          <p class="item" v-if="info.invoice_id != ''">
            <span class="label">Client</span>
            <a-input read-only :disabled="!limit" :maxLength="255" v-model="info.name_en"></a-input>
          </p>
          <p class="item" v-if="info.invoice_id != ''">
            <span class="label">P.O. No</span>
            <a-input read-only :disabled="!limit" :maxLength="255" v-model="info.invoice_no"></a-input>
          </p>
          <p class="item" v-if="info.invoice_id != ''">
            <span class="label">Address</span>
            <a-input read-only :disabled="!limit" :maxLength="512" v-model="info.address"></a-input>
          </p>
          <p class="item item-helf">
            <span class="label">Return Pallet Number</span>
            <a-input-number :disabled="!limit" :min="0" :max="10000" v-model="info.back_num" />
          </p>
          <a-divider />
          <p class="item">
            <span class="label required">Delivery Date</span>
            <a-date-picker :disabled="!limit" format="DD/MM/YYYY" v-model="info.note_date" placeholder="select time"></a-date-picker>
          </p>
          <p class="item" v-if="info.invoice_id != ''">
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
          <p class="item">
            <span class="label">Remark</span>
            <a-input :disabled="!limit" :maxLength="300" v-model="info.remark"></a-input>
          </p>
          <a-divider />
          <p class="item">
            <span class="label">Upload Delivery</span>
            <uploadFile :disabled="!limit" style="text-align:left;width:100%" @changeSubmit="changeSubmit" ref="file" v-model="info.tio_file"></uploadFile>
          </p>
        </a-col>
      </a-row>

      <p v-if="limit" style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
      <selectInvoice :selectType="'radio'" ref="selectInvoice" @done="onClienteleSelect"></selectInvoice>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import { isHasVal } from "@/utils/validate";
import uploadFile from "@/components/uploadFile.vue";
import { u_delivery_note } from "@/api/delivery_note.js";
import selectInvoice from "@/components/selectInvoice.vue";
import { r_plate_no } from "@/api/plate.js";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        invoice_id: "",
        invoice_no: "",
        name_zh: "",
        note_date: "",
        note_address: "",
        note_plate_no: "",
        is_self: 0,
        back_num: 0,
        remark: "",
        tio_file: null,
        created_by: ""
      },
      limit: false,
      plate_no: []
    };
  },
  components: { selectInvoice, uploadFile },
  created() {},
  methods: {
    changeSubmit(flag){ this.onSubmiting = flag; },
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));
      if (this.info.note_date == "0000-00-00") {
        this.info.note_date = null;
      } else {
        this.info.note_date = moment(this.info.note_date, "YYYY-MM-DD");
      }

      if (
        this.info.tio_file == null ||
        this.info.tio_file == ""
      ) {
        this.info.tio_file = [];
      }
      this.limit = this.info.status != '5' && this.info.status != '6' && this.info.is_po == 0;


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
      console.log(this.info);
    },
    onClose() {
      this.visible = false;
    },
    onClienteleSelect(e) {
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        this.info.invoice_id = e.selectedRowKeys[0]+"";
        this.info.invoice_no = e.list[e.selectedRowKeys[0]].invoice_no;
        this.info.name_zh = e.list[e.selectedRowKeys[0]].name_zh;
        this.info.address = e.list[e.selectedRowKeys[0]].address;
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
      return this.onSubmit();
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      u_delivery_note(this.handle_submit_data(this.submit_info))
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
