
<script>
import website from '@/config/website';
import {getToken} from '@/util/auth';
import { checkAjaxHead } from '@/util/qsgCommon.js';

export default {
  name: 'HuilanUploader',
  inheritAttrs: false,
  data() {
    return {
      headers: {
        [website.tokenHeader]: getToken(),
      }
    }
  },
  render() {
    let tmpConfig = {
      url: this.$attrs.action,
      params: {},
      data: {},
    }
    const checkAjaxHeadRes = checkAjaxHead(tmpConfig);

    const attrs = {
      ...this.$attrs,
      headers: {
        ...this.headers,
        "Timestamp": checkAjaxHeadRes.Timestamp,
        "Sign": checkAjaxHeadRes.Sign,
        "EncryptType": checkAjaxHeadRes.encryptType,
      }
    }
    return(
      <el-upload {...{props: attrs}}>
        {this.$slots.default}
        <template slot="tip">
          {this.$slots.tip}
        </template>
      </el-upload>
    )
  }
}
</script>

