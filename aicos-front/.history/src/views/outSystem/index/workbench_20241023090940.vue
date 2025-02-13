<template>
  <HuilanBasic class="sysIndexTop">
    <el-button @click="drawer = true">常用功能</el-button>
    <div class="m-tools">
      <div v-for="(item, index) in workbenchListShow" :key="index" class="m-t-model" @click="toMenu(item)">
        <div class="model">
          <div class="img">
            <img :src="item.icon" alt=""/>
          </div>
          <div class="title">{{ item.menuName }}</div>
        </div>
      </div>
    </div>

    <el-drawer
      title="常用功能配置"
      :visible.sync="drawer"
      append-to-body="true"
      direction="rtl"
      size="30%">
        <el-checkbox-group v-model="checkList" class="chooseModel">
          <div v-for="(item, index) in workbenchList" :key="index">
            <el-checkbox :label="item.id">
              <div class="model">
                <!-- <div class="img">
                  <img :src="'/aicos/img/'+item.remark+'.png'" alt=""/>
                </div> -->
                <div class="choosetitle">{{ item.menuName }}</div>
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>

        <div class="choosebtn">
          <el-button type="success" round :loading="chooseLoading" @click="chooseWorkbench">确定</el-button>
          <el-button round @click="chooseclose">清空</el-button>
        </div>
    </el-drawer>
  </HuilanBasic>
</template>

<script>
import {getPersonMenu , setPersonMenu ,getPersonMenuInfo ,consultancylistByPage} from "@/api/outSystem/index";
export default {
  name: "CmiFaSelfMerits",
  data() {
    return {
      drawer: false,
      chooseLoading: false,
      checkList:[],
      workbenchListShow:[],
      workbenchList: [],
      iconList:[
        {
          icon: require('@/assets/outSystem/icon1.png'),
          title: '军保企业',
          path: '/outSystem/armyEnterprise/index',
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '技术产品',
          path: '/outSystem/product/index',
        },
        {
          icon: require('@/assets/outSystem/icon3.png'),
          title: '需求信息',
          path: '/outSystem/demand/index',
        },
        {
          icon: require('@/assets/outSystem/icon4.png'),
          title: '服务机构',
          path: '/outSystem/agency',
        },
        {
          icon: require('@/assets/outSystem/icon5.png'),
          title: '供应信息',
          path: '/outSystem/gongying/services',
        },
        {
          icon: require('@/assets/outSystem/icon6.png'),
          title: '企业信息',
          path: '/outSystem/company',
        },
        {
          icon: require('@/assets/outSystem/icon7.png'),
          title: '服务专家',
          path: '/outSystem/expert',
        },
        {
          icon: require('@/assets/outSystem/icon8.png'),
          title: '军工三证',
          path: '/outSystem/military',
        },
        {
          icon: require('@/assets/outSystem/icon5.png'),
          title: '设备资源',
          path: '/resourceInfo/shebei/shebeiInfo',
        },
        {
          icon: require('@/assets/outSystem/icon6.png'),
          title: '科研成果共享',
          path: '/outSystem/share',
        },
      ]
    }
  },
  mounted(){
    this.personMenu()
    this.PersonMenuInfo()
    this.consultancy()
  },
  methods: {
    personMenu(){
      getPersonMenu().then( res =>{
        res.data.data.menuList.forEach( e=>{
          if(e.menuList.length > 0){
            e.menuList.forEach( n =>{
              this.workbenchList.push(n)
            })
          }else{
            this.workbenchList.push(e)
          }
        })
      })
    },
    // 指定范围内，指定个数，无重复的随机整数
    getRandomNumber(n,min,max){
      let arr=[];
      for(let i = 0; i < n; i ++){
        arr[i] = parseInt(Math.random() * (max - min + 1) + min);
      }
      for(let i = 0; i < n; i++){
        for(let j = i + 1; j < n; j ++){
          if(arr[i] === arr[j]){
            this.getRandomNumber(n,min,max);
            return false;
          }
        }
      }
      return arr
    },

    PersonMenuInfo(){
      getPersonMenuInfo().then(res =>{
        this.workbenchListShow = res.data.data
        this.workbenchListShow.forEach(e=>{
          this.checkList.push(e.id)
          let num = this.getRandomNumber(1,0,7)
          e.icon = this.iconList[num[0]].icon
        })
      })
    },

    consultancy(){
      const param = {
        reqPage: {
          current: 1,
          size: 10
        }
      }
      consultancylistByPage(param).then(res =>{
        console.log(res)
      })
    },
    toMenu(item) {
      this.$router.push({
        path: item.linkUrl,
      })
    },

    chooseWorkbench(){
      this.chooseLoading = true
      if(this.checkList.length > 0){
        let ids = this.checkList.join(",")
        let param = new URLSearchParams()
        param.append("ids", ids)
        setPersonMenu(param).then( (res) =>{
          if(res.data.code == 200){
            this.chooseLoading = false
            this.PersonMenuInfo()
          }
        })
      }
      this.drawer = false
    },
    chooseclose(){
      this.checkList = []
    }
  },
  created() {
  }
}

</script>

<style lang="scss" scoped>
.el-button{
  color: #fff;
  background: #af2c30;
  border-color: #af2c30;
}
/deep/.basic-main{
  padding: 18px !important;
  margin: 10px !important;
}
.m-title {
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
}

.m-tools {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;

  .m-t-model {
    width: 12.5%;
    cursor: pointer;
    .model {
      text-align: center;
      margin: 10px;
      .img {
        width: 100%;
        height: 50px;

        img {
          width: 50px;
          height: 50px;
        }
      }

      .title {
        font-size: 16px;
        font-weight: bold;
        color: #000;
        width: 100%;
        margin-top: 7px;
      }
    }
  }
}

.chooseModel{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 80%;
  margin: 20px auto;
  .el-checkbox{
    width: auto;
    .model{
      margin-top: 10px;
      .img{
        text-align: center;
      }
      .choosetitle{
        font-size: 16px;
        font-weight: bold;
        color: #000;
        margin-top: 7px;
        text-align: center;
      }
    }
  }
}

.choosebtn{
  width: 40%;
  display: flex;
  margin: 50px auto;
  justify-content: space-between;
}
.el-checkbox:last-of-type{
  margin-right:15px;
  margin-top:15px;
}
</style>
