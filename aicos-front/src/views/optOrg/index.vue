<template>
  <div style="margin: 50px;">
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="checkeOrg(['user','dept','role','rank','dyna'])">选择</el-button>
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="checkeOrg(['user'])">只选用户</el-button>
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="checkeOrg(['dept'])">只选部门</el-button>
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="checkeOrg(['role'])">只选角色</el-button>
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="checkeOrg(['rank'])">只选职级</el-button>
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="checkeOrg(['dyna'])">只选动态绑定</el-button>
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="checkeOrg(['user','dept','role'])">选三个</el-button>
    <hr style="margin-top:50px;">
    <OptOrgDialog v-model="toDigData"></OptOrgDialog>
    <hr style="margin-top:50px;">
    <OptOrgDialog v-model="toDigData" :tabs="['user','dept','role']"></OptOrgDialog>
    <hr style="margin-top:50px;">
    <OptOrgDialog v-model="toDigData2" title="测试标题1" :tabs="['user','dept','dyna']"></OptOrgDialog>
    <hr style="margin-top:50px;">
    <OptOrgCommon v-model="ajaxCheckedData" title="测试标题" :tabs="['user','dept','dyna']" :dataView="true"></OptOrgCommon>
    <hr style="margin-top:50px;">
    <!-- <el-button icon="el-icon-check" size="small" type="primary" @click.stop="sendAjax()">测试发送ajax</el-button> -->
    <HuilanDialog :title="optTitle" :fullscreen="false" width="960px" append-to-body :visible.sync="optTag" :destroy-on-close="true">
      <optOrg ref="optOrgRef" :checkedData="ajaxCheckedData" />
      <template v-slot:footer>
        <el-button icon="el-icon-check" size="small" type="primary" @click="optOrgSave">确定</el-button>
        <el-button icon="el-icon-close" size="small" @click="optOrgClose">关闭</el-button>
      </template>
    </HuilanDialog>
    <avue-form ref="form" :option="option"></avue-form>
    <hr style="margin-top:50px;">
    <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
    <el-dialog
    title="提示"
    :visible.sync="dialogVisible"


    width="30%"
    :before-close="handleClose">
    <span>这是一段信息</span>
    :modal-append-to-body="false"
    :modal-append-to-body="true"
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>
<script>
import optOrg from './optOrg';


import OptOrgDialog from './OptOrgDialog';
import OptOrgCommon from './OptOrgCommon';

import {
  getUserList,
} from "@/api/optOrg/optOrg";

//import { testList } from "@/api/optOrg/optOrg";
//import { getOsTime } from '@/api/user'
//import { JSEncrypt } from 'jsencrypt';
//import md5 from 'js-md5';

//import { sortObject } from '@/util/qsgCommon.js';


