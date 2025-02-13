<template>
  <div class="sysIndex">
    <!-- 工作台区域 -->
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>

    <!-- 待办列表区域 -->
    <div class="sysIndexBottom">
      <toDoList v-if="dataList.length > 0" :dataList="dataList" :readyList="readyList" @childEvent="chooseInfo"></toDoList>
    </div>
    <div class="sysIndexBottom">
      <!-- 饼图区域 -->
      <div :class="{
        'sysIndexBottomLeft': true,
        'hasData': piedata.length > 0 && areaData.length > 0,
        'fullWidth': (piedata.length > 0 && areaData.length === 0)
      }">
        <pie v-if="piedata.length > 0" :pieTitle="pieTitle" :piedata="piedata" ref="pieRef"></pie>
      </div>
      <!-- 折线图区域 -->
      <div :class="{
        'sysIndexBottomRight': true,
        'hasData': piedata.length > 0 && areaData.length > 0,
        'fullWidth': (areaData.length > 0 && piedata.length === 0)
      }">
        <lineshow  v-if="areaData.length > 0" :lineTitle="lineTitle" :areaData="areaData" :areaNum="areaNum" ref="lineRef"></lineshow>
      </div>
    </div>
    
  </div>
</template>
<script>
import workbench from '@/components/workCommon/workbench.vue'
import toDoList from '@/components/workCommon/toDoList.vue'
import pie from '@/components/workCommon/pie.vue'
import lineshow from '@/components/workCommon/lineshow.vue'
import { getWorkbench } from "@/api/outSystem/mbCompany";

export default {
  components: {
    workbench,
    toDoList,
    pie,
    lineshow,
  },
  data() {
    return {
      // 工作台列表数据
      workbenchList:[
        // 列表项，包含图标、标题、路径和类型
        { icon: require('@/assets/outSystem/icon1.png'), title: '监管体系新增', path: '/outSystem/minbao/superVision', type:'add' },
        { icon: require('@/assets/outSystem/icon2.png'), title: '企业信息新增', path: '/outSystem/minbao/company', type:'add' },
        { icon: require('@/assets/outSystem/icon3.png'), title: '应急体系新增', path: '/outSystem/minbao/emergency', type:'add' },
        { icon: require('@/assets/outSystem/icon4.png'), title: '安全管理人员考核新增', path: '/outSystem/minbao/safePerson', type:'add' },
        { icon: require('@/assets/outSystem/icon5.png'), title: '文件收发管理新增', path: '/outSystem/minbao/fileManage', type:'add' },
        { icon: require('@/assets/outSystem/icon6.png'), title: '安全管理先进申报新增', path: '/outSystem/minbao/safeManage', type:'add' },
        { icon: require('@/assets/outSystem/icon7.png'), title: '安全生产许可年检新增', path: '/outSystem/minbao/safeShengchan', type:'add' },
        { icon: require('@/assets/outSystem/icon8.png'), title: '销售许可年检新增', path: '/outSystem/minbao/sallCheck', type:'add' },
      ],
      // 待办列表数据
      dataList: [],
      // 待办列表数据分组
      dataGroups: Array.from({ length: 8 }, () => []),
      // 准备列表数据
      readyList:[
        { title:'监管体系' },
        { title:'企业信息' },
        { title:'应急体系' },
        { title:'安全管理人员考核' },
        { title:'文件收发管理' },
        { title:'安全管理先进申报' },
        { title:'安全生产许可年检' },
        { title:'销售许可年检' },
      ],
      // 饼图标题
      pieTitle:'单位类型',
      // 饼图数据分组
      pieDataGroups: Array.from({ length: 8 }, () => []),
      // 折线图标题
      lineTitle:'监管/应急企业/企业各地市分布',
      // 折线图数据分组
      areaDataGroups: Array.from({ length: 8 }, () => []),
      // 折线图数据数量分组
      areaNumGroups: Array.from({ length: 8 }, () => []),
      // 当前选中的索引
      currentIndex: 0,
    }
  },
  created() {
    // 在组件创建时获取工作台数据
    this.getWorklist()
  },
  computed: {
    // 计算当前显示的饼图数据
    piedata() {
      return this.pieDataGroups[this.currentIndex];
    },
    // 计算当前显示的折线图数据
    areaData() {
      return this.areaDataGroups[this.currentIndex];
    },
    // 计算当前显示的折线图数据数量
    areaNum() {
      return this.areaNumGroups[this.currentIndex];
    }
  },
  methods:{
    // 获取工作台数据的方法
    async getWorklist() {
      try {
        const res = await getWorkbench();
        // 遍历返回的数据，根据类型和值进行分类
        res.data.data.forEach(item => {
          if (item.type_ == '1') {
            const index = parseInt(item.type_value[3]) - 1;
            if (index >= 0 && index < 8) {
              this.dataGroups[index].push(item);
            }
          }

          // 将 item.type_ 转换为字符串类型
          const typeStr = String(item.type_);
          if (typeStr.startsWith('2')) {
            const index = parseInt(typeStr[1]) - 1;
            if (index >= 0 && index < 8 && item.type_num > 0) {
              this.pieDataGroups[index].push({ value: item.type_num, name: item.type_value });
            }
          }
          if (typeStr.startsWith('3')) {
            const index = parseInt(typeStr[1]) - 1;
            if (index >= 0 && index < 8) {
              const typearr = item.type_value.split('/');
              if (typearr.length > 0 && typearr[1] && typearr[0] === '河南省') {
                this.areaDataGroups[index].push(typearr[1]);
                this.areaNumGroups[index].push(item.type_num);
              }
            }
          }
        });
        // 将分类后的数据赋值给 dataList
        this.dataList = this.dataGroups;
      } catch (error) {
        // 如果获取数据失败，打印错误信息
        console.error('Failed to fetch worklist:', error);
      }
    },
    // 处理子组件事件的方法
    chooseInfo(data) {
      const index = this.readyList.findIndex(item => item.title === data);
      if (index !== -1) {
        this.currentIndex = index;
        // 根据选中的索引设置饼图标题
        const titles = [
          '单位类型',
          '企业类型',
          '类型',
          '职称',
          '单位类型',
          '营收情况',
          '许可证期限',
          '注册类型'
        ];
        this.pieTitle = titles[index];
      }
    },
  },
}
</script>


<style scoped lang="scss">
// 底部区域样式
.sysIndexBottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

// 饼图区域样式
.sysIndexBottomLeft {
  width: 0;
  flex-grow: 1;
  box-sizing: border-box;
}

// 折线图区域样式
.sysIndexBottomRight {
  width: 0;
  flex-grow: 1;
  box-sizing: border-box;
}

// 当两个图表都有数据时的样式
.sysIndexBottomLeft.hasData,
.sysIndexBottomRight.hasData {
  width: 50%;
}

// 当只有一个图表有数据时的样式
.sysIndexBottomLeft.fullWidth,
.sysIndexBottomRight.fullWidth {
  width: 100%;
}
</style>