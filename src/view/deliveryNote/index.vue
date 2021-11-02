<template>
  <div>
    <p class="header">
      <span>
        <a-input-search placeholder="Contact/Contact Tel" style="width: 200px" @search="onSearch"/>
      </span>
      <span>
        <a-button type="primary" @click="()=>{
        this.$refs.newNote.show()
        }">New</a-button>
      </span>
    </p>
    <p class="header">
      <a-tag v-if="invoiceid != 0" closable @close="clearInvoice()">
        Relate P.O. No： {{invoice}}
      </a-tag>
    </p>
    <a-table
      bordered
      :rowKey="record => record.id"
      :pagination="pagination_item"
      :components="components"
      :expandIconAsCell="false"
      :expandIconColumnIndex="-1"
      :columns="columns"
      :expandRowByClick="true"
      :expandedRowKeys="expandedRowKeys"
      :dataSource="tableData"
      :loading="onTableLoading"
      @expand="showDiscountExpand"
      :scroll="scroll"
    >
      <a-table
        slot="expandedRowRender"
        bordered
        :components="components2"
        :rowKey="record2 => record2.id"
        slot-scope="record"
        :columns="subColumns"
        :dataSource="innerData"
        :pagination="false"
      >
        <template slot="detail" slot-scope="record2">
          <a
            @click="()=>{
              $refs.edit.show(record2)
            }"
          >more</a>
        </template>
        <template slot="is_pink" slot-scope="record2">
          <div v-if="record2.is_pink == '1'">是</div>
          <div v-else>否</div>
        </template>
        <template slot="quantity" slot-scope="record2">
          <div v-if="record2.quantity != ''">{{record2.quantity}}m²</div>
          <div v-else></div>
        </template>
        <template slot="delete" slot-scope="record2">
          <a-popconfirm
            v-if="record.status != '5' && record.status != '6' && record.is_po == 0"
            title="delete it？"
            okText="yes"
            cancelText="no"
            @confirm="() => onInnerDelete(record2.id, record2.discount_id)"
          >
            <a-button icon="delete">
              delete
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <template slot="status" slot-scope="record">
        <span v-if="record.is_po == 0">
          <a-tag color="blue">
            未出单
          </a-tag>
        </span>
        <span v-else>
          <a-tag color="green">
            已出单
          </a-tag>
        </span>
      </template>
      <template slot="action" slot-scope="record">
        <a-button icon="tool" @click.stop="()=>{
            $refs.tool.showModal(record)
          }"
        >
          tool
        </a-button>

        <a-button icon="ellipsis" @click.stop="()=>{
            $refs.edit.show(record)
          }"
        >
          more
        </a-button>

        <a-popconfirm
          v-if="record.status != '5' && record.status != '6' && record.is_po == 0"
          title="Delete it？"
          okText="yes"
          cancelText="no"
          @confirm="() => onDelete(record.id)"
        >
          <a-button icon="delete" @click.stop="" >
            delete
          </a-button>
        </a-popconfirm>
      </template>
      <template slot="plus" slot-scope="record">
        <a-icon v-if="expandedRowKeys[0] == record.id" type="minus-square" />
        <a-icon v-else type="plus-square" />
      </template>
      <template slot="contact" slot-scope="record">
        {{record.clientele_contact}}: {{record.tel}}
      </template>
    </a-table>

    <editProductNew ref="editProductNew" @done="continueAdd()" @close="beforeGetTableData()"></editProductNew>
    <editProduct ref="editProduct" @done="getTableData(pagination_item.current, pagination_item.pageSize)"></editProduct>
    <newProduct ref="newProduct"  @done="getTableData(pagination_item.current, pagination_item.pageSize)"></newProduct>
    <newNote ref="newNote" @done="newProductDone()"></newNote>
    <edit ref="edit" @done="getTableData(1, 10)"></edit>
    <pdf ref="pdf"></pdf>
    <tool
      ref="tool"
      @pdf="(record)=>{
        $refs.pdf.show(record)
      }"
      @new="(record)=>{
        $refs.newProduct.show(record.id, record.invoice_id)
      }"
    ></tool>
  </div>
</template>
<script>
import { r_delivery_note_product, d_delivery_note_product } from "@/api/delivery_note_product.js";
import { r_delivery_note, d_delivery_note } from "@/api/delivery_note.js";
import newNote from "./new.vue";
import edit from "./edit.vue";
import pdf from "./pdf.vue";
import newProduct from "../deliveryNoteProduct/new.vue";
import editProduct from "../deliveryNoteProduct/edit.vue";
import editProductNew from "../deliveryNoteProduct/editToNew.vue";
import tool from "./tool.vue";

