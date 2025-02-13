import Vue from "vue";

import VueClipboard from 'vue-clipboard2'  //复制到剪切板功能
import AvueUeditor from 'avue-plugin-ueditor';

import basicBlock from './components/basic-block/main';
import basicContainer from './components/basic-container/main';
import thirdRegister from './components/third-register/main';
import KnowledgeEditor from './components/knowledgeEditor/editorIndex';
import HuilanBasic from './components/basic';
import HuilanBasicHeader from './components/basic/header';
import HuilanBasicToolbar from './components/basic/toolbar';
import HuilanBasicSearchbar from './components/basic/searchbar';
import HuilanBasicActionTool from './components/basic/actionTool';
import HuilanActionTreeNode from './components/basic/actionTreeNode';
import HuilanSimpleSearchbar from './components/basic/simpleSearchbar';
import HuilanBasicAdvSearch from './components/basic/advSearch';
import TableLayout from './components/formFields/tableLayout'
import HtmlField from './components/formFields/HtmlField'
import HuilanDialog from "@/components/Dialog";


import serviceList from "@/config/serviceList";
import {baseURL} from "@/api/common";
import {loadScript} from './util/util'

// 注册全局容器
Vue.use(VueClipboard);
Vue.use(AvueUeditor);

Vue.component('basicContainer', basicContainer);
Vue.component('basicBlock', basicBlock);
Vue.component('thirdRegister', thirdRegister);
// Vue.component('avueUeditor', avueUeditor);
Vue.component('HuilanDialog', HuilanDialog);
Vue.component('KnowledgeEditor', KnowledgeEditor);
Vue.component('HuilanBasic', HuilanBasic);
Vue.component('HuilanBasicHeader', HuilanBasicHeader);
Vue.component('HuilanBasicToolbar', HuilanBasicToolbar);
Vue.component('HuilanBasicSearchbar', HuilanBasicSearchbar);
Vue.component('HuilanBasicActionTool', HuilanBasicActionTool);
Vue.component('HuilanActionTreeNode', HuilanActionTreeNode);
Vue.component('HuilanSimpleSearchbar', HuilanSimpleSearchbar);
Vue.component('HuilanBasicAdvSearch', HuilanBasicAdvSearch);
//表单设计器的table布局和自定义html
Vue.component('TableLayout', TableLayout);
Vue.component('HtmlField', HtmlField);


window.onload=()=>{
  // 异步加载表单设计器
  const formDesinerUrl = `${baseURL}cdn/form-design/index.umd.min.js`
  loadScript(formDesinerUrl).then(()=>{
    AvueFormDesign.updateUrl(serviceList, baseURL)
    Vue.use(window.AvueFormDesign)
  })

  // 异步加载问卷
  const questionnaireDesinerUrl = `${baseURL}cdn/questionnaire-design/index.umd.min.js`
  loadScript(questionnaireDesinerUrl).then(()=>{
    //添加问卷设计器
    Vue.use(window.AvueQuestionnaireDesign);
  })
  // 异步加载在线考试设计器
  const examDesignUrl = `${baseURL}cdn/exam-design/index.umd.min.js`
  loadScript(examDesignUrl).then(()=>{
    Vue.use(window.AvueExamDesign)
  })

  // 异步加载地图,优化页面加载时间
  window._AMapSecurityConfig = {
    securityJsCode:'7c3df0eef9bfb07a54ea0c5195380a3f',
  }
  loadScript('https://webapi.amap.com/maps?v=1.4.11&key=bb0fd23136157bca5efff729d98a2ec3&plugin=AMap.PlaceSearch').then(()=>{
    loadScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11')
  })
}


