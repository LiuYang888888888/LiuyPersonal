<template>
  <avue-ueditor v-model="content" v-bind="options"></avue-ueditor>
</template>

<script>
import serviceList from "@/config/serviceList";
import { baseURL } from "@/api/common";
export default {
  name: "index",
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      options: {
        action: `${baseURL}api/${serviceList.file}/miniofile/upload?fromSystemName=base`,
        props: {
          url: "newFileName",
          res: "data",
          home: baseURL.replace(/\/$/, ""),
        },
      },
    };
  },
};
</script>

<style scoped></style>
