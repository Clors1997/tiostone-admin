<template>
  <div>
    <p class="header">
      <span></span>
      <!-- <a-input-search placeholder="產品名稱" style="width: 200px" @search="onSearch"/> -->
      <span>
        <a-button type="primary" @click="()=>{
        this.$refs.newProduct.show(note_id, invoice_id)
        }">New</a-button>
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
        >more</a>
      </template>
      <template slot="is_pink" slot-scope="record">
        <div v-if="record.is_pink == '1'">是</div>
        <div v-else>否</div>
      </template>
      <template slot="quantity" slot-scope="record">
        <div v-if="record.quantity != ''">{{record.quantity}}m²</div>
        <div v-else></div>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="delete it？"
          okText="yes"
          cancelText="no"
          @confirm="() => onDelete(record.id, record.discount_id)"
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
import { r_delivery_note_product, d_delivery_note_product } from "@/api/delivery_note_product.js";
import newProduct from "./new.vue";
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
      },
      note_id: 0,
      invoice_id: 0
    };
  },
  components: { newProduct, edit },
  created() {
    this.columns = [
      { title: "no", width: "100px", dataIndex: "id",
        sorter: (a, b) => {
          return (b.id.length - a.id.length) == 0?(b.id>a.id):(b.id.length - a.id.length)
        }
      },
      { title: "size", dataIndex: "size" },
      { title: "type", dataIndex: "type" },
      { title: "code", dataIndex: "code" },
      { title: "plate number", dataIndex: "plate_number" },
      { title: "quantity", scopedSlots: { customRender: "quantity" } },
      // { width: "100px", scopedSlots: { customRender: "detail" } },
      { width: "50px", scopedSlots: { customRender: "delete" } }
    ];
  },
  mounted() {
    this.$nextTick(function () {
      this.note_id=this.$route.params.noteid;
      this.invoice_id=this.$route.params.invoiceid;
      console.log(this.note_id)
      this.getTableData(1, 10);
    })
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
      r_delivery_note_product(pagenum, size, this.note_id, this.search)
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
          this.$message.error("fail error");
        });
    },
    onDelete(id, discount_id) {
      this.onTableLoading = true;
      d_delivery_note_product(id, discount_id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          if(res.status){
            this.$message.success("success");
            this.getTableData(1, 10);
          }else{
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("fail error");
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
