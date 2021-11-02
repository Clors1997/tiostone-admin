<template>
  <div>
    <p class="header">
      <span>
        <a-input-search placeholder="PO Number/Project" style="width: 200px" @search="onSearch"/>
        <a-month-picker placeholder="Order Date" @change="onChange" />
      </span>
      <span>
        <a-button type="primary" @click="()=>{
        this.$refs.newFactory.show(status_array)
        }">New</a-button>
      </span>
    </p>
    <p class="header">
      <a-tag v-if="clienteleid != 0" closable @close="clearClient()">
        Relate User： {{clientele}}
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
          slot-scope="record"
          slot="expandedRowRender"
          bordered
          class="mysub"
          :rowKey="record2 => record2.id"
          :columns="subColumns"
          :components="components2"
          :dataSource="record.innerData"
          :pagination="false"
        >
          <template slot="action" slot-scope="record2">
            <a-button icon="ellipsis" @click="()=>{
                $refs.editDiscount.show(record2)
              }"
            >
              more
            </a-button>

            <a-popconfirm
              title="Delete it？"
              okText="yes"
              cancelText="no"
              @confirm="() => onInnerDelete(record2.id, record2.product_id)"
            >
              <a-button icon="delete" >
                delete
              </a-button>
            </a-popconfirm>
          </template>
          <template slot="total" slot-scope="record2">
            {{ parseFloat(record2.discount_total) }}
          </template>
        </a-table>
      <template slot="status" slot-scope="record">
        <a-dropdown>
          <a class="ant-dropdown-link">
            <a-tag :color="status_array_color[record.invoice_status]">{{ record.invoice_status }}<a-icon type="down"/></a-tag>
          </a>
          <a-menu slot="overlay" width="20px;">
            <a-menu-item v-for="(val, key) in can_select_status" :key="key">
              <a
                target="_blank"
                rel="noopener noreferrer"
                @click="change_status(record, val)"
              >
                {{ val }}
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
      <template slot="action" slot-scope="record">
        <a-button icon="tool" @click.stop="()=>{
            $refs.tool.showModal(record)
          }"
        >
          tool
        </a-button>

        <a-button icon="ellipsis" @click.stop="()=>{
            $refs.edit.show(record, can_select_status)
          }"
        >
          more
        </a-button>

        <a-popconfirm
          v-if="tableData.length"
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
      <template slot="time" slot-scope="record">
        {{record.factory_date}} {{record.factory_time}}
      </template>
    </a-table>

    <editDiscount ref="editDiscount" @done="getInnerTableData"></editDiscount>
    <newDiscount ref="newDiscount"  @done="getInnerTableData"></newDiscount>
    <newFactory ref="newFactory" @done="getTableData(pagination_item.current, pagination_item.pageSize)"></newFactory>
    <edit ref="edit" @done="getTableData(pagination_item.current, pagination_item.pageSize)"></edit>
    <pdf ref="pdf" @done="getTableData(pagination_item.current, pagination_item.pageSize)"></pdf>
    <record ref="record" @done="getTableData(pagination_item.current, pagination_item.pageSize)"></record>
    <tool
      ref="tool"
      @pdf="(record)=>{
        $refs.selectDelivery.showModal('', record)
      }"
      @invoice="(record)=>{
        $refs.record.show(record.id)
      }"
      @relate="goToDeliveryNote"
      @new="(record)=>{
        $refs.newDiscount.show(record.id)
      }"
      @deposit="(record)=>{
        $refs.deposit.showModal(record, true)
      }"
      @seedeposit="(record)=>{
        $refs.deposit.showModal(record, false)
      }"
    ></tool>
    <deposit ref="deposit" @done="getTableData(pagination_item.current, pagination_item.pageSize)"></deposit>
    <selectDelivery :selectType="'checkbox'" ref="selectDelivery" @done="selectDeliveryDone"></selectDelivery>
  </div>
