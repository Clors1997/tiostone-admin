<template>
  <span>
    <a-modal title="Select Plate" v-model="visible" width="1000px" :footer="null">
      <h2>
        <a-input-search
          placeholder="Team Name/plate number"
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
      >
      </a-table>
      <p style="margin:0;text-align:right">
        <a-button type="primary" @click="onSure">Select</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { r_plate_team } from "@/api/plate.js";
const columns = [
  { title: "Team Name", dataIndex: "team_name" },
  { title: "plate number", dataIndex: "plate_num" }
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
        pageSize: 10
      }
    };
  },
  props: ["selectType"],
  created() {},
  methods: {
    getTableData() {
      this.loading = true;
      r_plate_team()
        .then(res => {
          res.list_all.forEach((item, key) => {
            this.$set(item, "key", parseInt(key));
          });
          this.tableData = res.list_all;
          this.dataSource = this.tableData;
          console.log(this.tableData )

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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      console.log(this.selectedRowKeys);
    },
    onSure() {
      this.visible = false;
      let list = {};
      this.dataSource.forEach((item, key) => {
        if (this.selectedRowKeys.includes(key)) {
          list[key] = item;
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
    setRow(record) {
      return {
        on: {
          click: (event) => {
            this.selectedRowKeys = [ parseInt(record.id) ];
          },
        },
      };
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
          item.team_name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item.plate_num.toLowerCase().indexOf(val.toLowerCase()) > -1
        ) {
          idList.add(item.key);
        }
      });
      if (idList.length == 0) {
        this.tableData = this.dataSource;
      } else {
        this.tableData = [];
        idList.forEach(item => {
          dataSource.some(obj => {
            if (obj.key == item) {
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
