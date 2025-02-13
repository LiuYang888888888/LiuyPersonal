// 页面1数据
export const listData1 = [
  {
    id: "1",
    name: "心理健康评估模型",
    code: "mental_health_model",
    url: "http://172.20.0.26:38080/BigModel/mentalHealth",
    location: "http://172.20.0.26:38080/BigModel/mentalHealth/echo",
    type: "云端",
    deleted: 0,
    tenantId: null,
    createUser: "admin",
    createTime: "2023-09-08 15:33:38",
    updateUser: "admin",
    updateTime: "2023-09-08 15:33:43"
  },
  {
    id: "2",
    name: "睡眠质量评估模型",
    code: "sleep_quality_model",
    url: "http://172.20.0.27:38080/BigModel/sleepQuality",
    location: "http://172.20.0.27:38080/BigModel/sleepQuality/echo",
    type: "云端",
    deleted: 0,
    tenantId: null,
    createUser: "admin",
    createTime: "2023-09-08 15:37:12",
    updateUser: "admin",
    updateTime: "2023-09-08 15:37:24"
  }
];
// 测试中数据
export const testList = [
  {
    tenantId: "000000",
    createUser: "admin",
    createTime: "2023-09-11 15:24:49",
    updateUser: "admin",
    updateTime: "2023-09-11 15:24:50",
    id: "1701134686786924545",
    robotId: null,
    detectionType: 1,
    detectionTask: "DETECTION_1694417089513",
    detectionStatus: 4,
    detectionNum: 522,
    abnormalNum: 355,
    deleted: 0
  },
  {
    tenantId: "000000",
    createUser: "admin",
    createTime: "2023-09-11 15:24:49",
    updateUser: "admin",
    updateTime: "2023-09-11 15:25:21",
    id: "1701134686891782146",
    robotId: null,
    detectionType: 2,
    detectionTask: "DETECTION_1694417089513",
    detectionStatus: 4,
    detectionNum: 5993,
    abnormalNum: 191,
    deleted: 0
  },
  {
    tenantId: "000000",
    createUser: "admin",
    createTime: "2023-09-11 15:24:49",
    updateUser: "admin",
    updateTime: "2023-09-11 15:25:21",
    id: "1701134686942113793",
    robotId: null,
    detectionType: 3,
    detectionTask: "DETECTION_1694417089513",
    detectionStatus: 4,
    detectionNum: 1,
    abnormalNum: 1,
    deleted: 0
  }
];
// 测试结果数据
export const resultData = [
  {
    id: "1",
    taskName: "员工心理健康", // 任务名称
    modelInstance: "心理健康评估模型", // 测试模型实例
    testNum: "3", // 测试轮次
    testStatus: "start", // 测试状态 --- start未开始
    deleted: 0,
    tenantId: null,
    createUser: "admin",
    createTime: "2023-09-09 11:14:27",
    updateUser: "admin",
    updateTime: "2023-09-09 11:26:04"
  },
  {
    id: "2",
    taskName: "小学生睡眠质量", // 任务名称
    modelInstance: "睡眠质量评估模型", // 测试模型实例
    testNum: "1", // 测试轮次
    testStatus: "test", // 测试状态 --- test测试中
    deleted: 0,
    tenantId: null,
    createUser: "admin",
    createTime: "2023-09-10 09:03:48",
    updateUser: "admin",
    updateTime: "2023-09-10 09:17:31"
  }
];
// 页面2数据
export const listData2 = [
  {
    id: "1",
    question: "心理健康",
    answer: "心理健康评估模型",
    status: "2", // 知识状态
    audit: "2", // 审核状态
    enable: "1", // 启用状态
    deleted: 0,
    tenantId: null,
    createUser: "admin",
    createTime: "2023-09-11 12:33:38",
    updateUser: "admin",
    updateTime: "2023-09-11 15:17:43"
  },
  {
    id: "2",
    question: "睡眠质量",
    answer: "睡眠质量评估模型",
    status: "1", // 知识状态
    audit: "1", // 审核状态
    enable: "2", // 启用状态
    deleted: 0,
    tenantId: null,
    createUser: "admin",
    createTime: "2023-09-11 17:33:28",
    updateUser: "admin",
    updateTime: "2023-09-08 18:21:03"
  }
];
