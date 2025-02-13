import Vue from 'vue';

import AvueUeditor from 'avue-plugin-ueditor';
// import axios from './router/axios';
import store from './store';

Vue.use(AvueUeditor);

import FormPreview from './formPreview/index';

// console.log(FormPreview)
function render() {
  new Vue({
    render: h => h(FormPreview)
  }).$mount('#app');
}
const formProviewTools = window.formProviewTools = {}
if(store.getters.token) {
  render()
}else {
  formProviewTools.login = function(data) {
    return store.dispatch('LoginByUsername', data).then(()=> {
      render()
    })
  }
}