export default {
  inject: ['reload'],
  props: [ 'screenwidth' ],
  data() {
    this.components = {
      header: {
        cell: (h, props, children) => {
          const { key, ...restProps } = props
          const col = this.columns.find(col => {
            const k = col.dataIndex || col.key
            return k === key
          })
          if (!col || !col.width) {
            return h('th', { ...restProps }, [...children])
          }
          const dragProps = {
            key: col.dataIndex || col.key,
            class: 'table-draggable-handle',
            attrs: {
              w: 10,
              x: col.width,
              z: 1,
              axis: 'x',
              draggable: true,
              resizable: false
            },
            on: {
              dragging: (x, y) => {
                console.log(col.dataIndex)
                col.width = Math.max(x, 1)
              }
            }
          }
          const drag = h('vue-draggable-resizable', { ...dragProps })
          return h('th', { ...restProps, class: 'resize-table-th' }, [...children, drag])
        }
      }
    }
    this.components2 = {
      header: {
        cell: (h, props, children) => {
          console.log(h, props, children)
          const { key, ...restProps } = props
          const col = this.subColumns.find(col => {
            const k = col.dataIndex || col.key
            return k === key
          })
          if (!col || !col.width) {
            return h('th', { ...restProps }, [...children])
          }
          const dragProps = {
            key: col.dataIndex || col.key,
            class: 'table-draggable-handle',
            attrs: {
              w: 10,
              x: col.width,
              z: 1,
              axis: 'x',
              draggable: true,
              resizable: false
            },
            on: {
              dragging: (x, y) => {
                console.log(col.dataIndex)
                col.width = Math.max(x, 1)
              }
            }
          }
          const drag = h('vue-draggable-resizable', { ...dragProps })
          return h('th', { ...restProps, class: 'resize-table-th' }, [...children, drag])
        }
      }
    }
    return {
      expandedRowKeys: [],
      innerData: [],
      tableData: [],
      dataSource: [],
      columns: [],
      subColumns: [],
      search: "",
      onTableLoading: false,
      pagination_item: {
        pageSize: 10,
        total: 0,
        current: 1,
        onChange: (page, pageSize) => this.changePage(page, pageSize)
      },
      invoiceid: 0,
      invoice: "",
      scroll: {},
      new_Note: 0,
      new_invoive: 0
    };
  },
  components: { 
    newNote, edit, pdf,
    newProduct,
    editProduct,
    editProductNew,
    tool
  },
  created() {
    this.func_width(this.screenwidth);

    this.subColumns = [
      { title: "no", width: 100, dataIndex: "id",
        sorter: (a, b) => {
          return (b.id.length - a.id.length) == 0?(b.id>a.id):(b.id.length - a.id.length)
        }
      },
      { title: "size", width: 100, dataIndex: "size" },
      { title: "type", width: 100, dataIndex: "type" },
      { title: "code", width: 100, dataIndex: "code" },
      { title: "plate number", width: 100, dataIndex: "plate_number" },
      { title: "quantity", width: 100, key: 'quantity', scopedSlots: { customRender: "quantity" } },
      // { width: "100px", scopedSlots: { customRender: "detail" } },
      { key: 'delete', scopedSlots: { customRender: "delete" } }
    ]
  },
  mounted() {
    this.$nextTick(function () {
      this.invoiceid = this.$route.params.invoiceid;
      this.invoice = this.$route.params.invoice;
      console.log(this.invoice, 111,sessionStorage.deliveryclose == -1)
      if(this.invoiceid == undefined || this.invoiceid == 0 || sessionStorage.deliveryclose == -1){
        this.invoiceid = 0;
      }

      this.getTableData(1, 10);
    })
  },
  watch: {
    screenwidth(val){
      this.func_width(val);
    }
  },
  methods: {
    func_width(val){
      this.scroll = val<1209?{ x: 1075 }:{};
      if(val < 1638){
          this.columns = [
            { width: 50, scopedSlots: { customRender: "plus" } },
            { title: "P.O. No", width: 100, dataIndex: "invoice_no",
              sorter: (a, b) => {
                return (b.invoice_no.length - a.invoice_no.length) == 0?(b.invoice_no>a.invoice_no):(b.invoice_no.length - a.invoice_no.length)
              },
            },
            { title: "Contact", key: 'contact', width: 200, scopedSlots: { customRender: "contact" } },
            { title: "Delivery Date", width: 150, dataIndex: "note_date",
              sorter: (a, b) => {
                return b.note_date > a.note_date
              }
            },
            { title: "Plate No", width: 100, dataIndex: "note_plate_no" },
            { title: "Status", key: 'status', width: 100, scopedSlots: { customRender: "status" } },
            { key: 'action', width: 300, scopedSlots: { customRender: "action" } }
          ];
      }else {
        this.columns = [
          { width: 50, scopedSlots: { customRender: "plus" } },
          { title: "P.O. No", width: 100, dataIndex: "invoice_no",
            sorter: (a, b) => {
              return (b.invoice_no.length - a.invoice_no.length) == 0?(b.invoice_no>a.invoice_no):(b.invoice_no.length - a.invoice_no.length)
            },
          },
          { title: "Client", width: 100, dataIndex: "name_en" },
          { title: "Contact", key: 'contact', width: 200, scopedSlots: { customRender: "contact" } },
          { title: "Delivery Date", width: 150, dataIndex: "note_date", sorter: (a, b) => {
                return b.note_date > a.note_date
              } },
          { title: "Address", width: 400, dataIndex: "address" },
          { title: "Plate No", width: 100, dataIndex: "note_plate_no" },
          { title: "Status", key: 'status', width: 100, scopedSlots: { customRender: "status" } },
          { key: 'action', width: 300, scopedSlots: { customRender: "action" } }
        ];
      }
    },
    showProduct(item){
      this.expandedRowKeys = [ item ];
      this.getInnerTableData(this.expandedRowKeys[0]);
    },
    showDiscountExpand(expanded, record){
      console.log(expanded)
      if(expanded){
        this.expandedRowKeys = [ record.id ];
        this.getInnerTableData(this.expandedRowKeys[0]);
      }else{
        this.closeProduct();
      }
    },
    closeProduct(){
      this.expandedRowKeys = [ ];
    },
    newProductDone(){
      this.getTableDataNew(1, 10);
    },
    continueAdd(){
      this.showProduct(this.new_Note);
      this.getTableData(this.pagination_item.current, this.pagination_item.pageSize)
      this.$refs.editProductNew.show(this.new_Note, this.new_invoive);
    },
    getInnerTableData(note_id){
      this.innerData = [];
      this.onTableLoading = true;
      r_delivery_note_product(note_id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          this.innerData = res.list;
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("fail error");
        });
    },
    changePage(page, pageSize) {
      this.getTableData(page, pageSize);
    },
    onSearch(val) {
      this.search = val;
      this.getTableData(1, 10);
    },
    beforeGetTableData(){
      this.showProduct(this.new_Note);
      this.getTableData(this.pagination_item.current, this.pagination_item.pageSize)
    },
    clearInvoice(){
      sessionStorage.deliveryclose = -1;
      this.reload();
    },
    productMore(record){
      this.$router.push({name:'home_deliveryNoteProduct',params:{noteid:record.id,invoiceid:record.invoice_id }})
    },
    getTableData(pagenum, size) {
      this.onTableLoading = true;
      r_delivery_note(pagenum, size, this.search, this.invoiceid)
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
          this.$message.error("fail - system error");
        });
    },
    getTableDataNew(pagenum, size) {
      this.onTableLoading = true;
      r_delivery_note(pagenum, size, this.search, this.invoiceid)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;

          this.new_Note = this.dataSource[0].id
          this.new_invoive = this.dataSource[0].invoice_id

          this.pagination_item.pageSize = size;
          this.pagination_item.total = res.total;
          this.pagination_item.current = pagenum;
          console.log(this.pagination_item)
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("fail - system error");
        });
    },
    onDelete(id) {
      this.onTableLoading = true;
      d_delivery_note(id)
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
          this.$message.error("fail - system error");
        });
    },

    onInnerDelete(id, discount_id){
      this.onTableLoading = true;
      d_delivery_note_product(id, discount_id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          if(res.status){
            this.expandedRowKeys = [];
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
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.resize-table-th {
  position: relative;
}
.table-draggable-handle {
  height: 100% !important;
  left: auto !important;
  right: -5px;
  cursor: col-resize;
  touch-action: none;
  border: none;
}
</style>
