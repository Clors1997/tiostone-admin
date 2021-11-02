<template>
  <span>
    <a-modal title="select client" v-model="visible" width="1000px" :footer="null">
      <h2>
        <a-input-search
          placeholder="Client Name/Tel"
          style="width: 200px"
          @search="onSearch"
          v-model="search_text"
        />
        <a-button type="primary" @click="onReset">Reset</a-button>
      </h2>
      <a-table
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          type:this.selectType
        }"
        :customRow="setRow"
        :pagination="pagination_item"
        :columns="columns"
        :dataSource="tableData"
        :loading="loading"
      ></a-table>
      <p style="margin:0;text-align:right">
        <a-button type="primary" @click="onSure">Select</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { r_clientele } from "@/api/clientele.js";
const columns = [
  { title: "no", width: "100px", dataIndex: "id" },
  { title: "client name(en)", dataIndex: "name_en" },
  { title: "address", dataIndex: "address" },
  { title: "tel", dataIndex: "tel" }
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
      pagination_item: {
        pageSize: 10,
        total: 0,
        current: 1,
        onChange: (page, pageSize) => this.changePage(page, pageSize)
      }
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
    changePage(page, pageSize) {
      this.getTableData(page, pageSize);
    },
    getTableData(pagenum, size) {
      this.loading = true;
      r_clientele(pagenum, size)
        .then(res => {
          res.list.forEach(item => {
            this.$set(item, "key", parseInt(item.id));
          });
          this.tableData = res.list;
          this.dataSource = this.tableData;

          this.pagination_item.pageSize = size;
          this.pagination_item.total = res.total;
          this.pagination_item.current = pagenum;

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    searchTableData(pagenum, size, search) {
      this.loading = true;
      r_clientele(pagenum, size, search)
        .then(res => {
          res.list.forEach(item => {
            this.$set(item, "key", parseInt(item.id));
          });
          this.tableData = res.list;
          this.dataSource = this.tableData;
    
          this.pagination_item.pageSize = size;
          this.pagination_item.total = res.total;
          this.pagination_item.current = pagenum;
    
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    showModal(context) {
      this.context = context || "";
      this.selectedRowKeys = []; //clear select
      this.visible = true;
      this.search_text = "";
      this.getTableData(1, 10);
    },
    setRow(record) {
      let that = this
      return {
        on: {
          click: (event) => {
            this.selectedRowKeys = [ parseInt(record.id) ];
          },
        },
      };
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      console.log(this.selectedRowKeys);
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
      this.searchTableData(1, 10, val.toLowerCase())
    },
    onReset(val) {
      this.search_text = "";
      this.tableData = this.dataSource;
    }
  }
};
</script>
