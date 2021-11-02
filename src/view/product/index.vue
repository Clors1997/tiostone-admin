<template>
  <div>
    <p class="header">
      <a-input-search placeholder="產品名稱" style="width: 200px" @search="onSearch"/>
      <span>
        <a-button type="primary" @click="()=>{
        this.$refs.newProduct.show()
        }">新增</a-button>
      </span>
    </p>
    <a-table
      :rowKey="record => record.id"
      :pagination="pagination_item"
      :columns="columns"
      :dataSource="tableData"
      :loading="onTableLoading"
      :scroll="scroll"
    >
      <template slot="detail" slot-scope="record">
        <a
          @click="()=>{
            $refs.edit.show(record)
          }"
        >更多</a>
      </template>
      <template slot="is_pink" slot-scope="record">
        <div v-if="record.is_pink == '1'">是</div>
        <div v-else>否</div>
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

    <newProduct ref="newProduct" @done="getTableData(1, 10)"></newProduct>
    <edit ref="edit" @done="getTableData(1, 10)"></edit>
  </div>
</template>
<script>
import { r_product, d_product } from "@/api/product.js";
import newProduct from "./new.vue";
import edit from "./edit.vue";

export default {
  props: [ 'screenwidth' ],
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
      },
      scroll: {}
    };
  },
  components: { newProduct, edit },
  created() {
    this.func_width(this.screenwidth);

    this.getTableData(1, 10);
  },
  watch: {
    screenwidth(val){
      this.func_width(val);
    }
  },
  methods: {
    func_width(val){
      this.scroll = val<1000?{ x: 852 }:{};
      if(val < 1000){
          this.columns = [
            { title: "產品編號", width: "100px", dataIndex: "product_no" },
            { title: "產品名稱", dataIndex: "product_name" },
            { title: "產品尺寸", dataIndex: "product_size" },
            { title: "產品庫存m²", dataIndex: "product_repertory" },
            { title: "單價(HKD $)", dataIndex: "unit_price" },
            { width: "100px",fixed: 'right', scopedSlots: { customRender: "detail" } },
            { width: "100px", scopedSlots: { customRender: "delete" } }
          ];
      }else if(val < 1330){
          this.columns = [
            { title: "產品編號", width: "100px", dataIndex: "product_no" },
            { title: "產品名稱", dataIndex: "product_name" },
            { title: "產品尺寸", dataIndex: "product_size" },
            { title: "產品庫存m²", dataIndex: "product_repertory" },
            { title: "單價(HKD $)", dataIndex: "unit_price" },
            { width: "100px",fixed: 'right', scopedSlots: { customRender: "detail" } },
            { width: "100px", scopedSlots: { customRender: "delete" } }
          ];
      }else {
        this.columns = [
          { title: "產品編號", width: "100px", dataIndex: "product_no" },
          { title: "產品名稱", dataIndex: "product_name" },
          { title: "產品尺寸", dataIndex: "product_size" },
          { title: "產品庫存m²", dataIndex: "product_repertory" },
          { title: "單位大小m²", dataIndex: "unit_price_unit" },
          { title: "單價(HKD $)", dataIndex: "unit_price" },
          { width: "100px", scopedSlots: { customRender: "detail" } },
          { width: "100px", scopedSlots: { customRender: "delete" } }
        ];
      }
    },
    changePage(page, pageSize) {
      this.getTableData(page, pageSize);
    },
    onSearch(val) {
      this.search = val;
      this.getTableData(1, 10);
    },
    getTableData(pagenum, size) {
      this.onTableLoading = true;
      r_product(pagenum, size, this.search)
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
      d_product(id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          if(res.status){
            this.$message.success("删除成功");
            this.getTableData(1, 10);
          }else{
            this.$message.error("删除失败 - 該產品已被使用");
          }
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("網絡請求超時");
        });
    },
  },
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
