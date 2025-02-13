<template>
  <div class="regFooter">
    <div class="regFooterBox">
      <div class="footerTop">
        <div class="ComWidth">
          <span class="yqljTitle">友情链接：</span>
          <span class="yqljspan"><a href="" title="工业和信息化部">工业和信息化部</a>|</span>
          <span class="yqljspan"><a href="" title="国家国防科技工业局">国家国防科技工业局</a>|</span>
          <span class="yqljspan"><a href="" title="全军武器装备采购信息网">全军武器装备采购信息网</a>|</span>
          <span class="yqljspan"><a href="" title="河南省国防科技工业局技术开发中心">河南省国防科技工业局技术开发中心</a>|</span>
          <span class="yqljspan"><a href="" title="河南省军民融合装备技术创新中心">河南省军民融合装备技术创新中心</a></span>
        </div>
      </div>
      <div class="footerCenter">
        <div class="ComWidth clearfix">
          <div class="fl clearfix footerCenterBox">
            <div class="xszn fl">
              <p class="footerTitle">新手指南</p>
              <p class="footerP">免费注册</p>
              <p class="footerP">用户中心</p>
              <p class="footerP">平台介绍</p>
            </div>
            <div class="ptxx fl">
              <p class="footerTitle">平台信息</p>
              <p class="footerP">建设单位：</p>
              <p class="footerP">中共河南省委军民融合发展委员会办公室</p>
              <p class="footerP">技术支持：</p>
              <p class="footerP">河南省军融公共服务有限公司</p>
            </div>
            <div class="lxwm fl">
              <p class="footerTitle">联系我们</p>
              <p class="footerP">联系电话：</p>
              <p class="footerP">0371-82210651</p>
              <p class="footerP">电子邮箱：</p>
              <p class="footerP">hnjmrh@126.com</p>
              <p class="footerP">证书编码：</p>
              <p class="footerP">豫ICP备19010878号-1</p>
            </div>
            <div class="jjjd fl">
              <p class="footerTitle">纪检监督</p>
              <p class="footerP">举报电话：</p>
              <p class="footerP">0371-89878736</p>
              <p class="footerP">电子邮箱：</p>
              <p class="footerP">XXX@126.com</p>
            </div>
          </div>
          <div class="fr djBox">
            <div class="dzjg">
              <a href=""><img src="~@/assets/reg/djjg.png" alt="党政机关"></a>
            </div>
            <div class="wxgzh">
              <img src="~@/assets/reg/ewm.jpg" alt="微信公众号">
              <p>微信公众号</p>
            </div>
          </div>
        </div>
      </div>
      <div class="footerBottom">
        <span>豫公网安备 43010202001356号</span>
        <span>豫ICP备19010878号-1</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'regFooter',
}
</script>


<style scoped lang="scss">
* {
  margin: 0 0;
  padding: 0;
  list-style: none;
}

body {
  height: 100%
}

html {
  height: 100%
}

img {
  border: 0;
  vertical-align: middle;
}

a {
  text-decoration: none;
  outline: 0;
  cursor: pointer !important;
  color: #333;
}

input:focus {
  outline: none;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.block {
  display: block;
}

.none {
  display: none;
}

.clearfix:after {
  content: "";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}

.clearfix {
  zoom: 1;
}

.clear::after,
.clear::before {
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
}

.clear:after {
  clear: both;
}

.clear {
  zoom: 1;
}

.ComWidth {
  width: 1200px;
  margin: 0 auto;
}
/* 页面底部样式 */
.regFooterBox .footerTop {background:#f6f6f6;padding:30px 0 15px;border-bottom:1px solid #e5e5e5;}
.regFooterBox .footerTop span.yqljTitle {font-size:14px;font-weight:bold;color:#333;}
.regFooterBox .footerTop span.yqljspan {margin-right:9px;font-size:16px;color:#333333;}
.regFooterBox .footerTop span.yqljspan a {font-size:14px;color:#333333;margin-right:9px;}
.regFooterBox .footerTop span.yqljspan a:hover {color:#992230;}
.regFooterBox .footerCenter {padding:20px 0;background:#f6f6f6;}
.regFooterBox .footerCenter .footerCenterBox>div {margin-right:50px;}
.regFooterBox .footerCenter .footerCenterBox>div p.footerTitle {font-size:14px;font-weight:bold;color:#333333;position:relative;margin-bottom:10px;}
.regFooterBox .footerCenter .footerCenterBox>div p.footerTitle::before {content:"";display:inline-block;position:absolute;left:-10px;bottom:0;height:100%;width:unset;border-right:#992230 3px solid;}
.regFooterBox .footerCenter .footerCenterBox>div p.footerP {font-size:12px;font-weight:normal;color:#333;height:22px;line-height:22px;}
.regFooterBox .footerCenter .djBox {display:flex;justify-content:space-between;align-items:center;width: 260px;}
.regFooterBox .footerCenter .djBox .wxgzh {font-size:14px;text-align:center;}
.regFooterBox .footerCenter .djBox .wxgzh p {margin-top:12px;}
.regFooterBox .footerBottom {text-align:center;padding:10px 0;background:#992230;font-size:14px;color:#fff;font-weight:lighter;}
.regFooterBox .footerBottom span:first-child {margin-right:20px;}
</style>