</template>
<script>
import { r_invoice, r_invoice_client, u_invoice_status, d_invoice } from "@/api/invoice.js";
import { r_invoice_discount, d_invoice_discount } from "@/api/invoice_discount.js";
import newFactory from "./new.vue";
import newDiscount from "./newDiscount.vue";
import selectDelivery from "@/components/selectDelivery.vue";
import editDiscount from "./editDiscount.vue";
import edit from "./edit.vue";
import pdf from "./pdf.vue";
import tool from "./tool.vue";
import record from "./record.vue";
import deposit from "./deposit.vue";
import moment from 'moment';

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
      moment,
      tableData: [],
      expandedRowKeys: [],
      innerData: [],
      dataSource: [],
      columns: [],
      subColumns: [],
      status_array: [],
      status_array_color: [],
      can_select_status: [],
      search: "",
      search2: "",
      onTableLoading: false,
      pagination_item: {
        pageSize: 10,
        total: 0,
        current: 1,
        onChange: (page, pageSize) => this.changePage(page, pageSize)
      },
      clienteleid: 0,
      clientele: "",
      scroll: { },
    };
  },
  components: { deposit, selectDelivery, newFactory, edit, newDiscount, editDiscount, pdf, record, tool },
  created() {
    this.func_width(this.screenwidth);

    this.subColumns = [
      { title: "Number", width: 100, dataIndex: "show_id" },
      { title: "Size", width: 150, dataIndex: "size" },
      { title: "Type", width: 100, dataIndex: "type" },
      { title: "Code", width: 100, dataIndex: "code" },
      { title: "Quantity", width: 100, dataIndex: "discount_quantity" },
      { title: "Rate", width: 100, dataIndex: "discount_rate" },
      { title: "Delivered", width: 100, dataIndex: "discount_send" },
      { title: "Qty Balance", width: 140, dataIndex: "qty_balance" },
      { title: "Billed", width: 100, dataIndex: "discount_billed" },
      { key:"action", scopedSlots: { customRender: "action" } }
    ]
  },
  mounted() {
    this.$nextTick(function () {
      this.clienteleid = this.$route.params.clienteleid;
      this.clientele = this.$route.params.clientele;
      console.log(this.clienteleid, 111,sessionStorage.invoiceclose == -1)
      if(this.clienteleid == undefined || this.clienteleid == 0 || sessionStorage.invoiceclose == -1){
        this.clienteleid = 0;
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
      this.scroll = val<1500?{ x: 1307 }:{};
        this.columns = [
          { width: 50, scopedSlots: { customRender: "plus" } },
          { title: "Number", width: 100, dataIndex: "show_id" },
          { title: "PO Number", width: 150, dataIndex: "invoice_no",
            sorter: (a, b) => {
              return (b.invoice_no.length - a.invoice_no.length) == 0?(b.invoice_no>a.invoice_no):(b.invoice_no.length - a.invoice_no.length)
            },
          },
          { title: "Project", width: 200, dataIndex: "invoice_project" },
          { title: "Client", width: 200, dataIndex: "name_en" },
          { title: "Order Date", width: 150, dataIndex: "invoice_date" },
          { title: "Status", width: 150, key: 'status', scopedSlots: { customRender: "status" } },
          { key: 'action', width: 300, scopedSlots: { customRender: "action" } }
        ];
    },
    changePage(page, pageSize) {
      this.getTableData(page, pageSize);
    },
    onChange(date, dateString) {
      this.search2 = dateString;
      this.getTableData(1, 10);
    },
    goToDeliveryNote(record){
      sessionStorage.deliveryclose = 1;
      this.$router.push({name:'home_deliveryNote', params:{invoiceid:record.id, invoice:record.invoice_no}})
    },
    selectDeliveryDone(result){
      console.log(result)
      this.$refs.pdf.show(result.record, result.selectedRowKeys, result.deposit)
    },
    clearClient(){
      sessionStorage.invoiceclose = -1;
      this.reload();
    },
    showDiscount(item){
      this.expandedRowKeys = [ item ];
      this.getInnerTableData(this.expandedRowKeys[0]);
    },
    showDiscountExpand(expanded, record){
      console.log(expanded)
      if(expanded){
        this.expandedRowKeys.push(record.id);
        this.getInnerTableData(record.id);
      }else{
        this.closeDiscount(record.id);
      }
    },
    closeDiscount(id){
      let index = this.expandedRowKeys.findIndex((item, index) => {
        return item == id;
      })
      this.expandedRowKeys.splice(index, 1)
    },
    onSearch(val) {
      this.search = val;
      this.getTableData(1, 10);
    },
    getTableData(pagenum, size) {
      this.expandedRowKeys = [ ];
      this.onTableLoading = true;

      if(this.clienteleid != undefined && this.clienteleid != 0){
        r_invoice_client(pagenum, size, this.search, this.search2, this.clienteleid)
          .then(res => {
            console.log(res);

            this.onTableLoading = false;
            this.tableData = res.list;
            this.dataSource = res.list;
            this.status_array = res.array_status;
            this.can_select_status = res.can_select_status;
            this.status_array_color = res.array_status_color;

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
      }else{
        r_invoice(pagenum, size, this.search, this.search2)
          .then(res => {
            console.log(res);

            this.onTableLoading = false;
            this.tableData = res.list;
            this.dataSource = res.list;
            this.status_array = res.array_status;
            this.status_array_color = res.array_status_color;
            this.can_select_status = res.can_select_status;

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
      }
    },
    getTableDataNew(pagenum, size) {
      this.onTableLoading = true;

      if(this.clienteleid != undefined && this.clienteleid != 0){
        r_invoice_client(pagenum, size, this.search, this.search2, this.clienteleid)
          .then(res => {
            console.log(res);

            this.onTableLoading = false;
            this.tableData = res.list;
            this.dataSource = res.list;
            this.status_array = res.array_status;
            this.can_select_status = res.can_select_status;
            this.status_array_color = res.array_status_color;

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
      }else{
        r_invoice(pagenum, size, this.search, this.search2)
          .then(res => {
            console.log(res);

            this.onTableLoading = false;
            this.tableData = res.list;
            this.dataSource = res.list;
            this.status_array = res.array_status;
            this.status_array_color = res.array_status_color;
            this.can_select_status = res.can_select_status;

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
      }

    },
    getInnerTableData(invoice_id) {
      console.log(invoice_id);
      this.innerData = [];
      this.onTableLoading = true;
      r_invoice_discount(invoice_id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;

          let index = this.tableData.findIndex((item, index) => {
            return item.id == invoice_id;
          })
          this.$set(this.tableData[index], 'innerData', res.list)
          console.log(this.innerData, this.tableData)
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("fail - system error");
        });
    },
    change_status(record, value){
      this.onTableLoading = true;
      u_invoice_status(
        record.id, value
      )
        .then(res => {
          console.log(res);
          this.onTableLoading = false;
          this.getTableData(this.pagination_item.current, this.pagination_item.pageSize);
        })
        .catch(err => {
          this.onTableLoading = false;
          this.$message.error("fail - system error - " + err);
        });
    },
    onDelete(id) {
      this.onTableLoading = true;
      d_invoice(id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          if(res.status){
            this.expandedRowKeys = [];
            this.$message.success("success");
            this.getTableData(1, 10);
          }else{
            this.$message.error("fail - this P.O. had used");
          }
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("fail - system error");
        });
    },
    onInnerDelete(id, product_id) {
      this.onTableLoading = true;
      d_invoice_discount(id, product_id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          if(res.status){
            this.expandedRowKeys = [];
            this.$message.success("success");
            this.getTableData(1, 10);
          }else{
            this.$message.error("fail - " + res.msg);
          }
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("fail - system error");
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
.mysub {
  background: #F0F0F0 !important;

}
.mysub .ant-table-thead > tr > th {
  background: #F0F0F0 !important;
}
</style>
