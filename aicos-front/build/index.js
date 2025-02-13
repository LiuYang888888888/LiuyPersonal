/**
 * 该模块为打包远程调用模块的入口文件，用来打包被远程调用的模块
 * */
const fs = require('fs')
const childProcess = require('child_process')
const path = require("path")


const root = path.resolve(__dirname, '../src/exposeModules');

// 获取模块目录，过滤掉components目录
function getDirs(path, callback) {
  fs.readdir(path, {
    withFileTypes: true
  }, function(err, files) {
    if(!err) {
      // 过滤掉components目录
      const dirs = files.filter(file => file.isDirectory()&&file.name!=='components')
      callback(dirs)
    }else {
      console.log('获取目录出错')
    }
  });
}
// 生成编译模块的命令
const buildModuleExec = (dirs) => {
  const list = dirs.map(item=>{
    const dir = path.resolve(root, `${item.name}`);
    const entry = path.resolve(dir, 'index.js');
    const buildConfig = path.resolve(dir, 'buildConfig.js');
    const configFn = require(buildConfig);
    const confRes = configFn();
    const cmdStr = `npx vue-cli-service build --target lib --name ${confRes.libName} --dest exposeModules/${confRes.dir} --formats umd-min ${entry}`
    return cmdStr
  })
  return list
}

// 执行编译模块的命令
const runcmd = (cmdStr, callback) => {
  console.log('执行命令:' + cmdStr);
  childProcess.exec(cmdStr, function(err, stdout, stderr) {
    if(err) {
      console.log('编译模块报错:' + stderr);
    } else {
      console.log(stdout);
      callback()
    }
  });
}
// 编译模块
const buildModules = (entries) => {
  let curIndex = 0;
  let cur = entries[curIndex];
  const callback = function(){
    curIndex++;
    cur = entries[curIndex];
    if(cur) {
      runcmd(cur, callback)
    }
  };
  if(cur){
    runcmd(cur, callback)
  }
}
getDirs(root, function(dirs) {
  const entries = buildModuleExec(dirs)
  buildModules(entries)
});
