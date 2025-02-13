<template>
    <div>
        <Header />
        <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" :id="id"/>
    </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/message'
import { getUserInfoPost } from "@/api/system/user";
import { add, update, getById } from "@/api/outSystem/mbCompany";
import { Toast } from 'vant';
export default {
    data() {
        return {
            options: {},
            list: [
                {
                    type: 'input',
                    label: '企业名称',
                    prop: 'qiymc',
                },
                {
                    type: 'area',
                    label: '所属区域',
                    dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
                    dicMethod: 'post',
                    prop: 'suosqy',
                    dicQuery: {}
                },
                {
                    type: 'textarea',
                    label: '企业简介',
                    prop: 'qiyjj',
                },
                {
                    type: 'input',
                    label: '领导班子',
                    prop: 'lingdbz',
                },
                {
                    type: 'choose',
                    label: '企业类型',
                    show: false,
                    dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                    dicMethod: 'post',
                    dicQuery: {
                        code: 'dwxz'
                    },
                    columns: [],
                    prop: 'qiylx',
                    props: {
                        label: 'name',
                        value: 'name'
                    },
                },
                {
                    type: 'choose',
                    label: '销售区域',
                    show: false,
                    dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                    dicMethod: 'post',
                    dicQuery: {
                        code: 'xiaoshouquyu'
                    },
                    columns: [],
                    prop: 'xiaosqy',
                    props: {
                        label: 'name',
                        value: 'name'
                    },
                },
                {
                    type: 'input',
                    label: '企业资质',
                    prop: 'qiyzz',
                },
                {
                    type: 'input',
                    label: '产能',
                    prop: 'chann',
                },
                {
                    type: 'input',
                    label: '安全管理负责人',
                    prop: 'anqglfzr',
                },
                {
                    type: 'input',
                    label: '联系电话',
                    prop: 'lianxfs',
                },
            ],
            type: '',
            id: ''
        };
    },
    components: {
        Header,
        Message
    },
    created() {
        this.onLoad()
    },
    methods: {
        onLoad() {
            this.type = this.$route.query.type
            this.id = this.$route.query.id
            getUserInfoPost().then(res => {
                const info = res.data.data
                if (this.type == 'add') {
                    this.options.fabz = info.account
                }
            })
            if (this.type != 'add') {
                const params = new URLSearchParams();
                params.append("id", this.id);
                getById(params).then(res => {
                    this.options = res.data.data
                })
                
            }
        },
        //新增
        add(options) {
            add(options).then(() => {
                Toast.success('新增成功！');
                this.$router.go(-1)
            }, error => {
                window.console.log(error);
            });
        },
        //编辑
        edit(options) {
            update(options).then(() => {
                Toast.success('编辑成功！');
                this.$router.go(-1)
            }, error => {
                window.console.log(error);
            });
        },
        //关闭
        close() {
            this.$router.go(-1)
        },
    }
}
</script>
<style>
html,
body,
#app {
    height: 100%;
    background-color: #F7F7F7;
}
</style>