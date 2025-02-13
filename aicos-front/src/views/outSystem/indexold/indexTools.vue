<template>
  <div class="toolBox">
    <div class="sysIndexTitle">
      <p>
        <span>常用工具</span>
      </p>
    </div>
    <div class="cygj">
      <div class="toolLi toolLi1">
        <p>
          <a href="#">信用查询</a>
          <img src="~@/assets/outSystem/jt.png" />
        </p>
      </div>
      <div class="toolLi toolLi2">
        <p>
          <a href="#">规模自测</a>
          <img src="~@/assets/outSystem/jt.png" />
        </p>
      </div>
      <div class="toolLi toolLi3">
        <p>
          <a href="#">抽考系统</a>
          <img src="~@/assets/outSystem/jt.png" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>


export default {

}
</script>

<style scoped lang="scss">
.sysIndexTitle {
  border-bottom: 1px solid #e0e0e0;
}

.sysIndexTitle p {
  margin: 0;
  height: 36px;
  line-height: 36px;
}

.sysIndexTitle p span {
  border-bottom: 4px solid #af2c30;
  display: inline-block;
  font-weight: bold;
}

.cygj {}

.cygj .toolLi {
  padding: 30px 70px;
  margin-top: 20px;
  box-sizing: border-box;
  background: url('~@/assets/outSystem/bg1.jpg') center no-repeat;
  background-size: cover;
}

.cygj .toolLi2 {
  background: url('~@/assets/outSystem/bg2.jpg') center no-repeat;
  background-size: cover;
}

.cygj .toolLi3 {
  background: url('~@/assets/outSystem/bg3.jpg') center no-repeat;
  background-size: cover;
}

.cygj .toolLi p {
  margin: 0;
  display: flex;
  align-items: center;
}

.cygj .toolLi p a::before {
  content: '';
  display: inline;
  width: 1px;
  height: 100%;
  border-left: 6px solid #952232;
  margin-left: -12px;
  position: absolute;
}

.cygj .toolLi p a {
  display: inline-block;
  height: 100%;
  position: relative;
  font-weight: bold;
}

.cygj .toolLi p img {
  margin-left: 20px;
  transition: all .6s;
}

.cygj .toolLi p:hover img {
  margin-left: 40px;
}
</style>
