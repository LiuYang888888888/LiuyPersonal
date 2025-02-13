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
import { saveOrUpdateListData, getById } from "@/api/outSystem/superVision";
import { Toast } from 'vant';
export default {
  data () {
    return {
      options: {},
      list: [
        {
          type: 'input',
          label: '单位名称',
          prop: 'danwmc',
        },
        {
          type: 'choose',
          label: '单位类型',
          show: false,
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'minbaoqiye'
          },
          columns: [
            {
              label: '企业单位',
              value: '1'
            },
            {
              label: '政府单位',
              value: '2'
            }
          ],
          prop: 'danwlx',
          props: {
            label: 'label',
            value: 'value'
          },
        },
        {
          type: 'area',
          label: '行政区划',
          dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
          dicMethod: 'post',
          prop: 'xingzqy',
          dicQuery: {}
        },
        {
          type: 'input',
          label: '部门',
          prop: 'bum',
        },
        {
          type: 'input',
          label: '职责',
          prop: 'zhiz',
        },
        {
          type: 'input',
          label: '联系人',
          prop: 'lianxr',
        },
        {
          type: 'input',
          label: '联系电话',
          prop: 'lianxdh',
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
  created () {
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