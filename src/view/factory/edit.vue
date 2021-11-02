<template>
  <a-drawer
    title="修改稱重單"
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
            <span class="label required">從 客戶 中揀選</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectClientele.showModal('')
              }"
            >查找</a-button>
          </p>
          <p class="item" v-if="info.clientele_id != ''">
            <span class="label">客戶名稱</span>
            <a-input read-only :maxLength="255" v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label required">單號</span>
            <a-input :maxLength="60" v-model="info.factory_code"></a-input>
          </p>
          <p class="item">
            <span class="label required">送貨日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.factory_date" placeholder="選擇日期"></a-date-picker>
          </p>
          <p class="item">
            <span class="label required">送貨時間</span>
            <a-time-picker format="HH:mm:ss" v-model="info.factory_time" placeholder="選擇時間"></a-time-picker>
          </p>
          <p class="item">
            <span class="label">車牌</span>
            <a-input :maxLength="60" v-model="info.factory_truck_no"></a-input>
          </p>
          <p class="item">
            <span class="label ">總重kg</span>
            <a-input-number style="width: 400px;" :min="0" :max="1000000" @change="calNet()" v-model="info.gross_weight" />
          </p>
          <p class="item">
            <span class="label ">皮重kg</span>
            <a-input-number style="width: 400px;" :min="0" :max="1000000" @change="calNet()" v-model="info.tare_weight" />
          </p>
          <p class="item">
            <span class="label ">淨重kg(總重 - 皮重)</span>
            <a-input read-only :maxLength="120" v-model="info.net_weight"></a-input>
          </p>
          <p class="item">
            <span class="label">司機署名</span>
            <a-input :maxLength="60" v-model="info.chauffeur_signature"></a-input>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <a-textarea :maxLength="510" :rows="5" v-model="info.remark" />
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
import { u_factory } from "@/api/factory.js";
import selectClientele from "@/components/selectClientele.vue";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        clientele_id: "",
        name_zh: "",
        factory_code: "",
        factory_date: "",
        factory_time: "",
        factory_truck_no: "",
        gross_weight: "",
        tare_weight: "",
        net_weight: "",
        chauffeur_signature: "",
        remark: "",
        created_by: ""
      },
    };
  },
  components: { selectClientele },
  created() {},
  methods: {
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));

      if (this.info.factory_date == "0000-00-00") {
        this.info.factory_date = null;
      } else {
        this.info.factory_date = moment(this.info.factory_date, "YYYY-MM-DD");
      }

      if (this.info.factory_time == "00:00:00") {
        this.info.factory_time = null;
      } else {
        this.info.factory_time = moment(this.info.factory_time, "HH:mm:ss");
      }

      this.visible = true;
      this.onSubmiting = false;
      console.log(this.info);
    },
    onClose() {
      this.visible = false;
    },
    calNet(){
      let tare_weight = parseInt(this.info.tare_weight);
      let gross_weight = parseInt(this.info.gross_weight);
      if(tare_weight != '' && gross_weight != '' && gross_weight - tare_weight > 0){
        this.info.net_weight = gross_weight - tare_weight;
      }else{
        this.info.net_weight = 0;
      }
    },
    onClienteleSelect(e) {
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        this.info.clientele_id = e.selectedRowKeys[0]+"";
        this.info.name_zh = e.list[e.selectedRowKeys[0]].name_zh;
      }
    },
    handle_submit_data(sumbmit_info) {
      //submit info data handling
      if (sumbmit_info.factory_date != null) {
        sumbmit_info.factory_date = sumbmit_info.factory_date._isValid
          ? sumbmit_info.factory_date.format("YYYY-MM-DD")
          : "";
      } else {
        submit_info.factory_date = "0000-00-00";
      }

      if (sumbmit_info.factory_time != null) {
        sumbmit_info.factory_time = sumbmit_info.factory_time._isValid
          ? sumbmit_info.factory_time.format("HH:mm:ss")
          : "";
      } else {
        submit_info.factory_time = "00:00:00";
      }
      
      return sumbmit_info;
    },
    submit_validation() {
      //check mandatory
      if(this.info.factory_date == null || this.info.factory_time == null){
        this.$message.error("請檢查必須填寫的資料");
        return false;
      }
      
      var mandatory_property = [
        "clientele_id",
        "factory_code"
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
      u_factory(this.handle_submit_data(this.submit_info))
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
