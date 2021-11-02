<template>
  <div class="uploadfile">
    <a-upload
      :accept="'.doc,.docx,.pdf,.xls,.png,.jpg,.jpeg'"
      :action="action_url"
      listType="picture"
      name="tio_file"
      :defaultFileList="List"
      :fileList="List"
      :multiple="true"
      :beforeUpload="beforeUpload"
      @change="handleChange"
      :remove="onRemoveFile"
    >
      <a-button :disabled="disabled != undefined && disabled != false">
        <a-icon type="upload"  />upload
      </a-button>
    </a-upload>
  </div>
</template>
<script>
export default {
  data() {
    return {
      List: [],
      parent_value: [],
      action_url: "http://keylab.cc/tiostone/api/upload/"
    };
  },
  props: ["value", "disabled"],
  created() {
    if (location.hostname == "localhost") {
      this.action_url = location.origin+"/api/api/upload/";
    }
  },
  methods: { changeSubmit(flag){ this.onSubmiting = flag; },
    handleChange(info) {
        console.log(info);
      console.log("handleChange: " + info.file.status);
      console.log(JSON.parse(JSON.stringify(info)));
      //if failed in before upload, this function still triggered, but item without status
      this.parent_value = info.fileList.filter(
        item =>
          item.status !== "removed" &&
          item.status !== "error" &&
          item.hasOwnProperty("status")
      );
      this.$emit("input", this.parent_value);
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        info.fileList.forEach((fileObj, index) => {
          if (fileObj.uid == info.file.uid) {
            info.fileList[index].uid = info.file.response.id;
            info.fileList[index].name = info.file.response.name;
            info.fileList[index].url = info.file.response.url;
            delete info.file.lastModified;
          }
        });
        this.$emit('changeSubmit', false);
        //returned by api case handle
        if (info.file.response.error) {
          this.$message.error(
            `${info.file.name} file upload failed - api reponse - ${info.file.response.error}`
          );
        } else {
          this.$message.success(`${info.file.name} file uploaded successfully`);
        }
      } else if (info.file.status === "error") {
        //http error, file size bigger than php.ini setting will also trigger this error
        this.$message.error(
          `${info.file.name} file upload failed - http response code - ${info.file.error.status}`
        );
      }
    },
    beforeUpload(file) {
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isLt25M) {
        this.$message.error("檔案不能大於25MB!");
      }else{
        this.$emit('changeSubmit', true);
      }
      return isLt25M;
    },
    onRemoveFile(file) {
      if(this.disabled == undefined || this.disabled == false){
        if (file["url"] == undefined) return true;
        return true;
      }else{
        return false;
      }

    },
    test(){
       console.log("111")
    },
    get_file_info(item) {
      //get info of file
      if (item != undefined) {
        this.List.forEach(value => {
          for (var key in value) {
            if (
              key == "name" ||
              key == "url" ||
              key == "uid" ||
              key == "status"
            ) {
              continue;
            }
            delete value[key];
          }
        });
      }
      return this.List;
    }
  },
  watch: {
    value: {
      //監視外面的變化 更新component 模樣
      immediate: true,
      handler(nval, oval) {
        console.log("handler");
        this.List = nval;
      }
    }
  }
};
</script>
<style lang="scss">
.uploadfile {
  /* tile uploaded pictures */
  .upload-list-inline >>> .ant-upload-list-item {
    float: left;
    width: 200px;
    margin-right: 8px;
  }
  .upload-list-inline >>> .ant-upload-animate-enter {
    animation-name: uploadAnimateInlineIn;
  }
  .upload-list-inline >>> .ant-upload-animate-leave {
    animation-name: uploadAnimateInlineOut;
  }
  .ant-upload-list-item-info .anticon-close {
    font-size: 16px !important;
  }
}
</style>
