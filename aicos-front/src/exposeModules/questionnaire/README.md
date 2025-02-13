此模块为在线调查打包出来的模块

## 模块导出组件
1. 在线调查列表页: aicosQuestionnaire.QusnList
2. 在线调查统计页: aicosQuestionnaire.Statistic
3. 在线调查题库管理: aicosQuestionnaire.BankList
4. 在线调查新增调查数据: aicosQuestionnaire.QusnDataAdd

## aisite中使用方式
在aisite中添加远程模块时，需要在地址后面添加`?name=模块名称`，如：?name=aicosQuestionnaire.QusnList
### 1、添加在线调查列表和在线调查统计菜单
菜单类型选择远程模块，模块链接为下面格式的链接，XXXX为需要替换的aicos的地址

  在线次调查列表页地址

http://XXXXX/aicos/exposeModules/questionnaire/aicosQuestionnaire.umd.min.js?name=aicosQuestionnaire.QusnList

在线统计列表页地址

http://XXXXXX/aicos/exposeModules/questionnaire/aicosQuestionnaire.umd.min.js?name=aicosQuestionnaire.Statistic

### 2、在线统计菜单的`是否通过前端隐藏`需要设置为隐藏
在线调查列表需要用到在线统计的菜单
注意：在线统计的菜单应该和在线调查同级，名字为`statistic`,例如： 在线调查列表为：'/questionnaire/qusnList'则统计为：'/questionnaire/statistic'
