<template>
  <div>
    <a-modal
      title="Plate information group"
      :visible="visible"
      @cancel="onClose"
      :confirm-loading="onSubmiting"
    >
      <div class="new-pmaster-modal">
        <a-row>
          <a-col>
            <p class="item" v-for="(item, key) in array_car" :key="key">
              <span class="label">car{{key+1}}</span>
              <a-input :maxLength="10" type="text" v-model="array_car[key]" oninput="value=value.replace(/[^a-zA-Z0-9]/g, '')">
                <a-icon type="close" slot="addonAfter" @click="delCar(key)"/>
              </a-input>
            </p>
            <p class="item" v-if="array_car.length == 0">empty</p>
          </a-col>
        </a-row>
      </div>
      <template slot="footer" >
        <a-button :loading="onSubmiting" @click="addNewCar">add car</a-button>
        <a-popconfirm
          :disabled="onSubmiting"
          title="Please check plate info"
          okText="yes"
          cancelText="no"
          @confirm="() => submit_validation()"
        >
          <a-button type="primary" :loading="onSubmiting">Submit</a-button>
        </a-popconfirm>
      </template>
    </a-modal>

    <selectPlate ref="selectPlate" :selectType="'radio'" @done="onSelect"></selectPlate>
  </div>
</template>
<script>
import { u_clientele_plate } from "@/api/clientele.js";
import selectPlate from "@/components/selectPlate.vue"

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      array_car: [],
      submit_array_car: [],
      id: ""
    };
  },
  components: {selectPlate},
  methods: {
    show(array_car, id) {
      this.visible = true;
      this.array_car = array_car;
      this.id = id;
      console.log(this.array_car, array_car)
    },
    onSelect(e) {
      console.log(e);
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        this.$set(this.array_car, this.array_car.length-1, e.list[e.selectedRowKeys[0]].plate_num);
      }
    },
    addNewCar(){
      this.$refs.selectPlate.showModal();
      if(this.array_car.length<10){
        this.array_car.push("");
      }else{
        this.$message.info("max car number:10");
      }
    },
    delCar(key){
      let temp_array_car = [];

      for (let key1 in this.array_car) {
        if(key1 != key){
          temp_array_car.push(this.array_car[key1]);
        }else{
          continue;
        }
      }

      this.array_car = temp_array_car;

    },
    submit_validation() {
      this.submit_array_car = [];
      for (let key1 in this.array_car) {
        let temp_number = this.array_car[key1].replace(/\s/g, "");
        if(temp_number != ''){
          this.submit_array_car.push(temp_number);
        }else{
          continue;
        }
      }

      console.log( this.submit_array_car)

      this.onSubmiting = true;
        u_clientele_plate(this.submit_array_car, this.id)
          .then(res => {
            console.log(res);
            if (res.status) {
              this.$message.success("success");
              this.visible = false;
              this.onSubmiting = false;
              this.$emit("done", {});
            } else {
              this.onSubmiting = false;
              this.$message.error("failed - "+res.msg);
            }
          })
          .catch(err => {
            this.onSubmiting = false;
            this.$message.error("failed - system error");
          });
    },
    onClose(e) {
      this.visible = false;
    },
  }
};
</script>
