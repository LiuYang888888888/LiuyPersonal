<template>
  <div class="bookBox">
    <div class="book">
      <!-- <div class="book-left">
        <div class="item-box">
          <div class="item" :class="menuIndex == index ? 'active' : ''" v-for="(item, index) in menuList" :key="index"
               @click="getMenuPerson(index,item)">
            {{ item.enterprise_name }}
          </div>
        </div>
        <div></div>
      </div> -->
      <div class="book-right">
        <div class="right-top">
          <el-input class="search" v-model="searchKey" placeholder="请输入关键词……" size="normal" clearable></el-input>
          <el-button class="btn" type="primary" size="default" @click="searchChange">确认查询</el-button>
        </div>
        <div class="right-center">
          <div class="user-box" v-for="(item, index) in userList" :key="index">
            <div class="user-avatar">

              <img v-if="item.avatar" class="avatar" :src="item.avatar" alt="" srcset="">
              <img v-else class="avatar" :src="logoUrl" alt="" srcset="">

              <div class="job">
                <div class="name">{{ item.extendField4 }}</div> 
                <div style="margin-left: 20px;" v-if="item.extendField3">{{ item.extendField3 }}</div>
              </div>
            </div>
            <div class="user-info">
              <!-- <div class="info-box">
                <img class="info-img" src="~@/assets/book/email.png" alt="">

                <div class="info-type">邮箱</div>
                <div class="info-content">：{{ item.email }}</div>
              </div> -->
              <div class="info-box">
                <img class="info-img" src="~@/assets/book/phone.png" alt="">
                <div class="info-type">联系电话</div>
                <div class="info-content">：{{ item.extendField5 }}</div>
              </div>
              <div class="info-box">
                <img class="info-img" src="~@/assets/book/department.png" alt="">
                <div class="info-type">用户类型</div>
                <div class="info-content" v-if="item.extendField1 == 1">：qiye</div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-bottom">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" align="center"
                         :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" prev-text="上一页"
                         next-text="下一页"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
      <!-- <div class="links">
        <div class="link-title">常用链接</div>
        <div class="link-list">
          <div class="link-item">通知发送</div>
          <div class="link-item">公文处理</div>
          <div class="link-item">文件传阅</div>
          <div class="link-item">电子邮件</div>
          <div class="link-item">办文单发起</div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
const baseUrl = process.env.BASE_URL;
import {getMenuList, getUserListPageByParam} from "@/api/outSystem/book";

export default {
  name: "book",
  components: {},
  props: {},
  data() {
    return {
      userList: [],
      menuList: [],
      menuIndex: 0,
      searchKey: '',//搜索内容
      currentPage: 1,
      pageSizes: [8, 12, 16, 18, 20],
      pageSize: 8,
      total: 0,
      menuActiveName: '',
      logoUrl: `${baseUrl}img/bg/mrtx.png`,
    };
  },
  created() {
    //this.getMenuList();
    this.getUserListPageByParam()
  },
  mounted() {
  },
  watch: {},
  methods: {
    searchChange() {
      this.currentPage = 1;
      this.getUserListPageByParam()
    },
    // getMenuList() {
    //   getMenuList().then((res) => {
    //     this.menuList = res.data.data
    //   })
    // },
    getUserListPageByParam() {
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        enterpriseName: this.menuActiveName,
        contactsFind: this.searchKey
      }
      getUserListPageByParam(params).then((res) => {
        this.userList = res.data.data.records
        this.total = res.data.data.total
        this.pageSize = res.data.data.size
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getUserListPageByParam();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getUserListPageByParam();
    },
    getMenuPerson(index, item) {
      this.menuIndex = index
      this.currentPage = 1;
      this.menuActiveName = item.enterprise_name
      this.getUserListPageByParam();
    }
  },
  computed: {},
  beforeDestory: {},
};
</script>

<style lang="scss" scoped>
.bookBox {
  padding: 20px 20px 20px 0;
  box-sizing: border-box;
}

.book .book-left {
  margin: 0 10px;
}

.book {
  background-color: #f6f6f6;
  display: flex;
}

.book-left {
  width: 16%;

  .item {
    height: 40px;
    line-height: 40px;
    color: #332c2b;
    font-size: 16px;
    padding-left: 28px;
    cursor: pointer;

    &.active {
      background-color: #af2c30;
      color: #fff;
      border-radius: 10px;
    }
  }

}

.book-right {
  background-color: #fff;
  width: 100%;
  padding: 20px 25px;
  border-radius: 10px;

  .right-top {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 25px;

    .search {
      width: 380px;

      /deep/ input {
        background-color: #f6f6f6;
      }
    }

    .btn {
      margin-left: 18px;
      width: 120px;
      height: 40px;
      background-color: #af2c30;
      border-color: #af2c30;
      color: #fff;
      font-size: 16px;
    }

    .btn:hover {
      background-color: #df464b;
      border-color: #df464b;
    }

    .btn:active {
      background-color: #af2c30;
      border-color: #af2c30;
    }
  }


  .right-center {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 60px;

    .user-box {
      width: 49.5%;
      padding: 10px 20px;
      border: solid 1px #e5e5e5;
      border-radius: 5px;
      margin-bottom: 10px;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .avatar {
        width: 45px;
        height: 45px;
        margin-right: 20px;
        border-radius: 50%;
        border: 1px solid #e5e5e5;
      }

      .job {
        font-size: 18px;
        display: flex;
        align-items: flex-end;
      }

      .name {
        font-size: 20px;
        font-weight: bold;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;

      .info-box {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }

      .info-box:nth-child(even) {
        //margin-left: 10px;
      }

      .info-img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }

      .info-type {
        font-size: 14px;
        height: 26px;
        line-height: 26px;
        text-align: justify;

        &::after {
          content: "";
          display: inline-block;
          width: 100%;
        }
      }

      .info-content {
        font-size: 14px;
        height: 26px;
        line-height: 26px;
      }
    }
  }

  .right-bottom {
    /deep/ {
      .number {
        border: solid 1px #d7dad3;
        margin: 0 6px;
        border-radius: 4px;
        color: #999;
      }

      .number.active {
        background-color: #af2c30;
        color: #fff;
        border: solid 1px #af2c30;
      }
    }
  }
}

.links {
  width: 15%;
  background-color: #fff;
  padding: 30px 20px;
  margin-left: 10px;
  border-radius: 10px;

  .link-title {
    font-size: 20px;
    font-weight: bold;
    display: inline-block;
    margin-bottom: 25px;

    &::after {
      content: ' ';
      background-color: #af2c30;
      height: 3px;
      width: 100%;
      display: block;
      margin-top: 15px;
    }
  }

  .link-item {
    padding: 5px 10px;
    border-bottom: 1px solid #f6f6f6;
    color: #666;
    font-size: 16px;

    &:active {
      color: #af2c30;
    }
  }
}
</style>
