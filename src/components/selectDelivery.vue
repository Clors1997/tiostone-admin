<template>
  <span>
    <a-modal title="select Delivery Note" v-model="visible" width="1200px" :footer="null">
      <p class="header">
        <span>
          <a-input-search placeholder="Contact/Contact Tel" style="width: 200px" @search="onSearch"/>
        </span>
        <span>
        </span>
      </p>
      <a-table
        bordered
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          type:this.selectType
        }"
        :customRow="setRow"
        :rowKey="record => record.id"
        :components="components"
        :expandIconAsCell="false"
        :expandIconColumnIndex="-1"
        :columns="columns"
        :pagination="false"
        :expandRowByClick="true"
        :expandedRowKeys="expandedRowKeys"
        :dataSource="tableData"
        :loading="onTableLoading"
        @expand="showDiscountExpand"
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
          <template slot="is_pink" slot-scope="record2">
            <div v-if="record2.is_pink == '1'">是</div>
            <div v-else>否</div>
          </template>
          <template slot="quantity" slot-scope="record2">
            <div v-if="record2.quantity != ''">{{record2.quantity}}m²</div>
            <div v-else></div>
          </template>
        </a-table>
        <template slot="contact" slot-scope="record">
          {{record.clientele_contact}}: {{record.tel}}
        </template>
      </a-table>
      <p style="margin:0;text-align:left;margin-top: 20px;">
        <b>Deposit(max: {{record.deposit}}):</b>
        <a-input-number
        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/(,*)/g, '')"
        size="large" :min="0" :max="parseFloat(record.deposit)" style="width: 300px" :precision="2" :step="0.01" v-model="deposit"/>
      </p>
      <p style="margin:0;text-align:right;margin-top: 20px;">
        <a-button type="primary" @click="onSure">Confirm</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { r_invoice_discount_by_dn } from "@/api/invoice_discount.js";
import { r_delivery_note_product } from "@/api/delivery_note_product.js";
import { r_delivery_note } from "@/api/delivery_note.js";
import Vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'

Vue.component('vue-draggable-resizable', VueDraggableResizable)

export default {
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
      expandedRowKeys: [],
      innerData: [],
      tableData: [],
      dataSource: [],
      columns: [],
      subColumns: [],
      search: "",
      invoiceid: "",
      record: {},
      visible: false,
      selectedRowKeys: [], // Check here to configure the default column
      onTableLoading: false,
      context: "",
      pagination_item: {
        pageSize: 10,
        total: 0,
        current: 1,
        onChange: (page, pageSize) => this.changePage(page, pageSize)
      },
      deposit: 0
    };
  },
  props: ["selectType"],
  created() {
    this.columns = [
      { title: "P.O. No", width: 100, dataIndex: "invoice_no",
        sorter: (a, b) => {
          return (b.invoice_no.length - a.invoice_no.length) == 0?(b.invoice_no>a.invoice_no):(b.invoice_no.length - a.invoice_no.length)
        },
      },
      { title: "Contact", key: 'contact', width: 200, scopedSlots: { customRender: "contact" } },
      { title: "Delivery Date", width: 150, dataIndex: "note_date" },
      { title: "Address", width: 100, dataIndex: "address" },
      { title: "Plate No", dataIndex: "note_plate_no" },
    ];

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
      { title: "quantity", key: 'quantity', scopedSlots: { customRender: "quantity" } },
    ]
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  methods: {
    changePage(page, pageSize) {
      this.getTableData(page, pageSize);
    },
    showProduct(item){
      this.expandedRowKeys = [ item ];
      this.getInnerTableData(this.expandedRowKeys[0]);
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
    getTableData(pagenum, size) {
      this.onTableLoading = true;
      r_delivery_note(pagenum, size, this.search, this.invoiceid)
        .then(res => {
          console.log(res);
          res.list.forEach(item => {
            this.$set(item, "key", parseInt(item.id));
          });
          res.list = res.list.filter(function(item){
            return item.is_po == 0
          })

          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;

          this.pagination_item.pageSize = size;
          this.pagination_item.total = res.total;
          this.pagination_item.current = pagenum;
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("fail - system error");
        });
    },
    showModal(context, record) {
      this.context = context || "";
      this.invoiceid = record.id;
      this.record = record;
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
      if(this.selectedRowKeys.length == 0){
        this.$message.info("There no select item");
        return false;
      }
      r_invoice_discount_by_dn(this.invoiceid, this.selectedRowKeys)
        .then(res => {
          console.log(res);
          res.list = res.list.filter(function(item){
            return item.discount_send != 0
          })
          let total = 0;
          for (let key in res.list) {
            total += parseFloat(res.list[key].discount_send) * parseFloat(res.list[key].discount_rate)
          }
          if(this.deposit > total){
            this.$message.info("Deposit is greater than total("+total+")");
            return false
          }

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
            record: this.record,
            context: this.context,
            selectedRowKeys: this.selectedRowKeys,
            list,
            deposit: this.deposit
          });
          this.deposit = 0;

        })
        .catch(err => {
          console.log(err.message)
          this.$message.error("fail - system error");
        });
    },
    onSearch(val) {
      this.search = val;
      this.getTableData(1, 10);
    }
  }
};
</script>
