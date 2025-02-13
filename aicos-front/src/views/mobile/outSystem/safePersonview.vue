<template>
    <div>
        <Header />
        <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" :id="id" />
    </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/message'
import { getUserInfoPost } from "@/api/system/user";
import { saveOrUpdateListData, getById } from "@/api/outSystem/safeperson";
import { Toast } from 'vant';
export default {
    data() {
        return {
            options: {},
            list: [
                {
                    type: 'input',
                    label: '姓名',
                    prop: 'xingm',
                },
                {
                    type: 'choose',
                    label: '性别',
                    show: false,
                    dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                    dicMethod: 'post',
                    dicQuery: {
                        code: 'sex'
                    },
                    columns: [],
                    prop: 'xingb',
                    props: {
                        label: 'name',
                        value: 'name'
                    },
                },
                {
                    type: 'input',
                    label: '民族',
                    prop: 'minz',
                },
                {
                    type: 'input',
                    label: '单位名称',
                    prop: 'gongzdw',
                },
                {
                    type: 'choose',
                    label: '文化程度',
                    show: false,
                    dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                    dicMethod: 'post',
                    dicQuery: {
                        code: 'wenhuacd'
                    },
                    columns: [],
                    prop: 'wenhcd',
                    props: {
                        label: 'name',
                        value: 'name'
                    },
                },
                {
                    type: 'input',
                    label: '身份证号',
                    prop: 'shenfzh',
                },
                {
                    type: 'input',
                    label: '联系电话',
                    prop: 'shouj',
                },
                {
                    type: 'choose',
                    label: '职称',
                    show: false,
                    dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                    dicMethod: 'post',
                    dicQuery: {
                        code: 'zhicheng'
                    },
                    columns: [],
                    prop: 'zhic',
                    props: {
                        label: 'name',
                        value: 'name'
                    },
                },
                {
                    type: 'choose',
                    label: '单位类型',
                    show: false,
                    dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                    dicMethod: 'post',
                    dicQuery: {
                        code: 'dwxz'
                    },
                    columns: [],
                    prop: 'danwlx',
                    props: {
                        label: 'name',
                        value: 'name'
                    },
                },
                {
                    type: 'input',
                    label: '职务',
                    prop: 'zhiw',
                },

                {
                    type: 'input',
                    label: '分管工作',
                    prop: 'fenggz',
                },
                {
                    type: 'textarea',
                    label: '工作简介',
                    prop: 'gongzjl',
                },
                {
                    type: 'input',
                    label: '编号',
                    prop: 'bianh',
                },

                {
                    type: 'input',
                    label: '考核成绩',
                    prop: 'kaohcj',
                },
                {
                    type: 'upload',
                    label: '照片',
                    prop: 'zhaop',
                    limit: 1,
                    multiple: false,
                    fileSize: 10000,
                    tip: '只能上传jpg/png，且不超过10M',
                    accept: 'image/png, image/jpeg',
                    dicUrl: '/aicos/api/aicos-file/miniofile/upload',
                    dicMethod: 'post',
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
            saveOrUpdateListData(options).then(() => {
                Toast.success('新增成功！');
                this.$router.go(-1)
            }, error => {
                window.console.log(error);
            });
        },
        //编辑
        edit(options) {
            saveOrUpdateListData(options).then(() => {
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