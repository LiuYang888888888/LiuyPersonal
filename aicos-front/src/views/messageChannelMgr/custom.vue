<template>
  <BaseChannel
    :extCls="extCls"
    :type="type"
  />
</template>

<script>
import BaseChannel from './components/baseChannel'
import {/*createUnique,*/ getRules} from '@/util/regx'
export default {
  name: 'CustomChannel',
  components: {
    BaseChannel
  },
  data() {
    return {
      type: 'custom',
      extCls: [
        {
          label: "附加参数",
          prop: "ext",
          type: 'dynamic',
          span: 24,
          hide: true,
          // 微信使用
          // viewDisplay: false,
          showColumn:false,
          children: {
            column: [
              {
                label: '参数名',
                prop: 'key',
                maxlength: 50,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message: "请输入参数名",
                    trigger: "blur"
                  },
                  // createUnique(this, 'form.ext', 'key'),
                  ...getRules(['charNumLineStartWidthChar'])
                ],
              },
              {
                label: '参数值',
                maxlength: 50,
                showWordLimit: true,
                prop: 'value',
                rules: getRules(['expectSpecials']),
              }
            ]
          }
        },
      ],
      // testFormOpt: {
      //   labelWidth: 100,
      //   column: [
      //     {
      //       label: '消息标题',
      //       prop: 'title',
      //       span: 24,
      //       hide: true,
      //       rules: [
      //         {
      //           required: true,
      //           message: "请输入消息标题",
      //           trigger: "blur"
      //         },
      //         ...getRules(['expectSpecials'])
      //       ]
      //     }
      //   ]
      // }
    }
  }
}
</script>

<style scoped>

</style>
