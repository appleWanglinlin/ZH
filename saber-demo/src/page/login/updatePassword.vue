// 首次登录修改密码 和 点击右上角修改密码
<template>
  <div :class="['page-mode h-100 d-flex justify-content-center align-items-center',''][mode]">
    <div class="pwd-container">
      <div v-if="mode===0" class="p-3 fs-4 fw-bold border-bottom">首次登录修改密码</div>
      <el-form ref="ruleForm"
               v-loading="loading"
               :model="ruleForm"
               :rules="rules"
               status-icon
               size="small"
               label-width="100px"
               class="form-box"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword"
                    placeholder="请输入原密码"
                    type="password"
                    auto-complete="off"
                    show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword"
                    placeholder="请输入新密码"
                    type="password"
                    auto-complete="off"
                    show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword1">
          <el-input v-model="ruleForm.newPassword1"
                    placeholder="请输入确认密码"
                    type="password"
                    auto-complete="off"
                    show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { resetRouter } from '@/router/router'
import { updatePwd } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'UpdatePassword',
  props: {
    // 显示模式： 0 页面（初始修改密码页面）， 1 弹窗修改密码（点击右上角的修改密码）
    mode: {
      type: Number,
      default: 0
    }
  },
  data() {
    // 密码规则：大小写，数字，特殊字符4种任意选三种长度8-16
    const reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/
    const valOldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else if (value === this.ruleForm.newPassword) {
        callback(new Error('新密码与原密码不能一致'))
      } else {
        // if (this.ruleForm.oldPassword !== '') {
        //   this.$refs.ruleForm.validateField('oldPassword')
        // }
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === this.ruleForm.oldPassword) {
        callback(new Error('新密码与原密码不能一致'))
      } else if (!reg.test(value)) {
        callback(new Error('密码规则：大小写，数字，特殊字符4种任意选三种长度8-16'))
      } else {
        if (this.ruleForm.newPassword1 !== '') {
          this.$refs.ruleForm.validateField('newPassword1')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else if (!reg.test(value)) {
        callback(new Error('密码规则：大小写，数字，特殊字符4种任意选三种长度8-16'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        newPassword1: '',
        userId: '1'
      },
      rules: {
        // oldPassword: [{ required: false, message: '原密码不能为空', trigger: 'blur' }],
        oldPassword: [{ validator: valOldPassword, trigger: 'blur' }],
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        newPassword1: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    submitForm() {
      // console.log(this.userInfo)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // 注意：该组件在 服务中心 和 租户中心 都会用到。如果修改密码接口参数有变动，需要注意两个平台对应的改动
          updatePwd(Object.assign({}, this.ruleForm, { userId: this.userInfo.user_id })).then(res => {
            this.$message.success('修改密码成功')
            this.logout()
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 退出登录
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        resetRouter()
        this.$router.push({ path: '/login' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-mode {
  .pwd-container {
    border: 1px #ddd solid;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    width: 500px;
  }
  .form-box {
    padding: 1rem 1rem 0;
  }
}
</style>
