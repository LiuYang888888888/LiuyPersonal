<template>
  <HuilanBasic class="sysIndexTop">
    <div class="m-title">工作台</div>
    <div class="m-tools">
      <div v-for="(item, index) in workbenchList" :key="item" class="m-t-model" @click="toMenu(item)">
        <div class="model">
          <div class="img">
            <img :src="item.icon" alt=""/>
          </div>
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </HuilanBasic>
</template>

<script>
export default {
  name: "workbench",
  data() {
    return {
      
    }
  },
  props: {
    workbenchList: Array,
  },
  methods: {
    toMenu(item) {
      this.$router.push({
        path: item.path,
        // query: {
        //   id: null,
        // }
      })
    },
  },
  created() {
  }
}

</script>

<style lang="scss" scoped>
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
</style>