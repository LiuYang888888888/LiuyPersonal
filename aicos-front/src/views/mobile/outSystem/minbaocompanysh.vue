<template>
    <div>
        <Header />
        <div style="margin-top: 50px;">
            <van-field v-model="formVerifyText" rows="5" autosize label="审核意见" type="textarea" maxlength="300"
                placeholder="请输入审核意见" show-word-limit />

            <div style="margin-top: 40px;width: 100%;display: flex;justify-content: space-around;">
                <van-button round type="danger" style="width: 30%;" @click="dataMagVerifyYes"
                    :loading="btnLoading">审核通过</van-button>
                <van-button round type="warning" style="width: 30%;" @click="dataMagVerifyNo"
                    :loading="btnLoading">审核不通过</van-button>
                <van-button round block type="default" @click="close" style="width: 30%;">关闭</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import { Toast } from 'vant';
import { disagree, complete } from "@/api/outSystem/mbCompany";
export default {
    data() {
        return {
            id: '',
            formVerifyText: '',
            btnLoading: false,
        }
    },
    components: {
        Header
    },
    created() {
        this.onLoad()
    },
    methods: {
        onLoad() {
            this.id = this.$route.query.id
        },
        dataMagVerifyYes() {
            this.btnLoading = true;
            const params = new URLSearchParams();
            params.append("id", this.id);
            params.append("processReason", this.formVerifyText);
            complete(params).then(() => {
                Toast.success('操作成功！');
                this.btnLoading = false;
                this.formVerifyText = ''
                this.$router.go(-1)
            }, (error) => {
                window.console.log(error);
            })
        },
        dataMagVerifyNo() {
            this.btnLoading = true;
            const params = new URLSearchParams();
            params.append("id", this.id);
            params.append("processReason", this.formVerifyText);
            disagree(params).then(() => {
                Toast.success('操作成功！');
                this.btnLoading = false;
                this.formVerifyText = ''
                this.$router.go(-1)
            }, (error) => {
                window.console.log(error);
            })
        },
        //关闭
        close() {
            this.$router.go(-1)
        }
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