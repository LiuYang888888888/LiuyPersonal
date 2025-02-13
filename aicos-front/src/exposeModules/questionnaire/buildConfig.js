/**
 * 组件打包配置文件, 打包出来的组件存放在exposeModules目录下,
 * 这个模块是一个node模块，所以可以使用node的语法
 * npx vue-cli-service build --target lib --name Questionnaire --dest lib/Questionnaire --formats umd-min ./src/libByModule/questionnaire.js
 */

module.exports =  function () {
  return {
    dir: 'questionnaire',
    libName: 'aicosQuestionnaire',
  }
}
