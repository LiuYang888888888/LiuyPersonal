<template>
  <HuilanBasic class="sysIndexTop">
    <div class="m-title">工作台</div>
    <div class="m-tools">
      <div v-for="(item, index) in workbenchList" :key="item" class="m-t-model" @click="toMenu(item)">
        <div class="model">
          <div class="img">
            <img :src="item.icon" alt=""/>
          </div>
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </HuilanBasic>
</template>