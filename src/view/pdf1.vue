<template>
  <div>
    <a-modal
      title="PDF預覽"
      :visible="visible"
      ok-text="下載PDF"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="onClose"
      :width="1000"
    >
    <div id="pdfDom" style="padding: 20px 20px 0 20px;position: relative;height: 1333px;">
      <img style="position: absolute;top: -20px;left: -20px;width:333px;height:200px;" src="../assets/tiologo.png"></img>

      <h1 style="text-align: center;margin-top:150px;">INVOICE</h1>
<!--      <a-descriptions :size="size" :column="2">
        <a-descriptions-item label="Client">
          {{ info.name_zh }}
        </a-descriptions-item>
        <a-descriptions-item label="Invoice">
          {{ info.invoice_no }}
        </a-descriptions-item>
        <a-descriptions-item label="Address">
          {{ info.address }}
        </a-descriptions-item>
        <a-descriptions-item label="P.O.No">

        </a-descriptions-item>
        <a-descriptions-item label="Tel">
          {{ info.tel }}
        </a-descriptions-item>
        <a-descriptions-item label="Date">
          {{ info.invoice_date }}
        </a-descriptions-item>
        <a-descriptions-item label="Fax">
          {{ info.fax }}
        </a-descriptions-item>
      </a-descriptions> -->
      <table style="width: 100%;color: #000000;font-size: 16px;line-height: 30px;">
        <tr>
          <td>Client:</td>
          <td>{{ info.name_zh }}</td>
          <td>Invoice:</td>
          <td>{{ info.invoice_no }}</td>
        </tr>
        <tr>
          <td>Address:</td>
          <td>{{ info.address }}</td>
          <td>P.O.No:</td>
          <td></td>
        </tr>
        <br/>
        <tr>
          <td>Attn.:</td>
          <td>TAM SUET FONG</td>
          <td>Date:</td>
          <td>{{ computed_date(info.invoice_date) }}</td>
        </tr>
        <tr>
          <td>Tel:</td>
          <td>{{ info.tel }}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>fax:</td>
          <td>{{ info.fax }}</td>
          <td></td>
          <td></td>
        </tr>
        <br/>
        <br/>
        <tr>
          <td>Site:</td>
          <td>{{ info.invoice_site }}</td>
          <td></td>
          <td></td>
        </tr>
      </table>
      <table class="table-main" style="width: 100%;color: #000000;font-size: 16px;line-height: 30px;">
        <tr style="border-top: solid 2px #000000;">
          <td class="td1">Item</td>
          <td>Description</td>
          <td>Quantity</td>
          <td>Unit</td>
          <td>Rate<br/>(HKD $)</td>
          <td>Total Amount<br/>(HKD $)</td>
        </tr>
        <tr style="border-top: solid 2px #000000;line-height: 35px;">
          <td class="td1">
            <div style="min-height: 200px;">
              Aggregates
            </div>
          </td>
          <td>
            <div style="min-height: 200px;">
              <div v-for="(item, key) in innerData" :key="key">{{item.discount_description}}</div>
            </div>
          </td>
          <td>
            <div style="min-height: 200px;">
              <div v-for="(item, key) in innerData" :key="key">{{item.discount_quantity}}</div>
            </div>
          </td>
          <td>
            <div style="min-height: 200px;">
              <div v-for="(item, key) in innerData" :key="key">{{item.discount_unit}}</div>
            </div>
          </td>
          <td>
            <div style="min-height: 200px;">
              <div v-for="(item, key) in innerData" :key="key">{{item.discount_rate}}</div>
            </div>
          </td>
          <td>
            <div style="min-height: 200px;">
              <div v-for="(item, key) in innerData" :key="key">{{parseFloat(item.discount_total)}}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="td1"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style="border-top: solid 2px #000000;">Total: <span style="float:right">{{number_format(computed_total, 4, ".", ",")}}</span> </td>
        </tr>
        <tr style="border-top: solid 2px #000000;border-bottom: solid 2px #000000;line-height: 35px;">
          <td class="td1">
            <div style="min-height: 100px;">
              Remark
            </div>
          </td>
          <td colspan="5">
            <div style="min-height: 100px;">
              <div v-for="(value, key) in computed_remark(info.remark)" :key="key">{{value}}</div>
            </div>
          </td>
        </tr>
      </table>
      <br/>
      <div style="font-style: italic">For and on behalf of</div>
      <div style="font-style: italic">Tailor Recycled Aggregates(H.K.) Limited</div>

      <div style="position:absolute; bottom:0px;">
        <div>Office: Unit 401,4/F,Harbour Centre.Ⅰ Hok Cheung Street,Hunghom,Kowloon.H.K.</div>
        <div>Tel:(852)2669 8222 Fax:(852)2797 8111</div>
        <div>Recycle Centre:Lung Kwu Sheung Tan.DD 134.Tuen Mun,N.T.</div>
      </div>
    </div>
    </a-modal>
  </div>
</template>
<script>
import { r_invoice_discount } from "@/api/invoice_discount.js";

export default {
  data() {
    return {
      visible: true,
      size: 'small',
      info: {},
      innerData: []
    };
  },
  computed: {
    computed_total() {
      let total = 0;
      for (let key1 in this.innerData) {
        total += parseFloat(this.innerData[key1].discount_total);
      }
      return total;
    },
    computed_remark(){
      return (item) => {
        return item.trim().split("\n");
      }
    },
    computed_date(){
      return (item) => {
        let str = item.split('-');
        return str[1]+"/"+str[2]+"/"+str[0];
      }
    }
  },
  mounted() {
    // console.log(JSON.parse(this.$route.query.invoice)[0], 11)
    // this.info = JSON.parse(this.$route.query.invoice)[0];
    // this.getInnerTableData(this.info.id);


    this.info = JSON.parse(this.$route.query.invoice)[0];
    this.innerData = JSON.parse(this.$route.query.invoiceinnerdata);
    this.$nextTick(function(){
      this.getPdf2("exxx");
    })
  },
  methods: {
    onClose(e) {
      this.visible = false;
    },
    number_format(number, decimals, dec_point, thousands_sep) {
        /*
        * 参数说明：
        * number：要格式化的数字
        * decimals：保留几位小数
        * dec_point：小数点符号
        * thousands_sep：千分位符号
        * */
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.ceil(n * k) / k;
            };

        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },
    getInnerTableData(invoice_id) {
      console.log(invoice_id);
      this.loading = true;
      r_invoice_discount(invoice_id)
        .then(res => {
          console.log(res);

          this.loading = false;
          this.innerData = res.list;
          console.log(this.innerData)
          this.$nextTick(function(){
            this.getPdf2("exxx");
          })
        })
        .catch(err => {
          console.log(err.message)
          this.$message.error("網絡請求超時");
        });
    },
    handleOk(){
      this.getPdf2(this.info.invoice_no);
    }
  },
};
</script>
<style scoped="scoped">
  .td1{
    border-right: solid 2px #000000;
  }

</style>
