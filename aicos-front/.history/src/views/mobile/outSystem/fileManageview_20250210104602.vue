<template>
  <div>
    <Header />
    <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" :id="id" />
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/message'
import { getUserInfoPost } from "@/api/system/user";
import { saveOrUpdateListData, getById } from "@/api/outSystem/fileManage";
import { Toast } from 'vant';
export default {
  data () {
    const params = new URLSearchParams();
    params.append("name", '');
    return {
      options: {},
      list: [
        {
          type: 'input',
          label: '标题',
          prop: 'biaot',
        },
        {
          type: 'textarea',
          label: '简介',
          prop: 'jianj',
        },
        {
          type: 'danwei',
          label: '收文单位',
          show: false,
          multiple: true,
          columns: [],
          prop: 'shoujdw',
        },
        {
          type: 'upload',
          listType: 'text',
          label: '上传附件',
          prop: 'fuj',
          limit: 1,
          multiple: false,
          fileSize: 10000,
          tip: '',
          accept: '',
          dicUrl: '/aicos/api/aicos-file/miniofile/upload',
          dicMethod: 'post',
        },
      ],
      type: '',
      id: ''
    };
  },
  components: {
    Header,
    Message
  },
  ascreated () {
    this.onLoad()
  },
  methods: {
    onLoad () {
      this.type = this.$route.query.type
      this.id = this.$route.query.id
      getUserInfoPost().then(res => {
        const info = res.data.data
        if (this.type == 'add') {
          this.options.fabz = info.account
        }
      })
      if (this.type != 'add') {
        const params = new URLSearchParams();
        params.append("id", this.id);
        getById(params).then(res => {
          this.options = res.data.data
        })

      }
    },
    //新增
    add (options) {
      saveOrUpdateListData(options).then(() => {
        Toast.success('新增成功！');
        this.$router.go(-1)
      }, error => {
        window.console.log(error);
      });
    },
    //编辑
    edit (options) {
      saveOrUpdateListData(options).then(() => {
        Toast.success('编辑成功！');
        this.$router.go(-1)
      }, error => {
        window.console.log(error);
      });
    },
    //关闭
    close () {
      this.$router.go(-1)
    },
  }
}
</script>
<style>
html,
body,
#app {
  height: 100%;
  background-color: #F7F7F7;
}
</style>