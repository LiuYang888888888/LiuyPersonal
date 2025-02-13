const publicPath = '/aicos/'
const express = require('express');
const path = require('path');

module.exports = {
  pages: {
    index: 'src/main.js',
    formPreview: 'src/formPreview.js'
  },
  //路径前缀
  publicPath: publicPath,
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    });
    // const entry = config.entry('app');
    // entry.add('babel-polyfill').end();
    // entry.add('classlist-polyfill').end();
    // entry.add('@/mock').end();

    // .mode('development')
    //   config.optimization.runtimeChunk({
    //     name: (entrypoint) => `runtime~${entrypoint.name}`,
    //   })
  },
  css: {
    extract: { ignoreOrder: true }
  },
  //开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
  devServer: {
    port: 1888,
    proxy: {
      [`${publicPath}api`]: {
        // logLevel: 'debug',
        // changeOrigin: true,
        //本地服务接口地址
        //target: 'http://192.168.3.193:30010/',  //王侃地址
        //target:'http://192.168.30.3:30010/',  //机房地址
        target:'http://192.168.50.216:30010/',   //远程地址
        //target: 'http://222.143.68.91:8090/',
        //target: 'http://172.20.0.147:30010/',   //测试服务器
        //target: 'http://172.16.10.249:30010/',  //秦一超地址
        // target: 'http://172.16.60.234:30010/',  //刘超地址
        // target: 'http://172.20.0.147:81/api',
        //target: 'http://172.16.20.253:30010/',
        // 周博策ip
        // target: 'http://172.16.20.251:30010/',
        // 韩许东ip
        // target:'http://172.16.20.245:30010/',
        /* 海洋本地 */
        // target:'http://172.16.20.254:30010',
        //远程演示服务地址,可用于直接启动项目
        //target: 'https://saber.bladex.vip/api',
        ws: true,
        pathRewrite: {
          [`^${publicPath}api`]: '/'
        },
      },
      '/socket.io': {
        changeOrigin: true,
        //本地服务接口地址
        // 周博策ip
        // target:'http://172.16.20.252:9081/',
        // 海洋
        // target:'http://172.16.20.254:30010',
        target: 'http://172.20.0.147:30010/',
        /* 滕堃本地 */
        // target:'http://172.16.20.204:9081/modelServer',
        ws: true,
      },
      //配置机器人页面代理
      '/aicos-robot': {
        changeOrigin: true,
        target: 'http://172.16.20.251:30010/',
      }
    },
    before(app/*, server*/) {
      app.use(`${publicPath}exposeModules`, express.static(path.join(__dirname, 'exposeModules')))
    }
  }
};
