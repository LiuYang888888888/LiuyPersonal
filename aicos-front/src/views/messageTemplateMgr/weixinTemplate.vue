<template>
  <div>
    <BaseTemplate ref="baseTpl" :extCls="columns" type="weixin" />
  </div>
</template>

<script>
import BaseTemplate from "./baseTemplate";
// import { getRules } from '@/util/regx'
export default {
  name: "WeixinTemplate",
  components: {
    BaseTemplate,
  },
  data() {
    return {
      columns: [
        {
          label: "模板配置",
          prop: "config",
          span: 24,
          type: "textarea",
          hide: true,
        },
        {
          label: "模板内容",
          prop: "content",
          type: "textarea",
          span: 24,
          hide: true,
        },
        {
          label: "所属公众号",
          prop: "weixinName",
          span: 24,
          searchLabelWidth: 100,
          // search: true,
        },
        {
          label: "模板类型",
          prop: "weixinType",
          span: 24,
          type: "select",
          width: 120,
          dicData: [
            {
              label: "订阅号",
              value: "0",
            },
            {
              label: "服务号",
              value: "1",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped></style>
