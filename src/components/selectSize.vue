<template>
  <span>
    <a-modal title="select size" v-model="visible" width="900px" :footer="null">
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
        <template slot="action" slot-scope="record">
          <a-popconfirm
            title="Delete it?"
            okText="yes"
            cancelText="no"
            @confirm="() => onDelete(record.id)"
          >
            <a-button icon="delete" @click.stop="" >
              delete
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <p style="margin:0;text-align:right">
        <a-button type="primary" @click="onSure">Select</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { d_product_meta } from "@/api/product_meta.js"
const columns = [
  { title: "Size", dataIndex: "value" },
  { title: "Metre Square", dataIndex: "size_square" },
  { title: "Count per pallet", dataIndex: "size_pallet" },
  { title: "action", width: 100, scopedSlots: { customRender: "action" } },
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
      id: 0
    };
  },
  props: ["selectType"],
  created() {},
  methods: {
    onDelete(id) {
      this.loading = true;
      d_product_meta(id)
        .then(res => {
          console.log(res);

          this.loading = false;
          if(res.status){
            this.$message.success("success");
            this.$emit('update')
          }else{
            this.$message.error("fail");
          }
        })
        .catch(err => {
          console.log(err.message)
          this.loading = false;
          this.$message.error("fail");
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
    showModal(context, tableData, id) {
      this.context = context || "";
      this.id = id;
      this.selectedRowKeys = []; //clear select
      this.visible = true;
      this.search_text = "";
      this.tableData = tableData;
      this.tableData.forEach(item => {
        this.$set(item, "key", parseInt(item.id));
      });
      this.dataSource = this.tableData;
      console.log(this.tableData)
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
        list,
        id: this.id
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
