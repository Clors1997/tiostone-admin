<template>
  <div>
    <p class="header">
      <a-input-search placeholder="單號" style="width: 200px" @search="onSearch"/>
      <span>
        <a-button type="primary" @click="()=>{
        this.$refs.newFactory.show()
        }">新增</a-button>
      </span>
    </p>
    <a-table
      :rowKey="record => record.id"
      :pagination="pagination_item"
      :columns="columns"
      :dataSource="tableData"
      :loading="onTableLoading"
    >
      <template slot="detail" slot-scope="record">
        <a
          @click="()=>{
            $refs.edit.show(record)
          }"
        >更多</a>
      </template>
      <template slot="time" slot-scope="record">
        {{record.factory_date}} {{record.factory_time}}
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="確認刪除嗎？"
          okText="是"
          cancelText="否"
          @confirm="() => onDelete(record.id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>

    <newFactory ref="newFactory" @done="getTableData(1, 10)"></newFactory>
    <edit ref="edit" @done="getTableData(1, 10)"></edit>
  </div>
</template>
<script>
import { r_factory,d_factory } from "@/api/factory.js";
import newFactory from "./new.vue";
import edit from "./edit.vue";

export default {
  data() {
    return {
      tableData: [],
      dataSource: [],
      columns: [],
      search: "",
      onTableLoading: false,
      pagination_item: {
        pageSize: 10,
        total: 0,
        current: 1,
        onChange: (page, pageSize) => this.changePage(page, pageSize)
      }
    };
  },
  components: { newFactory, edit },
  created() {
    this.columns = [
      { title: "編號", width: "100px", dataIndex: "id",
        sorter: (a, b) => {
          return (b.id.length - a.id.length) == 0?(b.id>a.id):(b.id.length - a.id.length)
        }
      },
      { title: "單號", dataIndex: "factory_code" },
      { title: "用戶名稱", dataIndex: "name_zh" },
      { title: "時間", scopedSlots: { customRender: "time" } },
      { title: "總重", dataIndex: "gross_weight" },
      { title: "皮重", dataIndex: "tare_weight" },
      { title: "淨重", dataIndex: "net_weight" },
      { width: "100px", scopedSlots: { customRender: "detail" } },
      { width: "50px", scopedSlots: { customRender: "delete" } }
    ];

    this.getTableData(1, 10);
  },
  methods: {
    changePage(page, pageSize) {
      this.getTableData(page, pageSize);
    },
    onSearch(val) {
      this.search = val;
      this.getTableData(1, 10);
    },
    getTableData(pagenum, size) {
      this.onTableLoading = true;
      r_factory(pagenum, size, this.search)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;

          this.pagination_item.pageSize = size;
          this.pagination_item.total = res.total;
          this.pagination_item.current = pagenum;
          console.log(this.pagination_item)
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("網絡請求超時");
        });
    },
    onDelete(id) {
      this.onTableLoading = true;
      d_factory(id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          if(res.status){
            this.$message.success("删除成功");
            this.getTableData(1, 10);
          }else{
            this.$message.error("删除失败");
          }
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("網絡請求超時");
        });
    }
  },
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
