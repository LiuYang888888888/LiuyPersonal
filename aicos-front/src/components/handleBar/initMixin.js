
import { getInitButtonByCurrentTaskId } from '@/api/system/flow'

export default {
  data() {
    return {
      handleButtons: [],
      handleButtonText: {}
    }
  },
  computed: {
    needInput() {
      return this.handleButtons.length > 0 && !this.handleButtons.includes('submit')
    }
  },
  watch: {
    data:{
      handler() {
        this.getButtons()
      },
      immediate: true
    }
  },
  methods: {
    async getButtons() {
      const row = this.data
      const params = {
        taskId: row.taskId,
        processDefinitionId: row.processDefinitionId,
        taskDefinitionKey: row.taskDefinitionKey,
        processInstanceId: row.processInstanceId
      }
      const {data:{data: buttons}} = await getInitButtonByCurrentTaskId(params)
      // console.log(buttons)
      const temp = {}
      const btnArr = buttons.map(item => {
        temp[item.value] = item.name
        return item.value
      })
      this.handleButtons = btnArr
      this.handleButtonText = temp
    },
    handleFormSubmit(passStatus) {
      const form = this.getForm()
      return form.handleFormSubmit({passStatus})
    },
    handlePrint() {
      const form = this.getForm()
      form.printForm()
    }
  }
}
