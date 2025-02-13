<template>
  <el-row :gutter="20" style="width: 100%;margin: 0 30px;">
    <el-col :span="24" class="leftMenu">
      <avue-chat ref="chat" :keylist="keylist" @keysend="handleSubmit" @keyadd="handleAdd" :config="config" width="100%"
        height="560" @submit="handleSubmit" v-model="msg" :list="list">
      </avue-chat>
    </el-col>
  </el-row>
</template>

<script>
import { extractKeywordsFromTxt } from "@/api/configure/aiAbility";
export default {
  name: "paramItemList",
  props: {
    // avueChatParams: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // }
  },
  data() {
    // const self = this;
    return {
      avueChatParams: {},
      config: {
        // img: 'https://gitee.com/uploads/61/632261_smallweigit.jpg',
        name: '',
        // dept: '这是一个神奇的前端框架'
      },
      keylist: [
      ],
      msg: '',
      list: [
        // {
        //   "date": "2019-07-17 23:25:15",
        //   "text": {
        //     "text": '1111'
        //   },
        //   "mine": true,
        //   "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547542562834&di=4d469265c6847a8f29393fe1038c64c8&imgtype=0&src=http%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FhFB4FUPIIlJSIN5vlQwX2OGlW03Oic9SdtXoOAgMmNBYxfpibmxyG6C0rf7Yml1YKQKrLbet5C4ebpmzGOJZ8icEQ%2F640%3Fwx_fmt%3Djpeg\t",
        //   "name": "我"
        // },
        // {
        //   "date": "2019-07-17 23:25:15",
        //   "text": {
        //     "text": "你说啥我听不懂啊"
        //   },
        //   "mine": false,
        //   "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547542538742&di=33c9b3d1ad6bdfe87eb19e44c8d0da04&imgtype=0&src=http%3A%2F%2Fcyjmw.shengyilu.com%2Fskin%2Findex%2Fimages_four%2Fpic_fi_32.png\t",
        //   "name": "云集汇通自助客服"
        // }
      ]
    };
  },
  mounted() {
    // this.handleSubmit('如何贷款')
  },
  computed: {},
  methods: {
    handleAdd(msg) {
      this.keylist.push(msg);
      this.$message.success('快捷回复语添加成功')
    },
    handleSubmit(msg) {
      this.msg = msg || this.msg
      this.$refs.chat.pushMsg({
        mine: true,
        text: this.msg
      });
      // this.$refs.chat.rootSendMsg(this.getMsg(this.msg));
      this.getMsg(this.msg)
      this.msg = '';
    },
    init(data) {
      this.avueChatParams = data
      // this.name = this.avueChatParams.label
      this.msg = this.avueChatParams.primitiveData.input_text
      this.list = []
    },
    //智能题库
    async getMsg(msg) {
      // if (msg === 'wel') {
      //   return {
      //     text: '您好，我是银行小客服，有什么可以帮助你的?',
      //     list: [{
      //       text: "如何申请贷款？",
      //       ask: '如何贷款'
      //     }]
      //   };
      // } else if (msg === '如何贷款') {
      //   return {
      //     text: `我行提供了如下贷款方式
      //       图片
      //       ${this.$refs.chat.getDetail({
      //       type: 'img',
      //       src: 'https://avuejs.com/images/logo-bg.jpg'
      //     })}
      //       视频
      //       ${this.$refs.chat.getDetail({
      //       type: 'video',
      //       src: 'https://www.w3school.com.cn/i/movie.ogg'
      //     })}
      //       语音
      //       ${this.$refs.chat.getDetail({
      //       type: 'audio',
      //       src: 'https://www.w3school.com.cn/i/horse.ogg'
      //     })}
      //       文件
      //       ${this.$refs.chat.getDetail({
      //       type: 'file',
      //       name: 'Avue的官网文件.doc',
      //       src: 'https://www.w3school.com.cn/i/movie.ogg'
      //     })}
      //       地图
      //       ${this.$refs.chat.getDetail({
      //       type: 'map',
      //       longitude: '116.307852',
      //       latitude: '40.057031',
      //       address: '这是一个很长很长这是一个很长很长的地址',
      //       src: 'https://www.w3school.com.cn/i/movie.ogg'
      //     })}`,
      //     list: [{
      //       text: "1.微信线上申请",
      //       ask: '微信线上申请'
      //     }, {
      //       text: "2.电话申请",
      //       ask: '电话申请'
      //     }, {
      //       text: "3.到网点申请",
      //       ask: '到网点申请'
      //     }]
      //   }
      // } else if (msg === '微信线上申请') {
      //   return '可关注***银行微信公众号，点击我要贷款，身份认证，发起申请。'
      // } else if (msg === '电话申请') {
      //   return '可拨打24小时热线96668或********'
      // } else if (msg === '到网点申请') {
      //   return '可就近选择网点，附网点列表及联系人'
      // }
      const params = this.avueChatParams
      params.RequestBody[params.RequestBody.abilityCode].input_text = msg
      delete params.RequestBody.result
      console.log(this.avueChatParams)
      const { data } = await extractKeywordsFromTxt({ ...params.RequestBody })
      let anser = data.data.reply
      if(params.RequestBody.abilityCode === 'chatgptForOpenAi'){
        anser = data.data.reply
      }
      if(params.RequestBody.abilityCode === 'chatgptForHuilan'){
        anser = data.data.speak_json.data.message
      }
      let requstAnswer = {
        "date": data.data.timestampString,
        "text": {
          "text": anser
        },
        "mine": false,
        "name": this.avueChatParams.label
      }
      this.list.push(requstAnswer)
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .avue-chat .web__logo {
  display: none;
}

/deep/ .avue-chat .web__main-item--mine {
  padding-right: 0px;
}

/deep/ .avue-chat .web__main-user img {
  display: none;
}

/deep/ .avue-chat .web__main-item--mine .web__main-text .web__main-arrow {
  display: none;
}

/deep/ .avue-chat .web__main-item {
  padding-left: 0px;
}

/deep/ .avue-chat .web__main-item--mine .web__main-user cite {
  right: 0px;
}

/deep/ .avue-chat .web__main-user cite {
  left: 0px;
}
/deep/ .avue-chat .web__tools {
  display: none;
}
</style>
