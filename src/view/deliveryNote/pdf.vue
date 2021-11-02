<template>
  <div>
    <a-modal
      title="PDF view"
      :visible="visible"
      ok-text="download PDF"
      cancel-text="cancel"
      @ok="handleOk"
      @cancel="onClose"
      :width="800"
    >
    <a-spin v-if="loading" tip="Loading..." style="margin: 100px 0;">
      <div class="spin-content">
      </div>
    </a-spin>
    <div v-if="!loading" id="pdfDom" style="padding: 20px 20px 0 20px;position: relative;">
      <br/>
      <h2 style="text-align: center;"><b>天奥</b>環保有限公司<br/><b>TIOSTONE</b> ENVIRONMENTAL LIMITED
      <div style="font-size: 14px;">Tel:2669 8222 &nbsp&nbsp Fax:2797 8111 &nbsp&nbsp E-mail:info@tiostone.com</div>
      </h2>
      <div style="text-align: center;"><b>Factory Address</b>: D.D. 134, Lung Kwu Sheung Tan, Tuen Mun, New Territories, Hong Kong</div>
      <div style="font-size: 26px;text-align: right;">№ <span style="color: red;">{{buling(info.id, 5)}}</span> </div>
      <h3 style="text-align: center;"><b>送貨單</b><br/>Delivery Note</h3>
      <img style="position: absolute;top: 0px;left: 0px;width:200px;height:120px;" src="../../assets/tiostone.png"></img>

      <table style="width: 100%;color: #000000;font-size: 16px;">
        <tr>
          <td style="width:120px;">客戶:<br/>Client</td>
          <td class="line-td">{{ info.name_en }}</td>
          <td style="width:130px;">訂單編號:<br/>Po.</td>
          <td class="line-td">{{ info.invoice_no }}</td>
        </tr>
        <tr>
          <td>聯絡人:<br/>Contact Person</td>
          <td class="line-td">{{ info.clientele_contact }} <span v-if="info.clientele_contact != '' && info.tel != ''"></span> {{ info.tel }}</td>
          <td>送貨日期:<br/>Date of Delivery</td>
          <td class="line-td">{{ info.note_date }}</td>
        </tr>
        <tr>
          <td>送貨地址:<br/>Adderss</td>
          <td class="line-td">{{ info.address }}</td>
          <td>交貨車牌:<br/>License Plate No.</td>
          <td class="line-td">{{ info.note_plate_no }}</td>
        </tr>
      </table>

      <br>
      <a-table :columns="columns" :data-source="innerData" :pagination="false" bordered>
        <template slot="is_pink" slot-scope="record">
          <div v-if="record.is_pink == '1'">是</div>
          <div v-else>否</div>
        </template>
        <template slot="footer" style="background: #fff !important;" slot-scope="currentPageData">
            Remarks（備註）：
            {{info.remark}}
        </template>
      </a-table>
      <br/>
      <div style="font-weight: 550;">
        <div style="display: flex;">
          <div style="flex:1;display: flex;align-items:center;">
            跟卡版：<span class="line-td">&nbsp&nbsp {{ex_plate_number}} &nbsp&nbsp</span>板
          </div>
          <div style="flex:1;display: flex;align-items:center;">
            卡版回收：<span class="line-td">&nbsp&nbsp {{info.back_num}} &nbsp&nbsp</span>板
          </div>
          <div style="flex:2;display: flex;align-items:center;">
            卡版回收簽署：<div class="line-td" style="width: 250px;"></div>
          </div>
        </div>
        <br/>
        <div style="display: flex;">
          <div style="flex:1;display: flex;align-items:center;">
            經手人：<br/>
            Issued by<div class="line-td" style="width:220px"></div>
          </div>
          <div style="flex:1;display: flex;align-items:center;">
            收貨人簽署：<br/>
            Received by<div class="line-td" style="width:265px"></div>
          </div>
        </div>
        <div style="float: right;">Authorized Signature</div>
        <br/>
        <div><b>Website:</b> www.tiostone.com</div>
      </div>


    </div>
    </a-modal>
  </div>
</template>
<script>
import { r_all_delivery_note_product } from "@/api/delivery_note_product.js";

const columns = [
  { title: "size", dataIndex: "size" },
  { title: "type", dataIndex: "type" },
  { title: "code", dataIndex: "code" },
  { title: "板數", dataIndex: "plate_number" },
  { title: "數量m²", dataIndex: "quantity" },
]

export default {
  data() {
    return {
      visible: false,
      size: 'small',
      info: {},
      innerData: [],
      columns,
      loading: false
    };
  },
  computed: {
    ex_plate_number(){
      let num = 0;
      for(let key1 in this.innerData)
      num += parseInt(this.innerData[key1].plate_number);
      return num;
    }
  },
  methods: {
    buling(a, length) {
      return a.padStart(length,0)
    },
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));
      this.getInnerTableData(info.id);
      console.log(this.info);
      this.visible = true;
    },
    onClose(e) {
      this.visible = false;
    },
    getInnerTableData(note_id) {
      this.loading = true;
      r_all_delivery_note_product(note_id)
        .then(res => {
          console.log(res);

          this.loading = false;
          this.innerData = res.list;
          console.log(this.innerData)
        })
        .catch(err => {
          console.log(err.message)
          this.$message.error("fail - system error");
        });
    },
    handleOk(){
      this.getPdf('DN-'+this.buling(this.info.id, 5));
      this.visible = false;
    }
  },
};
</script>
<style scoped="scoped">
  .line-td{
    border-bottom: #000000 dotted 1px;
    font-size: 20px;
    height: 31px;
  }
  .ant-table-footer {
    background: #fff;
  }

  #pdfDom >>> .ant-table-thead > tr > th,#pdfDom >>> .ant-table-tbody > tr > td {
    background: #fff;
    padding: 10px 10px;
  }

  #pdfDom >>> .ant-table {
    font-size: 16px;
  }
</style>
