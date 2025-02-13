<template>
  <div class="sysIndexCenter">
    <div class="centerLi" v-if="menuNameList.includes('军保企业')">
      <router-link to="/outSystem/armyEnterprise/index">
        <img src="~@/assets/outSystem/icon1.png">军保企业审核
      </router-link>
    </div>
    <div class="centerLi" v-if="menuNameList.includes('技术产品')">
      <router-link to="/outSystem/product/index">
        <img src="~@/assets/outSystem/icon2.png">技术产品审核
      </router-link>
    </div>
    <div class="centerLi" v-if="menuNameList.includes('需求信息')">
      <router-link to="/outSystem/demand/index">
        <img src="~@/assets/outSystem/icon3.png">需求信息审核
      </router-link>
    </div>
    <div class="centerLi" v-if="menuNameList.includes('服务机构')">
      <router-link to="/outSystem/agency">
        <img src="~@/assets/outSystem/icon4.png">服务机构审核
      </router-link>
    </div>
    <div class="centerLi" v-if="menuNameList.includes('供应信息')">
      <router-link to="/outSystem/services">
        <img src="~@/assets/outSystem/icon5.png">供应信息审核
      </router-link>
    </div>
    <div class="centerLi" v-if="menuNameList.includes('企业信息')">
      <router-link to="/outSystem/company">
        <img src="~@/assets/outSystem/icon6.png">企业信息审核
      </router-link>
    </div>
    <div class="centerLi" v-if="menuNameList.includes('服务专家')">
      <router-link to="/outSystem/expert">
        <img src="~@/assets/outSystem/icon7.png">服务专家审核
      </router-link>
    </div>
    <div class="centerLi" v-if="menuNameList.includes('军工三证')">
      <router-link to="/outSystem/military">
        <img src="~@/assets/outSystem/icon8.png">军工三证审核
      </router-link>
    </div>
  </div>
</template>

<script>
  export default{
    name:'indexMenu',
    props:{
      menuList:{
        type:Object,
        default() {
          return {};
        },
      }
    },
    watch:{
      menuList:{
        handler(val) {
          this.menuList = val;
        },
        deep: true
      }
    },
    data(){
      return{
        menuListAll:this.menuList,
        menuNameList:[]
      }
    },
    methods:{
      getIndexMenu(){
        for (let i = 0; i < this.menuListAll.length; i++){
          let menuName = this.menuListAll[i].menuName
          this.menuNameList.push(menuName)
        }
      }
    },
    created() {
      this.getIndexMenu()
    }
  }
</script>

<style scoped lang="scss">
@keyframes turnOver {
  0% {
    transform:rotatey(0deg);
  }
  50% {
    transform:rotatey(180deg);
  }
  100% {
    transform:rotatey(360deg);
  }
}
.sysIndexCenter {
  margin: 20px 0;
  background: #fff;
  padding: 20px 20px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 10px;
}

.sysIndexCenter .centerLi {
  width: 24%;
  margin-bottom: 1rem;
  background: #f6f6f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.sysIndexCenter .centerLi:nth-child(4n){
  margin-right: 0;
}

.sysIndexCenter .centerLi img {
  margin-right: 1rem;
  width: 3rem;
  height: 3rem;
}

.sysIndexCenter .centerLi a {
  font-weight: bold;
  display: flex;
  align-items: center;
  padding: 1.3rem 2.5rem;
  box-sizing: border-box;
  font-size: 1rem;
}

.sysIndexCenter .centerLi a:hover img{
  animation-name: turnOver;
  animation-iteration-count: 1;
  animation-duration: 1s;
  -webkit-animation-name:turnOver;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-duration: 1s;
}
</style>
