import {setStore, getStore} from '@/util/store'
import {diff} from '@/util/util'
import website from '@/config/website'

const isFirstPage = website.isFirstPage;
// const tagWel = website.fistPage;
let tagWel = getStore({name: 'tagWel'}) || {
  value: ''
};
const tagObj = {
  label: '', //标题名称
  value: '', //标题的路径
  params: '', //标题的路径参数
  query: '', //标题的参数
  meta: {},//额外参数
  group: [], //分组
}

//处理首个标签
function setFistTag(list) {
  if (list.length === 1) {
    list[0].close = false;
  } else {
    list.forEach(ele => {
      if (ele.value === tagWel.value && isFirstPage === false) {
        ele.close = false
      } else {
        ele.close = true
      }
    })
  }
}


const navs = {
  state: {
    tagList: getStore({name: 'tagList'}) || [],
    tag: getStore({name: 'tag'}) || tagObj,
    tagWel: tagWel
  },
  actions: {},
  mutations: {
    ADD_TAG: (state, action) => {
      if(state.tagWel.value === action.value && state.tagWel.label === '') {
        state.tagWel = action
        tagWel = action
      }
      state.tag = action;
      setStore({name: 'tag', content: state.tag})
      if (state.tagList.some(ele => diff(ele, action))) return
      state.tagList.push(action)
      setFistTag(state.tagList);
      setStore({name: 'tagList', content: state.tagList})
    },
    DEL_TAG: (state, action) => {
      state.tagList = state.tagList.filter(item => {
        return !diff(item, action);
      })
      setFistTag(state.tagList);
      setStore({name: 'tagList', content: state.tagList})
    },
    DEL_ALL_TAG: (state) => {
      state.tagList = state.tagWel.label ? [state.tagWel]:[];
      setStore({name: 'tagList', content: state.tagList})
    },
    DEL_TAG_OTHER: (state) => {
      state.tagList = state.tagList.filter(item => {
        if (item.value === state.tag.value) {
          return true;
        } else if (!website.isFirstPage && item.value === tagWel.value) {
          return true;
        }
      })
      setFistTag(state.tagList);
      setStore({name: 'tagList', content: state.tagList})
    },
    SET_TAG_LIST(state, tagList) {
      state.tagList = tagList;
      setStore({name: 'tagList', content: state.tagList})
    },
    SET_TAG_WEL(state, payload) {
      state.tagWel = payload
      tagWel = payload
      setStore({name: 'tagWel', content: payload})
    }
  }
}
export default navs
