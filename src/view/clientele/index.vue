<template>
  <div>
    <p class="header">
      <a-input-search placeholder="company name/tel" style="width: 200px" @search="onSearch"/>
      <span>
        <a-button type="primary" @click="()=>{
        this.$refs.newClientele.show()
        }">New</a-button>
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
        <!-- <a-button icon="tool" @click.stop="()=>{
            $refs.tool.showModal(record)
          }"
        >
          Tool
        </a-button> -->
        <a-button @click="goToInvoice(record)">
          Relate P.O.
        </a-button>

        <a-button icon="ellipsis" @click="()=>{
            $refs.edit.show(record)
          }"
        >
          More
        </a-button>
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
<!--      <template slot="plateInfo" slot-scope="record">
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            Tool <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a
              @click="()=>{
                $refs.plateNo.show(record.plate_number_group, record.id)
              }">Relate Plate</a>
            </a-menu-item>
            <a-menu-item>
              <a
              @click="goToInvoice(record)">Relate P.O.</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template> -->
      <template slot="tel" slot-scope="record">
        {{record.tel}}<br/>{{record.tel2}}
      </template>
    </a-table>

    <newClientele ref="newClientele" @done="getTableData(1, 10)"></newClientele>
    <edit ref="edit" @done="getTableData(1, 10)"></edit>
  </div>
</template>
<script>
import { r_clientele, d_clientele } from "@/api/clientele.js";
import newClientele from "./new.vue";
import plateNo from "./plateNo.vue";
import edit from "./edit.vue";
import tool from "./tool.vue";

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
      scroll: {}
    };
  },
  components: { newClientele, edit, plateNo, tool },
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
      this.scroll = val<1330?{ x: 1282 }:{};
      if(val < 1330){
          this.columns = [
            { title: "Client No", width: 100, dataIndex: "clientele_no" },
            { title: "Company Name", width: 150, dataIndex: "name_en" },
            { title: "Address", width: 400, dataIndex: "address", ellipsis: true },
            { key:"action", width: 400, scopedSlots: { customRender: "action" } }
          ];
      }else {
        this.columns = [
          { title: "Client No", width: 100, dataIndex: "clientele_no" },
          { title: "Company Name", width: 150, dataIndex: "name_en" },
          { title: "Tel", key:"tel", width: 150, scopedSlots: { customRender: "tel" } },
          { title: "Address", width: 400, dataIndex: "address", ellipsis: true },
          { key:"action", width: 400 , scopedSlots: { customRender: "action" } }
        ];
      }
    },
    changePage(page, pageSize) {
      this.getTableData(page, pageSize);
    },
    goToInvoice(record){
      sessionStorage.invoiceclose = 1;
      this.$router.push({name:'home_invoice', params:{clienteleid:record.id, clientele: record.name_en}})
    },
    onSearch(val) {
      this.search = val;
      this.getTableData(1, 10);
    },
    getTableData(pagenum, size) {
      this.onTableLoading = true;
      r_clientele(pagenum, size, this.search)
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
      d_clientele(id)
        .then(res => {
          console.log(res);

          this.onTableLoading = false;
          if(res.status){
            this.$message.success("刪除成功");
            this.getTableData(1, 10);
          }else{
            this.$message.error("删除失败 - 該客戶已被使用");
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
