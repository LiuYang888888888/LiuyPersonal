<template>
  <div style="height: 100%">
    <ViewModel @handlerChange="handlerChange" v-if="changeFlag" />
    <TableList @handlerChange="handlerChange" v-if="!changeFlag" />
  </div>
</template>

<script>
import ViewModel from "./viewModel";
import TableList from "./tableList";
export default {
  data() {
    return {
      changeFlag: true,
      robotInfo: "",
    };
  },
  components: {
    ViewModel,
    TableList,
  },
  methods: {
    handlerChange(type) {
      this.robotInfo = type.robotName;
      if (type.fromFlag == "view") {
        this.changeFlag = false;
      } else {
        this.changeFlag = true;
      }
    },
  },
};
</script>

<style></style>
