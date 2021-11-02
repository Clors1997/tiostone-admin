<template>
  <a-modal
    title="record panel"
    :visible="visible"
    :width="1000"
    @cancel="close()"
    :footer="null"
  >
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
    >
      <a-table
        slot="expandedRowRender"
        bordered
        :rowKey="record2 => record2.id"
        :columns="subColumns"
        :components="components2"
        :dataSource="innerData"
        :pagination="false"
      >
      </a-table>
    </a-table>
  </a-modal>
</template>
<script>
import { r_discount_record, r_discount_record_product } from "@/api/discount_record.js";

export default {
  data(){
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
      columns: [],
      tableData: [],
      dataSource: [],
      expandedRowKeys: [],
      subColumns: [],
      innerData: [],
      onTableLoading: false,
      pagination_item: {
        pageSize: 10,
        total: 0,
        current: 1,
        onChange: (page, pageSize) => this.changePage(page, pageSize)
      },
      visible: false,
      invoice_id: 0
    }
  },
  created() {
    this.columns = [
      { title: "PO Number", width: 100, dataIndex: "invoice_no" },
      { title: "Deposit", width: 100, dataIndex: "deposit" },
      { title: "Num", width: 100, dataIndex: "record_num" },
      { title: "Date", width: 150, dataIndex: "record_date" },
      { title: "Total(HKD $)", dataIndex: "record_total" },
    ];
    this.subColumns = [
      { title: "Index", width: 100, dataIndex: "id" },
      { title: "Item Number", width: 150, dataIndex: "discount_id" },
      { title: "Quantity", width: 150, dataIndex: "record_quantity" },
      { title: "Rate(HKD $)", width: 150, dataIndex: "record_single_rate" },
      { title: "Item Total(HKD $)", dataIndex: "record_single_total" },
    ]
  },
  methods: {
    show(invoice_id){
      this.invoice_id = invoice_id;

      this.getTableData(1, 10);
    },
    changePage(page, pageSize) {
      this.getTableData(page, pageSize);
    },
    showDiscountExpand(expanded, record){
      console.log(expanded)
      if(expanded){
        this.expandedRowKeys = [ record.id ];
        this.getInnerTableData(record.invoice_id, record.record_num);
      }else{
        this.closeItem();
      }
    },
    closeItem(){
      this.expandedRowKeys = [ ];
    },
    getTableData(pagenum, size) {
        this.onTableLoading = true;
        r_discount_record(pagenum, size, this.invoice_id)
          .then(res => {
            this.onTableLoading = false;
            this.tableData = res.list;
            this.dataSource = res.list;
            console.log(this.dataSource)

            this.pagination_item.pageSize = size;
            this.pagination_item.total = res.total;
            this.pagination_item.current = pagenum;
            console.log(this.pagination_item)

            this.visible = true;
          })
          .catch(err => {
            if(err.message.includes('undefined')){
              this.$message.error("fail - system error");
            }
          });
    },
    getInnerTableData(invoice_id, record_num) {
      console.log(invoice_id, record_num);
      this.innerData = [];
      this.onTableLoading = true;
      r_discount_record_product(invoice_id, record_num)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          this.innerData = res.list;
          console.log(this.innerData)
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("fail - system error");
        });
    },
    close(){
      this.visible = false;
      this.$emit("done");
    }
  }
};
</script>
<style scoped>
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
