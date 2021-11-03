<template>
  <a-drawer
    title="修改訂單"
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
            <span class="label required">Number</span>
            <a-input :maxLength="400" v-model="info.invoice_number"></a-input>
          </p>
          <p class="item">
            <span class="label required">Client</span>
            <a-input @click="()=>{
              $refs.selectClientele.showModal('')
              }" read-only :maxLength="255" v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label required">PO Number</span>
            <a-input :maxLength="400" v-model="info.invoice_no"></a-input>
          </p>
          <p class="item">
            <span class="label required">Order Date</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.invoice_date" placeholder="select time"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">Project</span>
            <a-input :maxLength="510" v-model="info.invoice_project"></a-input>
          </p>
          <p class="item">
            <span class="label">Delivery Address</span>
            <a-input :maxLength="510" v-model="info.invoice_site"></a-input>
          </p>
          <p class="item">
            <span class="label">Site Contact Person</span>
            <a-input :maxLength="510" v-model="info.invoice_site_contact"></a-input>
          </p>
          <p class="item">
            <span class="label">Status</span>
            <a-select v-model="info.invoice_status">
              <a-select-option v-for="(item, key) in status_array" :key="key" :value="item">
                {{item}}
              </a-select-option>
          
            </a-select>
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
      <selectClientele :selectType="'radio'" ref="selectClientele" @done="onClienteleSelect"></selectClientele>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import { isHasVal } from "@/utils/validate";
import { u_invoice } from "@/api/invoice.js";
import selectClientele from "@/components/selectClientele.vue";
import { u_invoice_test } from "@/api/number.js";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      status_array: [],
      info: {
        clientele_id: "",
        name_en: "",
        invoice_number:"",
        invoice_no: "",
        invoice_date: "",
        invoice_site: "",
        invoice_site_contact: "",
        invoice_project: "",
        invoice_status: "",
        remark: "",
        created_by: ""
      },
    };
  },
  components: { selectClientele },
  created() {},
  methods: {
    show(info, status_array) {
      this.info = JSON.parse(JSON.stringify(info));
      this.status_array = status_array;
      if (this.info.invoice_date == "0000-00-00") {
        this.info.invoice_date = null;
      } else {
        this.info.invoice_date = moment(this.info.invoice_date, "YYYY-MM-DD");
      }

      this.visible = true;
      this.onSubmiting = false;
      console.log(this.info);
    },
    onClose() {
      this.visible = false;
    },
    onClienteleSelect(e) {
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        this.info.clientele_id = e.selectedRowKeys[0]+"";
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
      return this.onSubmit();
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      u_invoice_test(this.handle_submit_data(this.submit_info))
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
