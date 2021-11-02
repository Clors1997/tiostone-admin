<template>
      <div style="width: 100%">
          </a-radio-button>
        </a-radio-group>
        <a-tabs
          default-active-key="1"
          :tab-position="'top'"
          @change="callback"
        >
          <a-tab-pane v-for="(item, i) in array_car_team" :key="i" :tab="item.team_name_temp">
            <p class="item " style="max-width: 400px;">
              <span class="label required">Team Name</span>
              <a-input :maxLength="250" type="text" v-model="array_car_team[i].team_name">
              </a-input>
            </p>
            <p class="item" style="max-width: 400px;" v-for="(item2, key) in item.plate_number_group" :key="key">
              <span class="label">car{{key+1}}</span>
              <a-input :maxLength="10" type="text" v-model="array_car_team[i].plate_number_group[key]" oninput="value=value.replace(/[^a-zA-Z0-9]/g, '')">
                <a-icon type="close" slot="addonAfter" @click="delCar(key)"/>
              </a-input>
            </p>
            <a-empty style="margin: 100px auto;" v-if="item.plate_number_group.length == 0">
              <span slot="description"> empty </span>
            </a-empty>

            <a-popconfirm
              style="float: right;margin-top: -30px;"
              :disabled="onSubmiting"
              title="Please check agant"
              okText="yes"
              cancelText="no"
              @confirm="() => submit_validation(i)"
            >
              <a-button type="primary" :loading="onSubmiting">Submit</a-button>
            </a-popconfirm>
          </a-tab-pane>

          <a-dropdown slot="tabBarExtraContent">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="addTeam()"> New Team </a-menu-item>
              <a-menu-item key="2" @click="delTeam()"> Delete Team </a-menu-item>
              <a-menu-item key="3" @click="addNewCar()"> New Car number </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> Tool <a-icon type="down" /> </a-button>
          </a-dropdown>
        </a-tabs>

        <a-modal
          title="New Team"
          :visible="visible"
          @ok="handleOk"
          okText="yes"
          :confirmLoading="confirmLoading"
          cancelText="no"
          @cancel="close"
        >
            Team Name： <a-input type="text" v-model="newName"/>
          <br/>
        </a-modal>
      </div>
</template>
<script>
import { r_plate_team, u_plate_number, c_plate_team, d_plate_team } from "@/api/plate.js";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      confirmLoading: false,
      array_car_team: [],
      submit_info: [],
      now_id: 0,
      newName: ""
    };
  },
  created() {
    this.getPlateData();
  },
  methods: {
    callback(val) {
      this.now_id = val;
    },
    show(array_car, id) {
      this.array_car = [ "1111", "2222222"];
      this.id = id;
      console.log(this.array_car, array_car)


    },
    addNewCar(){
      if(this.array_car_team[this.now_id].plate_number_group.length<10){
        this.array_car_team[this.now_id].plate_number_group.push("");
      }else{
        this.$message.info(this.array_car_team[this.now_id].team_name+" can't add new");
      }
    },
    delCar(key){
      let temp_array_car = [];
      console.log(key)
      for (let key1 in this.array_car_team[this.now_id].plate_number_group) {
        if(key1 != key){
          temp_array_car.push(this.array_car_team[this.now_id].plate_number_group[key1]);
        }else{
          continue;
        }
      }

      this.array_car_team[this.now_id].plate_number_group = temp_array_car;

    },
    getPlateData(){
      r_plate_team()
        .then(res => {
          console.log(res);
          this.array_car_team = res.list;
        })
        .catch(err => {

        });
    },
    submit_validation(i) {
      if(this.array_car_team[i].team_name.trim() == ''){
        this.$message.info("Team Name is empty");
        return false;
      }
      Object.assign(this.submit_info, this.array_car_team[i]);

      console.log(this.submit_info)

      this.onSubmiting = true;
        u_plate_number(this.submit_info)
          .then(res => {
            console.log(res);
            if (res.status) {
              this.$message.success("success");
              this.onSubmiting = false;
              this.getPlateData();
            } else {
              this.onSubmiting = false;
              this.$message.error("fail - "+res.msg);
            }
          })
          .catch(err => {
            this.onSubmiting = false;
            this.$message.error("fail - system error");
          });
    },
    addTeam(){
      this.visible = true;
      this.newName = "";

    },
    delTeam(){
      let that = this;
      this.$confirm({
          content: 'Delete it?',
          okText: "yes",
          onOk() {
            return new Promise((resolve, reject) => {
              d_plate_team(that.now_id)
                .then(res => {
                  if(res.status){
                    that.$message.success("success");
                  }else{
                    that.$message.error("fail");
                  }
                  resolve();
                  this.getPlateData();
                })
                .catch(err => {
                  that.confirmLoading = false;
                  reject();
                  that.$message.error("fail - system error");
                });
            }).catch(() => console.log('errors!'));

          },
          cancelText: 'no',
          onCancel() {
          },
        });
    },
    close(){
      this.visible = false;
    },
    handleOk(){
      this.confirmLoading = true;
      c_plate_team(this.newName, sessionStorage.user_id)
        .then(res => {
          console.log(res);
          if (res.status) {
            this.$message.success("success");
            this.confirmLoading = false;
            this.visible = false;
            this.getPlateData();
          } else {
            this.confirmLoading = false;
            this.$message.error("fail - "+res.msg);
          }
        })
        .catch(err => {
          this.confirmLoading = false;
          this.$message.error("fail - system error");
        });

    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
}
</style>
