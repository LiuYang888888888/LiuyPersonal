exposeModules 目录存放的时打包为远程模块的组件

## 导出步骤
1. 在exposeModules目录下创建一个目录，目录名为模块名称，如：userMgr
2. 在目录下创建index.js文件，该文件为模块的入口文件
3. 在目录下创建buildConfig.js文件，该文件打包时模块的配置文件。该模块为node模块，所以可以使用node的语法。
4. 导出的模块的模块名称都以`aicos`做为前缀。如：aicosUserMgr，这种做主要时为了和其它系统区分开防止冲突。

## 将所有模块分别打包的命令
```
npm run buid:exposeModule
```
