<template>
  <div class="argumentSetTable">
    <DynamicTab :addBtn="miningQA.option.addBtn" :editBtn="miningQA.option.editBtn"
      :requstData="miningQA.option.requstData" :column="column" :title="miningQA.option.title" @chilReData="chilReData"
      ref="dynamicTab"></DynamicTab>
  </div>
</template>
<script>
import DynamicTab from "@/components/plugCrud/dynamicTab.vue";
import { getRules } from '@/util/regx'
export default {
  name: "argumentSetTable",
  components: {
    DynamicTab,
  },
  props: {
  },
  data() {
    // const self = this
    return {
      abilityCode: '',
      currentList: [],
      column: [],
      miningQA: {
        params: {},
        option: {
          addBtn: true,
          editBtn: true,
          delBtn: true,
          title: "待挖掘内容",
          requstData: [],
          responseData: [],
          menuWidth: 180,
          column: [
            {
              label: "ID",
              prop: "id",
              span: 24,
              type: "input",
              hide: true,
              display: false
            },
            {
              label: "顺序号",
              prop: "orderNo",
              span: 24,
              type: "input",
              hide: true,
              display: false
            },
            {
              label: "内容",
              prop: "sentence",
              span: 24,
              type: "input",
              rules: [
                {
                  required: true,
                  message: "请输入内容",
                  trigger: "blur",
                },
                {
                  min: 1,
                  max: 500,
                  message: "长度在 1 到 500 个字符",
                  trigger: "blur",
                }
              ],
            },
            {
              label: "角色",
              prop: "roleType",
              span: 24,
              type: "select",
              width: 60,
              dicData: [
                { label: "坐席", value: "1" },
                { label: "访客", value: "2" },
              ],
              rules: [
                {
                  required: true,
                  message: "请选择",
                  trigger: "blur",
                },
              ],
            },

          ]
        }
      },
      tagSenSim: {
        //标签与短文本相似度计算请求值特殊处理
        params: {},
        option: {
          addBtn: true,
          editBtn: true,
          delBtn: true,
          title: "标签词及其权重",
          requstData: [],
          column: [
            {
              label: "标签",
              prop: "roleType",
              span: 24,
              type: "input",
              rules: [
                {
                  required: true,
                  message: "请输入标签",
                  trigger: "blur",
                },
                {
                  min: 1,
                  max: 100,
                  message: "长度在 1 到 100 个字符",
                  trigger: "blur",
                },
                ...getRules(["charNumHanEnterCommaStop"]),
              ],
            },
            {
              label: "权重",
              prop: "sentence",
              span: 24,
              type: "number",
              props: {
                step: 0.1,
              },
              rules: [
                {
                  required: true,
                  message: "请输入权重",
                  trigger: "blur",
                },
                ...getRules(["zeroToOneDecimal"]),
              ],
            },
          ],
        },
      },
    };
  },
  computed: {},
  created() {

  },
  methods: {
    init(data) {
      this.abilityCode = data.abilityCode
      if (data.abilityCode === 'miningQA') {
        this.$nextTick(() => {
          // this.$refs.dynamicTab.requstData = data[data.abilityCode].sentences
          this.currentList = data[data.abilityCode].sentences
          this.$refs.dynamicTab.init(this.miningQA.option.column, data[data.abilityCode].sentences)
        })
      }
      if (data.abilityCode === 'tagSenSim') {
        const arr = []
        const tagWords = data[data.abilityCode].tagWords
        Object.keys(tagWords).map((v, i) => {
          let json = {
            id: i + 1 + '',
            orderNo: i + 1,
            roleType: v,
            sentence: tagWords[v],
          };
          arr.push(json);
        });
        this.currentList = arr
        this.$refs.dynamicTab.init(this.tagSenSim.option.column, arr)
      }
    },
    chilReData(data) {
      if (this.abilityCode === 'miningQA' || this.abilityCode === 'tagSenSim') {
        const arr = []
        data.map((v, i) => {
          let obj = {
            id: i + 1 + '',
            orderNo: i + 1,
            roleType: v.roleType,
            sentence: v.sentence,
          }
          arr.push(obj)
        })
        this.miningQA.option.responseData = arr
        this.currentList = arr
      } 
      // else {
      //   let json = { tagWords: {} };
      //   if (data) {
      //     data.map((v) => {
      //       json.tagWords[v.tag] = v.words;
      //     });
      //   }
      //   this.tagSenSim.params = json;
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.argumentSetTable {
  margin: 0 10px;
  background: white;
  padding: 0 10px;
}
</style>
