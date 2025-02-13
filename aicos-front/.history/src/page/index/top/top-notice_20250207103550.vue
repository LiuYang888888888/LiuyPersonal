<template>
  <el-popover
    ref="popover"
    placement="bottom"
    width="350"
    trigger="click"
  >

<!--    <el-tabs v-model="activeName">-->
<!--&lt;!&ndash;      <el-tab-pane label="邮件(1)" name="first"></el-tab-pane>&ndash;&gt;-->
<!--      <el-tab-pane :label="msgLabel" name="second"></el-tab-pane>-->
<!--&lt;!&ndash;      <el-tab-pane label="通知" name="third"></el-tab-pane>&ndash;&gt;-->
<!--    </el-tabs>-->
    <el-card
      :body-style="{padding: 0}"
    >
      <div slot="header" class="clearfix">
        <span>{{ msgLabel }}</span>
<!--        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
<!--        <router-link style="float: right;" to="/info/index"></router-link>-->
        <el-button
          style="float: right;padding: 2px 0"
          type="text"
          @click="handleMore"
        >更多</el-button>

      </div>
      <el-scrollbar style="height:300px">
        <avue-notice :data="data"
                     :option="option"
                     @click="handleClick"
                     @page-change="pageChange"></avue-notice>
      </el-scrollbar>
    </el-card>

    <div slot="reference">
      <el-badge :is-dot="totalMsg > 0">
        <slot>
          <i class="item-icon el-icon-bell"></i>
        </slot>
      </el-badge>
    </div>
  </el-popover>
</template>

<script>
import { getListPageByMessageParam, /*remove,*/ getMessageById } from '@/api/mywork/myMessage'
// let list = [{
//   img: '/img/bg/vip1.png',
//   title: '史蒂夫·乔布斯 关注了你',
//   subtitle: '05-08 15:08',
//   tag: '已经开始',
//   status: 0
// }, {
//   img: '/img/bg/vip2.png',
//   title: '斯蒂夫·沃兹尼亚克 关注了你',
//   subtitle: '05-08 15:08',
//   tag: '未开始',
//   status: 1
// }, {
//   img: '/img/bg/vip3.png',
//   title: '蒂姆·库克 关注了你',
//   subtitle: '05-08 15:08',
//   status: 3,
//   tag: '有错误'
// }, {
//   img: '/img/bg/vip4.png',
//   title: '比尔·费尔南德斯 关注了你',
//   subtitle: '05-08 15:08',
//   status: 4,
//   tag: '已完成'
// }];
export default {
  name: "top-notice",
  inject: ['desktop'],
  data () {
    return {
      activeName: 'second',
      option: {
        props: {
          img: 'img',
          title: 'title',
          subtitle: 'createTime',
          tag: 'tag',
          status: 'readStatus'
        },
      },
      data: [],
      totalMsg: 0
    }
  },
  created () {
    // this.getMessage()
    this.checkMsg()
  },
  computed: {
    msgLabel() {
      return `消息(${this.totalMsg})`
    }
  },
  methods: {
    pageChange (page, done) {
      // setTimeout(() => {
      //   this.$message.success('页码' + page)
      //   this.data = this.data.concat(list);
      //   done();
      // }, 1000)
      this.getMessage(page, done)

    },
    getMessage(page = 1, done) {
      const param = {
        current: page,
        size: 10,
        status: '1'
      }
      return getListPageByMessageParam(param).then(res => {
        const data = res.data.data;
        this.totalMsg = data.total;
        const temp = data.records.map(item=> {
          return {
            ...item,
            tag: item.status == '1' ? '未读' : '已读',
            readStatus: item.status == '1' ? 1 : 4
          }
        })
        this.data = this.data.concat(temp);
        if(done) {
          done()
        }
      });
    },
    async handleClick(item) {
      console.log(item)
      await getMessageById(item.id)

      item.tag = '已读';
      item.readStatus = 4;
      this.
    },
    async checkMsg() {
      // if(this.totalMsg > 0) {
      //   return
      // }
      await this.getMessage(1)

      // setTimeout(()=>{
      //   this.checkMsg()
      // }, 5000)
    },
    handleMore() {
      const data = {
        menuName: '用户信息',
        imageUrl: 'iconfont iconicon_principal',
        linkUrl: '/system/userinfo'
      }
      if(this.desktop) {
        this.$route.query.tab = null;
        this.desktop.handleItemClick(data)
      }else {
        this.$router.push('/info/index')
      }
    },
    // desktop模式时用来手动关闭弹出框
    closePopover() {
      this.$refs.popover.doClose()
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
