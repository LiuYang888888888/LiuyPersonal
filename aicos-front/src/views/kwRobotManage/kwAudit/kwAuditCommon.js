import i18n from '@/lang';


export const tabOption = {
  column: [
    {
      label: i18n.t(`kwAudit.fqaKnowledge`),
      value: 1,
    },
    {
      label: i18n.t(`kwAudit.tableKnowledge`),
      value: 4,
    },
    {
      label: i18n.t(`kwAudit.documentKnowledge`),
      value: 2,
    },
    // {
    //   label: '对话流程',
    //   value: 5,
    // },
    {
      label: i18n.t(`kwAudit.chattingKnowledge`),
      value: 3,
    },
  ]
};

import {
  getKwAuditSetting,
  startKmProcess,
  auditKmData,
  kmProcessDetail,
} from "@/api/kwKnowledgeCenter/kwAudit/index.js";
import {
  Message,
  MessageBox,
} from 'element-ui';

export const kmAuditStart = async (data, kmType, processDefineId) => {

  const dataParam = {
    kmType: kmType,
    processDefinitionId: processDefineId,
    businessId: data.id,
    version: data.version,
  }
  await startKmProcess(dataParam).then((/* res */) => {
    Message({
      message: i18n.t('faq.checkTip'),
      type: "success",
    });
  }, error => {
    window.console.log(error);
  });
};

export const getAuditSetting = async (dataParam) => {
  const params = {
    ...dataParam,
  }
  let res = {};
  let resFun = await getKwAuditSetting(params);
  res = resFun.data.data || {};

  return res
}


// export const kmAuditColse = async (dataParam)=>{

//   return new Promise(async (resolve) => {
//     MessageBox.confirm("确定撤回该数据吗？", {
//       confirmButtonText: "确定",
//       cancelButtonText: "取消",
//       type: "warning",
//     }).then(async () => {

//       const res = await kmProcessDetail(dataParam);
//       const resData = res.data.data || {};
//       const params = {
//         passStatus: 'closeForWithdraw',
//         comment: '撤回',
//         processInstanceId: resData.processInstanceId,
//         processDefinitionId: resData.processDefinitionId,
//         taskDefinitionKey: resData.taskDefinitionKey,
//         taskId: resData.taskId,
//       };

//       auditKmData( params, "closeForWithdraw").then(()=>{
//         Message({
//           message: "撤回成功",
//           type: "success",
//         });
//         resolve();
//       }, error => {
//         window.console.log(error);
//       });

//       resolve();
//     }).catch(() => {

//       window.console.log("取消");
//       resolve();
//     });
//   });
// };


export const kmAuditColse = async (dataParam) => {

  return new Promise(async (resolve) => {
    try {
      await MessageBox.confirm(i18n.t('kwAudit.withdrawTips'), {
        confirmButtonText: i18n.t('aicosCommon.confirmBtn'),
        cancelButtonText: i18n.t('aicosCommon.cancelBtn'),
        type: "warning",
      });

      const res = await kmProcessDetail(dataParam);
      const resData = res.data.data || {};
      const params = {
        passStatus: 'closeForWithdraw',
        comment: i18n.t('faq.withdraw'),
        processInstanceId: resData.processInstanceId,
        processDefinitionId: resData.processDefinitionId,
        taskDefinitionKey: resData.taskDefinitionKey,
        taskId: resData.taskId,
      };

      await auditKmData(params, "closeForWithdraw");

      Message({
        message: i18n.t('kwAudit.withdrawSuccess'),
        type: "success",
      });

      resolve();
    } catch (error) {
      if (error === 'cancel') {
        resolve();
        return;
      } else {
        Message({
          message: i18n.t('kwAudit.operationFailed'),
          type: "success",
        });
        window.console.error(error);
        resolve();
      }
    }
  });
};

