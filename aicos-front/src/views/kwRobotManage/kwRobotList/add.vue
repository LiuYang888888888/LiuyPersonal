<template>
  <div>
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="109px"
    >
      <el-form-item label="机器人名称" prop="robotName">
        <el-input
          v-model="formData.robotName"
          placeholder="请输入机器人名称"
          clearable
          :maxlength="30"
          show-word-limit
          :style="{ width: '100%' }"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="头像" prop="robotImg">
        <div class="avatar-container">
          <el-avatar
            :class="currentIndex == index ? 'avatar-choosed' : ''"
            v-for="(img, index) in robotDefaultList"
            :key="index"
            size="small"
            data-type="0"
            :data-url="img.url"
            @click.native="chooseImg($event, index, 0, img.url)"
            :src="img.url"
          ></el-avatar>
          <el-avatar
            :class="currentIndex == 10 ? 'avatar-choosed' : ''"
            v-if="imgUrl"
            size="small"
            data-type="1"
            :data-url="imgUrl"
            @click.native="chooseImg($event, 10, 1, imgUrl)"
            :src="imgUrl"
          ></el-avatar>
          <el-upload
            ref="robotImg"
            :file-list="robotImgfileList"
            :action="robotImgAction"
            accept=".png"
            :data="dataObj"
            :on-change="handleChange"
            :before-upload="robotImgBeforeUpload"
            :on-success="successUpload"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input
          v-model="formData.desc"
          type="textarea"
          placeholder="请输入备注"
          :maxlength="150"
          show-word-limit
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseURL } from "@/api/common";
import serviceList from "@/config/serviceList";
// const { kwRobot } = serviceList;

import { saveOrUpdateRobot } from "@/api/kwRobot/kwRobotTrain/index";
export default {
  components: {},
  props: {
    cur: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
      dataObj: {
        fromSystemName: "robot",
        filelibrary: "robotManage",
      },
      headType: "0",
      formData: {
        robotName: "",
        robotImg: `${baseURL}robotImg/robotHead1.png`,
        desc: "",
        id: "",
      },
      rules: {
        robotName: [
          {
            required: true,
            message: "请输入机器人名称",
            trigger: "blur",
          },
        ],
        desc: [],
      },
      robotImgAction: `${baseURL}api/${serviceList.file}/miniofile/upload`,
      robotImgfileList: [],
      robotDefaultList: [
        { url: `${baseURL}robotImg/robotHead1.png` },
        { url: `${baseURL}robotImg/robotHead2.png` },
        { url: `${baseURL}robotImg/robotHead3.png` },
        { url: `${baseURL}robotImg/headHead4.png` },
        { url: `${baseURL}robotImg/robotHead5.png` },
      ],
      imgUrl: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log(this.cur, "@@@");
    if (this.cur.id) {
      this.formData.id = this.cur.id;
      this.formData.robotName = this.cur.robotName;
      this.formData.desc = this.cur.description;
      if (this.cur.headType == 0) {
        this.robotDefaultList.forEach((item, index) => {
          if (item.url == this.cur.headImgUrl) {
            this.currentIndex = index;
            this.headType = 0;
            this.formData.robotImg = this.cur.headImgUrl;
          }
        });
      }
      if (this.cur.headType == 1) {
        this.currentIndex = 10;
        this.imgUrl = this.cur.headImgUrl;
        this.formData.robotImg = this.cur.headImgUrl;
        this.robotImgfileList.push({ url: this.cur.headImgUrl });
      }
    }
  },
  methods: {
    //上传之前
    robotImgBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 / 1024 < 80;
      if (!isRightSize) {
        this.$message.error("文件大小超过80k");
      }
      return isRightSize;
    },
    //上传成功
    successUpload(file/*, fileList*/) {
      this.currentIndex = 10;
      this.headType = 1;
      this.formData.robotImg = this.imgUrl = baseURL.replace(/\/$/, "") + file.data.newFileName;
    },
    //控制文件上传数量的
    handleChange(file, fileList) {
      this.robotImgfileList = fileList.slice(-1);
    },
    //保存
    save() {
      this.$refs.elForm.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const info = {
            robotName: this.formData.robotName, //机器人名字
            type: "0", //区别机器人管理和实例的标识
            headType: this.headType, //上传头像的类型 0系统 1自定义
            description: this.formData.desc, //描述
            headImgUrl: this.formData.robotImg, //头像地址
            id: this.formData.id,
          };
          const result = await saveOrUpdateRobot(info);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.$emit("successSave");
            this.cur = {};
          }
        }
      });
    },
    chooseImg(e, index, type, url) {
      this.currentIndex = index;
      this.headType = type;
      this.formData.robotImg = url;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-upload-list__item {
  width: 30px;
  height: 30px;
  display: none;
}
/deep/ .el-upload--picture-card {
  width: 30px;
  height: 30px;
  line-height: 30px;
}
.avatar-container {
  display: flex;
  .el-avatar {
    margin-right: 10px;
    cursor: pointer;
  }
  .avatar-choosed {
    border: 2px solid green;
  }
}
</style>
