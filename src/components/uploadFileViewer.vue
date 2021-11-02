<template>
  <div class="uploadfile">
    <a-upload
      :showUploadList="{
        showRemoveIcon:false
        }"
      :action="action_url"
      listType="picture"
      name="orm_file"
      :defaultFileList="List"
      :fileList="List"
      @change="handleChange"
    ></a-upload>
  </div>
</template>
<script>
export default {
  data() {
    return {
      List: [],
      disable_upload: 0,
      action_url: "http://keylab.cc/api/upload-file/"
    };
  },
  created() {
    if (location.hostname == "localhost") {
      this.action_url = "api/api/upload-file/";
    }
  },
  props: ["value"],
  methods: { changeSubmit(flag){ this.onSubmiting = flag; },
    handleChange(info) {
      this.value = info.fileList.filter(item => item.status !== "removed");
      this.$emit("input", this.value);
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        info.fileList[info.fileList.length - 1].uid = info.file.response.id;
        info.fileList[info.fileList.length - 1].url = info.file.response.url;
        delete info.file.lastModified;
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemoveFile(file) {
      if (file["url"] == undefined) return true;
      return true;
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
      immediate: true,
      handler(nval, oval) {
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
