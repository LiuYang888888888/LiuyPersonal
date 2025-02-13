<template>
  <div class="deptTreeW">
    <el-row :gutter="20" >
      <el-col :span="18" >
        <div class="deptTree">
         <!--  <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input> -->
          <el-tree
            ref="deptTreeRef"
            v-model="selectData"
            :props="treeProps"
            :load="loadTreeNode"
            lazy
            show-checkbox
            :check-strictly="true"
            :check-on-click-node="true"
            :expand-on-click-node="false"
            @node-click="nodeClick"
            @check="nodeSelect"
            @node-expand="keepExpandedNode"
            :filter-node-method="filterNode"
            node-key="id"
            :default-expanded-keys="defaultExpandedNodes"
            :default-checked-keys="defaultCheckedNodes"
          >
            <template v-slot="{ node, data }">
              <div class="custom-tree-node">
                <div :title="node.label">{{ node.label }}</div>
                <div v-if="!node.isLeaf">
                  <el-button-group>
                    <!-- <el-button type="primary" size="mini" @click.stop="selectOnly(node, data)">只选此级</el-button> -->
                    <el-button type="primary" size="mini" @click.stop="selectAllChildren(node, data)">全选</el-button>
                    <el-button type="primary" size="mini" @click.stop="cancelAllChildren(node, data)">取消</el-button>
                  </el-button-group>
                </div>
              </div>
            </template>
          </el-tree>

        </div>
      </el-col>

      <el-col :span="6">
        <checkedList 
          :checkedListData="selectData" 
          :props="selectProps" 
          @itemRemove="handleRemove" 
          @itemRemoveAll="handleRemoveAll"
          title="已选部门"
        />
      </el-col>
    </el-row>
  
  <!-- <div>{{checkedData.type}}</div> -->
  <!-- <div>{{selectData}}</div> -->
  <!-- <div>{{checkedData.num.dept}}</div> -->

  </div>
</template>
<script>
import { getDeptTree, getDeptInfo } from "@/api/optOrg/optOrg";
import { isNull } from '@/util/qsgCommon.js';
import checkedList from "./checkedList";

export default {
  name: 'optDept',
  components: {
    checkedList,
  },
  props: {
    checkedData: {
      type: Object,
      default() {
        return {}
      }
    },
    toJanData: {
      type: Object,
      default() {
        return {
        }
      }
    },

  },

  data() {
    return {
      filterText: '',

      treeProps: {
        label: 'deptName',
        children: 'children',
        isLeaf: 'leaf',
        value: 'id',
      },

      defaultCheckedNodes: [], // 最终要回显的勾选key数组
      defaultExpandedNodes: ['0'], // 最终要回显的展开过的key数组

      selectTreeData:[],
      selectData:[],

      selectProps: {
        key: "id",
        label: "deptName",
      },

    }
  },
  methods: {
    getResData(){
      return this.selectData
    },

    async loadTreeNode(node, resolve) {
      if (node.level === 0) {
        this.initData();
        
        this.defaultCheckedNodes = [];

        let tempExpandedNodes = ['0'];
        this.selectData.map( async (item)=>{

          const deptInfo =  await getDeptInfo({id:item.id});

          const resData = deptInfo.data.data;
          
          if( resData.isLeaf != 1 ) {
            tempExpandedNodes.push(item.id);
          }
          resData.ancestors.split(',').map((info)=>{
            if(!isNull(info)){
              tempExpandedNodes.push(info);
            }
          })

        })

        this.defaultExpandedNodes = tempExpandedNodes;

        const rootNode = [ {deptName: '部门目录', id: '0', leaf: false} ];
        resolve(rootNode);

        this.$nextTick(() => {
          this.defaultCheckedNodes = this.selectData.map(item => {
            return item.id
          });
        });
      
      }else{
        const dataParam = {
          parentId: node.data.id,
        }
        await getDeptTree(dataParam).then((res) => {
          const dataRes = res.data.data.retList;
          resolve(dataRes.map(item => {
            return {
              ...item,
              leaf: item.isLeaf === '1'
            }
          }))
        });
      }
      
    },
    nodeClick(data,node){
      //console.log(node);

      if(!node.isLeaf){
        //console.log('自动打开子级');
        node.expand();
      }
    },

    selectOnly(node/*, data*/){
      node.setChecked(true);
    },

    selectAllChildren(node, data){

      node.setChecked(true);
      this.selectIn(data);

      node.expand(()=>{
        const children = node.childNodes;
        children.forEach(item=>{

          item.setChecked(true);
          this.selectIn(item.data);

          //item.collapse();
          if(!item.isLeaf){
            //console.log('自动打开子级');
            this.selectAllChildren(item,item.data);
          }

        })
      });
      
    },

    cancelAllChildren(node, data){
      node.setChecked(false);
      this.selectOut(data);

      node.expand(()=>{
        const children = node.childNodes;
        children.forEach(item=>{

          item.setChecked(false);
          this.selectOut(item.data);

          if(!item.isLeaf){
            //console.log('自动打开子级并取消');
            this.cancelAllChildren(item,item.data);
          }

        })
      });
      //折叠子级
      node.collapse();
    },

    nodeSelect(data,nodes){
      //console.log(data,nodes);
      this.selectTreeData = nodes.checkedNodes;
      //this.selectData =  nodes.checkedNodes;
    },
    
    hasSelected(data) {
      return this.selectTreeData.some( (item) => item.id === data.id );
    },
    selectIn(data){
      if( !this.hasSelected(data) ){
        this.selectTreeData.push(data);
      }
    },
    selectOut(data){
      this.selectTreeData = this.selectTreeData.filter((item)=>(item.id == data.id)?'':item);
    },

    handleRemove(item, index) {
      const node = this.$refs.deptTreeRef.getNode(item);
      node.setChecked(false);
      this.selectData.splice(index, 1);
    },
    handleRemoveAll(){
      this.$refs.deptTreeRef.setCheckedKeys([]);
      this.selectData = [];
    },

    initData(){
      //防止数据双向绑定，影响初始化
      const tempArr = [];
      this.checkedData.dept.map((item)=>{
        tempArr.push({...item});
      });
      this.selectData = tempArr;

      //this.selectData = this.checkedData.dept;
    },
    
    /*filterNode(value, data, node) {
      console.log(value, data)
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }*/

  },
  mounted(){
    this.initData();
  },
  watch:{
    "selectTreeData":{
      handler(newVal) {
        //console.log(newVal);
        //console.log('部门树选择变化');
        this.selectData = newVal ;
      },
      deep: true
    },
    "checkedData":{
      handler(/*newVal*/) {
        this.initData();
      },
      deep: true
    },
    /*filterText(val) {
      this.$refs.deptTreeRef.filter(val);
    }*/
  },
}
</script>

<style lang="scss" scoped>
.deptTree {
  height: 431px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  padding: 10px; 
}
.custom-tree-node {
  flex: 1;
  display: flex;
  width: 0;

  >div:first-child {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  >div:last-child {
    /deep/.el-button {
      padding: 4px 8px;
    }
  }

  /deep/.el-button-group {
    display: none;
  }

  &:hover {
    /deep/.el-button-group {
      display: block;
    }
  }
}
</style>

