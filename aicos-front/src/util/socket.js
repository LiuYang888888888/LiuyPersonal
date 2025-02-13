
/**
 * 对 stomp 客户端进行封装
 */

//  socket
let socketConfig = null

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
      auth: {
        // token: getToken(),
        token: "123",
      },
      query: {
        ...data
      },
    });
    socketConfig.on("disconnect", function () {
      console.log("disconnect");
    });
    return socketConfig
  }
  static connect(msg) {
    // socketConfig.connect()
    socketConfig.on("connect", function () {
      console.log("连接成功")
      msg instanceof Function && msg({ type: 'connect' })
    });
  }
  static disconnect() {
    socketConfig.disconnect()
  }
  static joinRoom(jsonObject, msg) {
    socketConfig.on("JOIN_ROOM", function (data) {
      data.type = 'JOIN_ROOM'
      msg instanceof Function && msg(data)
    });
    socketConfig.emit('JOIN_ROOM', jsonObject)
  }
  static leaveRoom(jsonObject) {
    socketConfig.on("LEAVE_ROOM", function () {
      // console.log(data);
      console.log('离开');
      // msg instanceof Function && msg({ type: 'LEAVE_ROOM' })
    });
    socketConfig.emit('LEAVE_ROOM', jsonObject)
  }
  static chatEvent(msg) {
    socketConfig.on("chatevent", function (data) {
      if (data === '--') {
        data = {}
        data.type = 'chatevent'
        data.content = ''
      } else {
        if (data !== null) {
          data.type = 'chatevent'
        }
      }
      msg instanceof Function && msg(data)
    })
    socketConfig.emit('chatevent')
  }
}
