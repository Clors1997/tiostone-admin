<template>
  <span>
    <a-modal title="揀選產品" v-model="visible" width="1000px" :footer="null">
      <h2>
        <a-input-search
          placeholder="產品名稱"
          style="width: 200px"
          @search="onSearch"
          v-model="search_text"
        />
        <a-button type="primary" @click="onReset">重置</a-button>
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
      >
      <template slot="is_pink" slot-scope="record">
        <div v-if="record.is_pink == '1'">是</div>
        <div v-else>否</div>
      </template>
      </a-table>
      <p style="margin:0;text-align:right">
        <a-button type="primary" @click="onSure">選擇</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { r_product } from "@/api/product.js";
const columns = [
  { title: "編號", width: "100px", dataIndex: "id" },
  { title: "產品名稱", dataIndex: "product_name" },
  { title: "產品尺寸", dataIndex: "product_size" },
  { title: "產品顏色", dataIndex: "color" },
  { title: "底層含有粉色", scopedSlots: { customRender: "is_pink" } }
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
      r_product(pagenum, size)
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
    showModal(context) {
      this.context = context || "";
      this.selectedRowKeys = []; //clear select
      this.visible = true;
      this.search_text = "";
      this.getTableData(1, 10);
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
