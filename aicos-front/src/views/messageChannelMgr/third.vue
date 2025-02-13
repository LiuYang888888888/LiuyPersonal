<template>
  <BaseChannel :extCls="extCls" :type="type" :testFormOpt="testFormOpt" />
</template>

<script>
import BaseChannel from "./components/baseChannel";
import { getRules } from "@/util/regx";
export default {
  name: "ThirdChannel",
  components: {
    BaseChannel,
  },
  data() {
    return {
      type: "third",
      extCls: [
        {
          label: "队列名称",
          prop: "routingKey",
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          showColumn: false,
          rules: [
            {
              required: true,
              message: "请输入队列名称",
              trigger: "blur",
            },
            ...getRules(["charNumLine"]),
          ],
        },
        {
          label: "交换器名称",
          prop: "exchangeName",
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          showColumn: false,
          rules: [...getRules(["charNumLine"])],
        },
      ],
      testFormOpt: {
        labelWidth: 100,
        column: [
          {
            label: "消息标题",
            prop: "title",
            span: 24,
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入消息标题",
                trigger: "blur",
              },
              ...getRules(["expectSpecials"]),
            ],
          },
        ],
      },
    };
  },
};
</script>

<style scoped>
</style>
