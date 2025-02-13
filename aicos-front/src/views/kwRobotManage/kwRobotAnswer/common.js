let socketConfig = null;
// import { getStore } from "@/util/store";
export default class socket {
  static register(url, data) {
    socketConfig = io.connect(url, {
      path: "/socket.io",
      //重连次数,Infinity无穷大
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      autoConnect: true,
      auth: { token: "123" },
      query: {
        ...data
      }
    });
    this.socketEvent();

  }
  static socketEvent(msg) {
    // const _this = this;

    socketConfig.on('connect', function () {
      console.log("connect,连接成功")
    });
    socketConfig.on('message', function (res) {
      // console.log(res);
      msg instanceof Function && msg(res)
    });
    socketConfig.on('disconnect', function () {
      console.log('断开连接')
    })
  }
  static socketDisconnect() {
    socketConfig.disconnect()
  }
  // static socketMessageEvent(res, callback) {
  //   console.log(res);
  // }

  // 发送图片，文件
  static sendImageFile() {
    var that = this;
    that.sendSocketEvent({
      message: '图片'
    });
  }

  // 发送事件
  static sendSocketEvent(sendData, data) {
    console.log(socketConfig)
    let messageText = '';
    if (sendData.message) {
      messageText = sendData.message.replace(/<(?!img).*?>/g, '');
      messageText = messageText.replace(/\n/g, '');
      messageText = messageText.replace(/\r/g, '');
      messageText = messageText.replace(/\t/g, '');
    }
    socketConfig.emit('message', {
      message: messageText ? messageText : '',
      sessionId: socketConfig.id,
      ...data
    })
  }
}

