<template>
  <a-drawer
    title="New Client Panel"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
    width="600px"
  >
    <a-form-model
      ref="clientele"
      :model="info"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="Client No" prop="clientele_no">
        <a-input v-model.number="info.clientele_no" :maxLength="60" />
      </a-form-model-item>
      <a-form-model-item label="Company Name(en)" prop="name_en">
        <a-input v-model="info.name_en" />
      </a-form-model-item>
      <a-form-model-item label="Company Name(zh)" prop="name_zh">
        <a-input v-model="info.name_zh" />
      </a-form-model-item>
      <a-form-model-item label="Tel1" prop="tel">
        <a-input v-model="info.tel" />
      </a-form-model-item>
      <a-form-model-item label="Tel2" prop="tel2">
        <a-input v-model="info.tel2" />
      </a-form-model-item>
      <a-form-model-item label="Address" prop="address">
        <a-input v-model="info.address" />
      </a-form-model-item>
      <a-form-model-item label="Contact" prop="clientele_contact">
        <a-input v-model="info.clientele_contact" />
      </a-form-model-item>
      <a-form-model-item label="Email" prop="email">
        <a-input v-model="info.email" />
      </a-form-model-item>
      <a-form-model-item label="Fax" prop="fax">
        <a-input v-model="info.fax" />
      </a-form-model-item>
    </a-form-model>
    <p style="text-align:right">
      <a-button type="primary" :loading="onSubmiting" @click="submit_validation"
        >submit</a-button
      >
    </p>
  </a-drawer>
</template>
<script>
import { isHasVal } from '@/utils/validate'
import { c_clientele, r_last_no } from '@/api/clientele.js'
export default {
  data() {
    let checkPending;
    let checkNo = (rule, value, callback) => {
      clearTimeout(checkPending);
      if (!value) {
        return callback(new Error('Please input No'));
      }
      checkPending = setTimeout(() => {
        console.log(value)
        if (!Number.isInteger(value)) {
          callback(new Error('Please input digits'));
        } else {
          if (value < 10000) {
            callback(new Error('No must be greater than 10000'));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 17, offset: 1 },
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        clientele_no: '',
        name_zh: '',
        name_en: '',
        tel: '',
        tel2: '',
        clientele_contact: '',
        email: '',
        created_by: '',
        fax: '',
        address: '',
      },
      rules: Object.freeze({
        clientele_no: [
          { validator: checkNo, trigger: 'change' }
        ],
        name_en: [
          {
            required: true,
            message: 'Please input this item',
            trigger: 'blur',
          },
          {
            max: 255,
            message: 'Length should be less than 250',
            trigger: 'blur',
          },
        ],
        name_zh: [
          {
            max: 255,
            message: 'Length should be less than 250',
            trigger: 'blur',
          },
        ],
        tel: [
          {
            required: true,
            message: 'Please input this item',
            trigger: 'blur',
          },
          {
            max: 60,
            message: 'Length should be less than 60',
            trigger: 'blur',
          },
        ],
        tel2: [
          {
            max: 60,
            message: 'Length should be less than 60',
            trigger: 'blur',
          },
        ],
        address: [
          {
            required: true,
            message: 'Please input this item',
            trigger: 'blur',
          },
          {
            max: 510,
            message: 'Length should be less than 510',
            trigger: 'blur',
          },
        ],
        clientele_contact: [
          {
            max: 255,
            message: 'Length should be less than 255',
            trigger: 'blur',
          },
        ],
        email: [
          {
            max: 60,
            message: 'Length should be less than 60',
            trigger: 'blur',
          },
        ],
        fax: [
          {
            max: 120,
            message: 'Length should be less than 120',
            trigger: 'blur',
          },
        ],
      }),
    }
  },
  created() {},
  methods: {
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = ''
        }
      }

      r_last_no()
        .then(res => {
          console.log(res)
          if (res.rc == 0) {
            this.info.clientele_no = parseInt(res.last_clientele_no)
            console.log(this.info)
            this.visible = true
            this.onSubmiting = false
          } else {
            this.$message.error('fail - ' + res.msg)
          }
        })
        .catch(err => {
          this.$message.error('fail - system error')
        })
      console.log(this.info)
    },
    onClose() {
      this.visible = false
    },
    handle_submit_data(sumbmit_info) {
      //submit info data handling

      sumbmit_info.created_by = sessionStorage.user_id
      return sumbmit_info
    },
    submit_validation() {
      this.$refs.clientele.validate(valid => {
        if (valid) {
          return this.onSubmit()
        } else {
          this.$message.error('Please check the information')
          return false
        }
      })
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info)
      this.onSubmiting = true
      c_clientele(this.handle_submit_data(this.submit_info))
        .then(res => {
          console.log(res)
          if (res.status) {
            this.$message.success('success')
            this.visible = false
            this.onSubmiting = false
            this.$emit('done', {})
          } else {
            this.onSubmiting = false
            this.$message.error('fail - ' + res.msg)
          }
        })
        .catch(err => {
          this.onSubmiting = false
          this.$message.error('fail - system error')
        })
    },
  },
}
</script>
<style lang="scss">
.new-pmaster-modal {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      min-width: 160px;
    }
    .ant-calendar-picker {
      width: 100%;
    }
  }
  .ant-select {
    width: 100%;
  }
}
</style>
