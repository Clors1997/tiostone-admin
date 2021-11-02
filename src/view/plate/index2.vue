<template>
  <div>
    <p class="header">
      <a-input-search placeholder="Plate No" style="width: 200px" @search="onSearch"/>
      <span>
        <a-button type="primary" @click="visible = true">New</a-button>
      </span>
    </p>
    <a-table
      bordered
      :rowKey="record => record.id"
      :pagination="pagination_item"
      :components="components"
      :columns="columns"
      :dataSource="tableData"
      :loading="onTableLoading"
      :scroll="scroll"
    >
      <template slot="action" slot-scope="record">
        <a-popconfirm
          title="delete it？"
          okText="yes"
          cancelText="no"
          @confirm="() => onDelete(record.id)"
        >
          <a-button icon="delete" >
            Delete
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>

    <a-modal
      title="New Plate"
      :visible="visible"
      @ok="handleOk"
      okText="Confirm"
      :confirmLoading="confirmLoading"
      cancelText="Cancel"
      @cancel="close"
    >
        Plate No： <a-input type="text" v-model="newName"/>
      <br/>
    </a-modal>
  </div>
</template>
<script>
import { r_plate_no, c_plate_no, d_plate_no } from "@/api/plate.js";

export default {
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
      visible: false,
      newName: '',
      confirmLoading: false,
      scroll: {}
    };
  },
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
    handleOk() {
      this.confirmLoading = true
      c_plate_no({
        form_data: {
          plate_no: this.newName
        }
      })
        .then(res => {
          console.log(res);
          this.confirmLoading = false
          if(res.rc == 0) {
            this.$message.success(res.msg);
            this.getTableData(1, 10)
            this.visible = false
          }else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err.message)
          this.confirmLoading = false;
          this.$message.error("網絡請求超時");
        });
    },
    close() {
      this.visible = false
      this.newName = ''
    },
    func_width(val){
      this.scroll = val<1330?{ x: 1282 }:{};
      this.columns = [
        { title: "No", width: 100, dataIndex: "id" },
        { title: "Plate No", width: 150, dataIndex: "plate_no" },
        { title: "Create time", width: 150, dataIndex: "ctime" },
        { key:"action", width: 400, scopedSlots: { customRender: "action" } }
      ];
    },
    changePage(page, pageSize) {
      this.getTableData(page, pageSize);
    },
    goToInvoice(record){
      sessionStorage.invoiceclose = 1;
      this.$router.push({name:'home_invoice', params:{clienteleid:record.id, clientele: record.name_zh}})
    },
    onSearch(val) {
      this.search = val;
      this.getTableData(1, 10);
    },
    getTableData(pagenum, size) {
      this.onTableLoading = true;
      r_plate_no(pagenum, size, this.search)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          this.tableData = res.data;
          this.dataSource = res.data;

          this.pagination_item.pageSize = size;
          this.pagination_item.total = res.total;
          this.pagination_item.current = pagenum;
          console.log(this.pagination_item)
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("system error");
        });
    },
    onDelete(id) {
      this.onTableLoading = true;
      d_plate_no(id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          if(res.rc == 0){
            this.$message.success("delete success");
            this.getTableData(1, 10);
          }else{
            this.$message.error("delete failed");
          }
        })
        .catch(err => {
          console.log(err.message)
          this.onTableLoading = false;
          this.$message.error("system error");
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
</style>