export default {
  name: 'optIndex',
  components: {
    optOrg,
    OptOrgDialog,
    OptOrgCommon
  },
  data() {
    return {
      dialogVisible: false,

      optTag: false,
      optTitle: '选择',

      page: {
        pageSize: 5,
        currentPage: 1,
        total: 0,
        pageSizes: [5, 10, 20, 30, 40, 50, 100],
        pagerCount: 5,
        layout: "total, sizes, prev, pager, next, jumper",
      },

      option: {
        column: [{
          label: '表格选择器',
          prop: 'table',
          type: 'table',
          children: {
            border: true,
            column: [{
              label: '姓名',
              width: 120,
              search: true,
              searchSpan: 24,
              prop: 'account'
            }, {
              label: '性别',
              prop: 'sex'
            }],
          },
          formatter: (row) => {
            if (!row.name) return ''
            return row.name + '-' + row.sex
          },
          onLoad: ({
            page,
            value,
            data
          }, callback) => {

            //console.log('onLoad', page, value, data)

            //首次加载去查询对应的值
            if (value) {
              this.$message.success('首次查询' + value)
              callback({
                id: '0',
                name: '张三',
                sex: '男',
                age: 18
              })
              return
            }
            if (data) {
              this.$message.success('搜索查询参数' + JSON.stringify(data))
              //console.log('搜索查询参数'+JSON.stringify(data))
            }
            if (page) {
              this.$message.success('分页参数' + JSON.stringify(page))
              //console.log('分页参数'+JSON.stringify(page))
            }

            //分页查询信息
            // callback({
            //   total: 12,
            //   data: [{
            //     id: '0',
            //     name: '张三',
            //     sex: '男',
            //     age: 18
            //   }, {
            //     id: '1',
            //     name: '李四',
            //     sex: '女',
            //     age: 18
            //   }, ]
            // })

            //const { realName,  } = data || {};
            let searchData = {}
            if (this.$refs.form.$refs.table[0].$refs.temp.$refs.crud) {
              searchData = this.$refs.form.$refs.table[0].$refs.temp.$refs.crud.$refs.headerSearch.searchForm;
              //searchData = this.$refs.form.$refs.table[0].$refs.temp.$refs.crud.$refs.headerSearch.searchForm || {};
              //console.log(searchData)
            }

            getUserList({
              deptId: 0,
              ...data,
              ...searchData,
              current: page.currentPage,
              size: page.pageSize,
            }).then((res) => {
              const data = res.data.data;

              callback({
                total: data.total,
                data: data.records,
              });
            });
          },
          props: {
            label: 'account',
            value: 'id'
          }
        }]
      },

      ajaxCheckedData: {
        type: ['user', 'dept', 'role', 'rank', 'dyna'],
        num: {
          user: {
            max: 10,
          },
          dept: {
            max: 3,
            min: 2,
          },
          role: {
            max: 12,
            min: 6,
          },
          rank: {
            max: 5,
            min: 2,
          },
          dyna: {
            max: 15,
            min: 2,
          },
        },
        user: [
          /*{ "account": "lilei", "birthday": "", "createTime": "2022-11-03 13:44:45", "createUser": "admin", "deleted": 0, "deptName": "部门1", "email": "", "fromSystem": "AiCOS", "id": "12", "isAdmin": "0", "isLock": "0", "isNew": "0", "lastLoginTime": "2022-11-12 13:51:02", "loginTryTimes": 0, "mobile": "", "realName": "李磊", "remark": "", "roles": [ { "createTime": "2022-11-01 13:02:23", "createUser": "admin", "deleted": 0, "id": "1587309053141401602", "roleName": "qsg002", "tenantId": "000000", "updateTime": "2022-11-01 13:02:23", "updateUser": "admin" } ], "sex": "1", "status": "1", "tel": "", "tenantId": "000000", "updateTime": "2022-11-12 13:51:02", "updateUser": "admin", "$index": 1 },
          { "account": "QSGTEST1105", "birthday": "", "createTime": "2022-11-03 10:59:51", "createUser": "admin", "deleted": 0, "deptName": "部门1", "email": "", "fromSystem": "", "id": "QSGTEST1105", "isAdmin": "0", "isLock": "0", "isNew": "1", "lastLoginTime": "2022-11-10 15:14:50", "loginTryTimes": 0, "mobile": "", "realName": "QSGTEST1105", "remark": "", "roles": [], "sex": "1", "status": "1", "tel": "", "tenantId": "000000", "updateTime": "2022-11-10 15:14:50", "updateUser": "admin", "$index": 2 } */
        ],
        dept: [
          /*{ "ancestors": "", "createUser": "admin", "deleted": "0", "deptLevel": 1, "deptName": "部门1", "fromSystem": "", "id": "e5ad13fb-a078-4e16-9d0d-b4def99ab52f", "isLeaf": "0", "isManager": "1", "leaderId": "1", "parentId": "0", "remark": "王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试部门王宇测试", "sort": 1, "tenantId": "000000", "updateTime": "2022-11-03 11:00:04", "updateUser": "admin", "leaf": false },
          { "ancestors": "", "createTime": "2022-08-02 14:54:37", "createUser": "admin", "deleted": "0", "deptLevel": 1, "deptName": "同步部门222", "fromSystem": "", "id": "1554359999354183682", "isLeaf": "1", "isManager": "1", "leaderId": "", "parentId": "0", "remark": "同步部门222", "sort": 139, "tenantId": "000000", "updateTime": "2022-08-02 14:54:37", "updateUser": "admin", "leaf": true },
          { "ancestors": "", "createTime": "2022-08-02 14:59:35", "createUser": "admin", "deleted": "0", "deptLevel": 1, "deptName": "同步部门3333", "fromSystem": "", "id": "1554361249466490882", "isLeaf": "1", "isManager": "1", "leaderId": "", "parentId": "0", "remark": "同步部门3333", "sort": 140, "tenantId": "000000", "updateTime": "2022-08-02 15:41:07", "updateUser": "admin", "leaf": true },
          { "ancestors": "1560550056553455617,1560550630141304834", "createTime": "2022-08-19 17:15:00", "createUser": "admin", "deleted": "0", "deptLevel": 3, "deptName": "奥术大师大121241", "fromSystem": "AiCOS", "id": "1560555923415867393", "isLeaf": "1", "isManager": "1", "leaderId": "", "parentId": "1560550630141304834", "remark": "的服务慰问费", "sort": 154, "tenantId": "000000", "updateTime": "2022-08-19 17:15:00", "updateUser": "admin", "leaf": true },
          { "ancestors": "1560550056553455617", "createTime": "2022-08-19 17:14:12", "createUser": "admin", "deleted": "0", "deptLevel": 2, "deptName": "完全的群无无群多群", "fromSystem": "AiCOS", "id": "1560555722160578561", "isLeaf": "1", "isManager": "1", "leaderId": "1560535547473141761", "parentId": "1560550056553455617", "remark": "气温低群群无无群多群", "sort": 153, "tenantId": "000000", "updateTime": "2022-08-19 17:14:12", "updateUser": "admin", "leaf": true },
          { "ancestors": "", "createTime": "2022-08-19 17:15:44", "createUser": "admin", "deleted": "0", "deptLevel": 1, "deptName": "测试部门11111", "fromSystem": "AiCOS", "id": "1560556107541618689", "isLeaf": "0", "isManager": "1", "leaderId": "", "parentId": "0", "remark": "啊大大", "sort": 155, "tenantId": "000000", "updateTime": "2022-08-19 17:18:41", "updateUser": "admin", "leaf": false },
          { "ancestors": "1560556107541618689,1560556382952202242", "createTime": "2022-08-19 17:17:11", "createUser": "admin", "deleted": "0", "deptLevel": 3, "deptName": "七大擦acacia阿达撒出", "fromSystem": "AiCOS", "id": "1560556472785805314", "isLeaf": "1", "isManager": "1", "leaderId": "", "parentId": "1560556382952202242", "remark": "", "sort": 157, "tenantId": "000000", "updateTime": "2022-08-19 17:17:11", "updateUser": "admin", "leaf": true }, { "ancestors": "", "createTime": "2022-09-26 11:39:33", "createUser": "admin", "deleted": "0", "deptLevel": 1, "deptName": "顶级测试部门", "fromSystem": "AiCOS", "id": "1574242242158141442", "isLeaf": "1", "isManager": "1", "leaderId": "1574234920400723969", "parentId": "0", "remark": "", "sort": 184, "tenantId": "000000", "updateTime": "2022-09-26 11:39:33", "updateUser": "admin", "leaf": true },
          { "ancestors": "", "createTime": "2022-09-29 08:58:58", "createUser": "admin", "deleted": "0", "deptLevel": 1, "deptName": "weinn部门", "fromSystem": "", "id": "1575288994953019394", "isLeaf": "0", "isManager": "1", "leaderId": "", "parentId": "0", "remark": "", "sort": 186, "tenantId": "000000", "updateTime": "2022-09-29 10:57:54", "updateUser": "admin", "leaf": false },
          { "ancestors": "1575288994953019394", "createTime": "2022-09-29 10:57:37", "createUser": "admin", "deleted": "0", "deptLevel": 2, "deptName": "testnn子部门01", "fromSystem": "", "id": "1575318853012013057", "isLeaf": "0", "isManager": "1", "leaderId": "1575289217230159874", "parentId": "1575288994953019394", "remark": "", "sort": 187, "tenantId": "000000", "updateTime": "2022-09-29 10:58:14", "updateUser": "admin", "leaf": false },
          { "ancestors": "1575318853012013057,1575288994953019394", "createTime": "2022-09-29 10:58:14", "createUser": "admin", "deleted": "0", "deptLevel": 3, "deptName": "子部门0101", "fromSystem": "", "id": "1575319008809435137", "isLeaf": "1", "isManager": "1", "leaderId": "1575304640784875521", "parentId": "1575318853012013057", "remark": "", "sort": 189, "tenantId": "000000", "updateTime": "2022-09-29 10:58:14", "updateUser": "admin", "leaf": true },
          { "ancestors": "1575288994953019394", "createTime": "2022-09-29 10:57:54", "createUser": "admin", "deleted": "0", "deptLevel": 2, "deptName": "testnn子部门02", "fromSystem": "", "id": "1575318926882095106", "isLeaf": "1", "isManager": "1", "leaderId": "", "parentId": "1575288994953019394", "remark": "", "sort": 188, "tenantId": "000000", "updateTime": "2022-09-29 10:57:54", "updateUser": "admin", "leaf": true }*/
        ],
        role: [
          /*{ "createTime": "2022-09-28 17:09:48", "createUser": "admin", "deleted": 0, "id": "1575050127284965378", "roleName": "weinn权限测试", "tenantId": "000000", "updateTime": "2022-09-28 17:09:48", "updateUser": "admin", "$index": 1, "$createUser": "admin" },
          { "createTime": "2022-09-26 10:55:46", "createUser": "admin", "deleted": 0, "id": "1574231226485579777", "roleName": "aisiterole", "tenantId": "000000", "updateTime": "2022-09-26 10:55:46", "updateUser": "admin", "$index": 2, "$createUser": "admin" },*/
        ],
        rank: [],
        dyna: [{
          label: "申请人de",
          prop: "applicant",
          value: false,
        }, {
          label: "申请人直属de领导",
          prop: "applicantLeader",
          value: true,
        }, {
          label: "提交人直属领导",
          prop: "submitterLeader",
          value: false,
          tips: "提交人直属领导111",
        }, ]
      },

      toDigData: {
        "list": [
          /*{
            "type": "user",
            "id": "QSGTEST1105",
            "name": "QSGTEST1105"
          },
          {
            "type": "role",
            "id": "1587309053141401602",
            "name": "qsg002"
          },
          {
            "type": "role",
            "id": "1586916879140769793",
            "name": "all角色权限1031"
          },
          {
            "type": "role",
            "id": "1575050127284965378",
            "name": "weinn权限测试"
          },
          {
            "type": "dept",
            "id": "e5ad13fb-a078-4e16-9d0d-b4def99ab52f",
            "name": "部门1"
          },
          {
            "type": "dept",
            "id": "1575318926882095106",
            "name": "testnn子部门02"
          },*/
        ],
        /*"applicant": false,
        "applicantLeader": true,
        "submitterLeader": false,
        "aaa": '1111111',*/
      },
      toDigData2: {
        "list": [
          /*{
            "type": "user",
            "id": "admin",
            "name": "admin"
          },
          {
            "type": "role",
            "id": "1587309053141401602",
            "name": "qsg002"
          },
          {
            "type": "role",
            "id": "1586916879140769793",
            "name": "all角色权限1031"
          },
          {
            "type": "dept",
            "id": "e5ad13fb-a078-4e16-9d0d-b4def99ab52f",
            "name": "部门1"
          },*/
        ],
        /*"applicant": true,
        "applicantLeader": false,
        "submitterLeader": true*/
      },
    }
  },
  methods: {
    checkeOrg(types) {

      this.ajaxCheckedData.type = types;
      this.optTitle = '选择组织架构';
      this.optTag = true;
    },
    optOrgSave() {
      //console.log('optOrgSave');

      const resData = this.$refs.optOrgRef.getResData();
      let rex = resData.user.length + '个用户；' + resData.dept.length + '个部门；' + resData.role.length + '个角色；'
      this.$message.success(rex);
      //console.log(resData);

      //console.log(resData.dyna);

      //this.optTag = false;
    },
    optOrgClose() {

      //console.log('optOrgClose');
      this.optTag = false;
    },

    /*// RSA加密
    RSAEncrypted(data) {
      const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCYeEL/rpGmbQNmG/+QDpsr231PPYS7ZqUTtIax/tNKI7DhSG9OFbU7tPamXDooNC58uJ3jQbusV/9kSkuKoas9U9sN6UXc71uaC8T+PRzhMGkU0m9UWi+nsOQoKZjrFIla9wDeJPFW0Lq8OAPUHNMBVqjuOZ2fi3kNpMx5LxwfJQIDAQAB';

      let encryptor = new JSEncrypt();

      encryptor.setPublicKey(publicKey);

      return encryptor.encrypt(data);
    },*/

    /*sortObject(objData){
      let resObj =  {};
      Object.keys(objData).sort().map(key=> {
        if( typeof objData[key] === 'object' && !Array.isArray(objData[key]) ){
          resObj[key] = this.sortObject(objData[key]);
        }else{
          resObj[key] = objData[key];
        }

      })
      return resObj
    },*/

    // async sendAjax(){



    //   // await getOsTime().then((res)=>{
    //   //   OsNow = res.data.data.timestamp;
    //   // })
    //   //const uriParam = window.location.search;
    //   //const uriParam = encodeURI('?metObjName=dyf_aicos_linjqgxjsqyxxsjxt_1779&systemCode=AiCOS&templateId=1574685133396246530&zzz=汉字');



    //   // let resObj =  {};
    //   // Object.keys(uriParam).sort().map(key=> {
    //   //   if( typeof uriParam[key] === 'object' ){
    //   //     if( Array.isArray(uriParam[key]) ){
    //   //       resObj[key+'[]'] = JSON.stringify( uriParam[key] );
    //   //     }else{
    //   //       resObj[key] = '['+JSON.stringify(uriParam[key])+']';
    //   //     }

    //   //   }else{
    //   //     resObj[key] = '['+uriParam[key]+']';
    //   //   }

    //   // })
    //   // console.log(resObj)



    //   //let uriParamSort = sortObject(uriParam);

    //   // let uriParamSort = resObj;

    //   // console.log(uriParam);
    //   // console.log( decodeURI(uriParam) );
    //   // console.log( uriParamSort );

    //   // let tempArr = [];
    //   // for( let key in uriParam){
    //   //   let item = key+'='+uriParam[key];
    //   //   tempArr.push(item);
    //   // }


    //   // let uriParamForHead = encodeURI( '?'+tempArr.join('&') );

    //   // console.log(uriParamForHead)

    //   // let OsNow = new Date().getTime();
    //   // console.log( OsNow );

    //   //const url = '/aicos-system/baseAppstore/product/list';

    //   const uriParam = {
    //     sss:123,
    //     metObjName: 'dyf_aicos_123',
    //     systemCode: 'AiCOS',
    //     templateId: '1574685133396246530',
    //     zzz: '汉字',
    //     objJson:{
    //       c:3,
    //       a:1,
    //       b:2,
    //       '1s':{
    //         c:3,
    //         a:1,
    //         b:{
    //           c:3,
    //           a:1,
    //           b:2,
    //         },
    //       }
    //     },
    //     //listParam:[1,2,3],
    //     /*listJson:[
    //       {"d":"value3"},
    //       {"a":"value1"},
    //       {"b":"value2"},
    //     ],*/
    //   }

    //   const dataParam = {
    //     "6type":0,
    //     "1type":0,
    //     "2type":0,
    //     "type":0,
    //     "current":1,
    //     "size":10,
    //     "size5":10,
    //     "size2":10,
    //     "size4":10,
    //     "enabled":1,
    //     "systemCode":"",
    //     "objJson":{
    //       "d":"value3",
    //       "a":"value1",
    //       "b":"value2",
    //       "4b":{
    //         "d":"value3",
    //         "a":"value1",
    //         "b":"value2",
    //         "4b":"value4",
    //         "2b":"value5",
    //         "a1":"value8"
    //       },
    //       "2b":"value5",
    //       "a1":"value8",
    //       "hhhh":"valuepp"
    //     },
    //     "name":"",
    //     "origin":0,
    //     "status":1,
    //     "status367":'汉字222',
    //     "listJson":[
    //       {"d":"value3"},
    //       {"a":[{"d":"valua3"}, {"b":"valua2"}],},
    //       //{ "gg" :{"d":"valua3", "b":"valua2"} },
    //       {"b":"value2"},
    //       {"4b":"value4"},
    //       {"2b":"value5"},
    //       {"a1":"value8"},
    //     ],
    //   };
    //   console.log('排序前',dataParam)

    //   // let dataParamSort = sortObject(dataParam);


    //   // console.log('排序后',dataParamSort)


    //   // console.log( JSON.stringify(dataParam) );

    //   // const textSign = "Timestamp"+OsNow+"Uri"+ url +'QueryParam'+JSON.stringify(uriParamSort)+'Data'+JSON.stringify(dataParamSort);

    //   // const textSign = "Timestamp"+OsNow+"Uri"+ url +'Data'+JSON.stringify(dataParamSort);

    //   // console.log( textSign );


    //   // const md5Sign = md5(textSign);
    //   // console.log( md5Sign ) ;

    //   // let dccdd = 'Timestamp1670575429514Uri/aicos-system/baseAppstore/product/listQueryParam{"listJson[]":"[{\"d\":\"value3\"}, {\"a\":\"value1\"}, {\"b\":\"value2\"}]","listParam[]":"[1, 2, 3]","metObjName":"[dyf_aicos_123]","objJson":"[{\"c\":3,\"a\":1,\"b\":2}]","sss":"[123]","systemCode":"[AiCOS]","templateId":"[1574685133396246530]"}Data{"1type":0,"2type":0,"6type":0,"current":1,"enabled":1,"listJson":[{"d":"value3"},{"a":"value1"},{"b":"value2"},{"4b":"value4"},{"2b":"value5"},{"a1":"value8"}],"name":"","origin":0,"size":10,"size2":10,"size4":10,"size5":10,"status":1,"systemCode":"","type":0}';
    //   // const dccc = md5(dccdd);
    //   // console.log( dccc ) ;

    //   // const dcctt = md5('Timestamp1670575429514Uri/aicos-system/baseAppstore/product/listQueryParam{"listJson[]":"[{\"d\":\"value3\"}, {\"a\":\"value1\"}, {\"b\":\"value2\"}]","listParam[]":"[1, 2, 3]","metObjName":"[dyf_aicos_123]","objJson":"[{\"c\":3,\"a\":1,\"b\":2}]","sss":"[123]","systemCode":"[AiCOS]","templateId":"[1574685133396246530]"}Data{"1type":0,"2type":0,"6type":0,"current":1,"enabled":1,"listJson":[{"d":"value3"},{"a":"value1"},{"b":"value2"},{"4b":"value4"},{"2b":"value5"},{"a1":"value8"}],"name":"","origin":0,"size":10,"size2":10,"size4":10,"size5":10,"status":1,"systemCode":"","type":0}');
    //   // console.log( dcctt ) ;

    //   // const headParam = {
    //   //   "Timestamp":OsNow,
    //   //   "Sign": md5Sign,
    //   // }

    //   // console.log(headParam);
    //   // console.log( JSON.stringify(headParam) );

    //   // testList(uriParam,dataParam,headParam).then((res) => {
    //   //   const dataRes = res.data.data;
    //   //   console.log(dataRes);
    //   //   this.$message.success( dataRes.records.length+'个结果' );
    //   // })


    //   testList(uriParam,dataParam).then((res) => {
    //     const dataRes = res.data.data;
    //     console.log(dataRes);
    //     this.$message.success( dataRes.records.length+'个结果' );
    //   })

    // },


  },
  watch: {
    /*"ajaxCheckedData":{
      handler(newVal) {
        console.log('ajaxCheckedData根变化')
        console.log(newVal)
      },
      deep: true
    },*/

  },
}

</script>
<style lang="scss" scoped>
</style>
