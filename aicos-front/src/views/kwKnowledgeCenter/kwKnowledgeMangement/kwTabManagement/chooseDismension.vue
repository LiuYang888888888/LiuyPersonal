<template>
  <div>
    <div class="fj-selected-area-wrap">
      <h5 class="fj-selected-area">
        <span v-for="(item, index) in dismensionData" :key="index">
          <b class="selected" @click="getNextDis(item)">{{ item.dname }}</b>
          <i
            class="delimiter-arrow el-icon-arrow-right"
            v-if="index < dismensionData.length - 1"
          ></i>
        </span>
      </h5>
    </div>

    <div class="dismension-list">
      <ul>
        <li
          v-for="(item, i) in nextDismensionData"
          @click="choosedDis(item)"
          :key="i"
        >
          {{ item.dname }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getDismension } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index";
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    dismensionData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      botId: "",
      nextDismensionData: [], // 下一级的维度数据
    };
  },
  components: {
    //someComponent
  },
  computed: {
    // 计算属性
  },
  methods: {
    getNextDis(item) {
      this.dismensionData.every((disItem, index) => {
        if (item.id == disItem.id) {
          this.dismensionData.splice(
            index + 1,
            this.dismensionData.length - (index + 1)
          );
          return false;
        }

        return true;
      });
      this.getDismensionData(item.id, this.botId);
    },

    getDismensionData(pid) {
      getDismension(pid, this.botId).then((resData) => {
        this.nextDismensionData = resData.data.data.map((item) => {
          return {
            ...item,
          };
        });
      });
    },

    // 选择维度
    choosedDis(item) {
      this.dismensionData.push({
        id: item.id,
        dname: item.dname,
        orderNum: item.orderNum,
      });
      this.getDismensionData(item.id);
    },
  },
  created() {},
  mounted() {
    this.botId = this.$store.getters.botObj.id;
    if (this.dismensionData.length > 0) {
      var lastId = this.dismensionData[this.dismensionData.length - 1].id;

      this.getDismensionData(lastId);
    }
  },
  destroyed() {},
};
</script>

<style scoped lang="scss">
.fj-selected-area-wrap {
  border-bottom: 1px solid #eeeeee;
}
.fj-selected-area {
  margin: 0;
  padding: 12px 30px;
  color: #0045c8;
  font-size: 16px;

  .selected {
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
    cursor: pointer;
  }

  .delimiter-arrow {
    font-size: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -2px;
    padding: 0 5px;
    color: #a0a2aa;
  }
}

.dismension-list {
  padding: 15px 30px 0;
  min-height: 100px;

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-flow: row wrap;

    li {
      width: 115px;
      margin-right: 20px;
      margin-bottom: 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
