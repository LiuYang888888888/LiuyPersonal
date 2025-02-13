<template>
  <div>
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      :label-position="language != 'zh' ? 'top' : 'right'"
      label-width="109px"
    >
      <el-form-item :label="$t('kwRobotManage.instanceName')" prop="robotName">
        <el-input
          v-model="formData.robotName"
          :placeholder="$t('kwRobotManage.instanceNameTips')"
          clearable
          maxlength="50"
          show-word-limit
          :style="{ width: '100%' }"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('kwRobotManage.head')" prop="robotImg">
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
      <el-form-item :label="$t('kwRobotManage.taskType')" prop="taskType">
        <el-select
          v-model="formData.taskType"
          clearable
          :placeholder="$t('kwRobotManage.taskTypeTips')"
        >
          <el-option
            v-for="(item, index) in industryData"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('kwRobotManage.businessType')" prop="industry">
        <el-select
          v-model="formData.industry"
          clearable
          :placeholder="$t('kwRobotManage.businessTypeTips')"
        >
          <el-option
            v-for="(item, index) in taskData"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('kwRobotManage.desc')" prop="desc">
        <el-input
          v-model="formData.desc"
          type="textarea"
          :placeholder="$t('kwRobotManage.descTips')"
          :maxlength="300"
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
import { mapGetters } from "vuex";

import {
  saveOrUpdateRobot,
  getRobotDictItemListByDictCode,
} from "@/api/kwRobot/kwRobotTrain/index";
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
      botId: "",
      taskData: [], //行业类型
      industryData: [], //业务类型
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
        taskType: "", //业务类型
        industry: "", //所属行业
        NLP: "", //nlp语言
      },
      rules: {
        robotName: [
          {
            required: true,
            message: this.$t("kwRobotManage.instanceNameTips"),
            trigger: "blur",
          },
        ],
        taskType: [
          {
            required: true,
            message: this.$t("kwRobotManage.taskTypeTips"),
            trigger: "change",
          },
        ],
        industry: [
          {
            required: true,
            message: this.$t("kwRobotManage.businessTypeTips"),
            trigger: "change",
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
  computed: {
    // 计算属性
    ...mapGetters(["botObj", "permission", "language"]),
  },
  watch: {},
  created() {},
  async mounted() {
    this.botId = this.$store.getters.botObj.id;
    const taskType = {
      code: "industry_type",
    };
    const taskResult = await getRobotDictItemListByDictCode(taskType);
    if (taskResult.data.code == 200) {
      this.taskData = taskResult.data.data;
    }
    const industry = {
      code: "business_type",
    };
    const industryResult = await getRobotDictItemListByDictCode(industry);
    if (industryResult.data.code == 200) {
      this.industryData = industryResult.data.data;
    }
    if (this.cur.id) {
      this.formData.id = this.cur.id;
      this.formData.robotName = this.cur.robotName;
      this.formData.desc = this.cur.description;
      this.formData.industry = this.cur.industryType;
      this.formData.taskType = this.cur.businessType;
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
        this.$message.error(this.$t("kwRobotManage.fileSizeTips"));
      }
      return isRightSize;
    },
    //上传成功
    successUpload(file /*, fileList*/) {
      this.currentIndex = 10;
      this.headType = 1;
      this.formData.robotImg =
        baseURL.replace(/\/$/, "") + file.data.newFileName;
      this.imgUrl = baseURL.replace(/\/$/, "") + file.data.newFileName;
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
            botId: this.botId,
            robotName: this.formData.robotName, //机器人名字
            type: "1", //区别机器人管理和实例的标识
            headType: this.headType, //上传头像的类型 0系统 1自定义
            description: this.formData.desc, //描述
            headImgUrl: this.formData.robotImg, //头像地址
            businessType: this.formData.taskType, //业务类型
            industryType: this.formData.industry, //行业类型
            id: this.formData.id,
          };
          const result = await saveOrUpdateRobot(info);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
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
