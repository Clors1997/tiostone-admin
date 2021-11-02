<template>
  <span>
    <a-modal title="Select P.O. product" v-model="visible" width="1000px" :footer="null">
<!--      <h2>
        <a-input-search
          placeholder="產品名稱"
          style="width: 200px"
          @search="onSearch"
          v-model="search_text"
        />
        <a-button type="primary" @click="onReset">重置</a-button>
      </h2> -->
      <a-table
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          type:this.selectType
        }"
        :customRow="setRow"
        :columns="columns"
        :dataSource="tableData"
        :loading="loading"
      >
      <template slot="is_pink" slot-scope="record">
        <div v-if="record.is_pink == '1'">是</div>
        <div v-else>否</div>
      </template>
      </a-table>
      <p style="margin:0;text-align:right">
        <a-button type="primary" @click="onSure">Select</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { r_invoice_discount } from "@/api/invoice_discount.js";

const columns = [
  { title: "size", dataIndex: "size" },
  { title: "type", dataIndex: "type" },
  { title: "code", dataIndex: "code" },
  { title: "Quantity", dataIndex: "discount_quantity" },
  { title: "Count/Pallet", dataIndex: "size_square" },
  { title: "Rate", dataIndex: "discount_rate" },
  { title: "QuantitySend", dataIndex: "discount_send" }
];

export default {
  data() {
    return {
      tableData: [],
      columns,
      visible: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      context: "",
      search_text: "",
      dataSource: [],
      invoice_id: 0
    };
  },
  props: ["selectType"],
  created() {},
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  methods: {
    getTableData() {
      this.loading = true;
      r_invoice_discount(this.invoice_id)
        .then(res => {
          res.list.forEach(item => {
            this.$set(item, "key", parseInt(item.id));
          });
          this.tableData = res.list;
          this.dataSource = this.tableData;

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    showModal(context, invoice_id) {
      this.context = context || "";
      this.selectedRowKeys = []; //clear select
      this.invoice_id = invoice_id;
      this.visible = true;
      this.search_text = "";
      this.getTableData();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      console.log(this.selectedRowKeys);
    },
    setRow(record) {
      return {
        on: {
          click: (event) => {
            this.selectedRowKeys = [ parseInt(record.id) ];
          },
        },
      };
    },
    onSure() {
      this.visible = false;
      let list = {};
      this.dataSource.forEach(item => {
        if (this.selectedRowKeys.includes(parseInt(item.id))) {
          list[item.id] = item;
        }
      });
      console.log({
        context: this.context,
        selectedRowKeys: this.selectedRowKeys,
        list
      });
      this.$emit("done", {
        context: this.context,
        selectedRowKeys: this.selectedRowKeys,
        list
      });
    },
    onSearch(val) {
      if (val == "") {
        this.tableData = this.dataSource;
        return;
      }
      const dataSource = [...this.dataSource];
      let idList = new Set();
      dataSource.forEach(item => {
        if (
          item.name_zh.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item.name_en.toLowerCase().indexOf(val.toLowerCase()) > -1
        ) {
          idList.add(item.user_id);
        }
      });
      if (idList.length == 0) {
        this.tableData = this.dataSource;
      } else {
        this.tableData = [];
        idList.forEach(item => {
          dataSource.some(obj => {
            if (obj.user_id == item) {
              this.tableData.push(obj);
              return true;
            }
          });
        });
      }
    },
    onReset(val) {
      this.search_text = "";
      this.tableData = this.dataSource;
    }
  }
};
</script>
