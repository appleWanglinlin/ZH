<template>
  <el-form ref="loginForm"
           :rules="loginRules"
           :model="loginForm"
           class="login-form"
           status-icon
           label-width="0"
           @submit.native.prevent="handleLogin"
  >
    <el-form-item v-if="isSaas" prop="tenantId">
      <el-input v-model="loginForm.tenantId"
                :placeholder="$t('login.tenantId')"
                size="small"
                auto-complete="off"
                :autofocus="!loginForm.tenantId"
      >
        <i slot="prefix" class="el-icon-id" />
      </el-input>
    </el-form-item>
    <el-form-item prop="username">
      <el-input v-model="loginForm.username"
                :placeholder="$t('login.username')"
                size="small"
                auto-complete="off"
                :autofocus="!loginForm.username"
      >
        <i slot="prefix" class="el-icon-user" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password"
                :type="passwordType"
                :placeholder="$t('login.password')"
                size="small"
                auto-complete="off"
                :autofocus="!loginForm.password"
      >
        <i slot="suffix" class="el-icon-view el-input__icon" @click="showPassword" />
        <i slot="prefix" class="el-icon-lock" />
      </el-input>
    </el-form-item>
    <el-form-item v-if="website.captchaMode" prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input v-model="loginForm.code"
                    :placeholder="$t('login.code')"
                    size="small"
                    auto-complete="off"
                    :autofocus="!loginForm.code"
          >
            <i slot="prefix" class="el-icon-captcha" />
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="loginForm.image" class="login-code-img" @click="refreshCode">
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="w-100 mt-4" plain native-type="submit">{{ $t('login.submit') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCaptcha } from '@/api/user'
import { setStore, getStore } from '@/util/store'
import { isSaas } from '@/config/env'
import { omit } from '@/util/util'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { setRefreshTokenTime } from '@/plugins/utils/autoRefreshToken'

export default {
  name: 'Userlogin',
  data() {
    const { tenantId = '', username = '' } = getStore({ name: 'login', type: 'local' }) || {}
    return {
      loginForm: {
        // 租户ID
        tenantId,
        // 用户名
        username,
        // 密码
        password: '',
        // 账号类型
        type: 'account',
        // 验证码的值
        code: '',
        // 验证码的索引
        key: '',
        // 预加载白色背景
        image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        fp: '' // 客户端指纹
      },
      passwordType: 'password',
      isSaas
    }
  },
  computed: {
    ...mapGetters(['tagWel']),
    loginRules() {
      const rules = {
        tenantId: [{ required: true, message: '请输入租户ID', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      }
      if (this.website.captchaMode) {
        rules.code = [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              callback(/^[a-z\d]{4,8}$/i.test(value) ? undefined : new Error('验证码格式错误'))
            },
            trigger: 'blur'
          }
        ]
      }
      return rules
    }
  },
  created() {
    document.title = '登录'
    this.refreshCode()
    this.getFingerprint()
  },
  methods: {
    // 获取客户端指纹
    getFingerprint() {
      FingerprintJS.load().then(fp => {
        fp.get().then(d => {
          this.loginForm.fp = d.visitorId
        })
      })
    },
    refreshCode() {
      getCaptcha().then(data => {
        this.loginForm.key = data.key
        this.loginForm.image = data.image
      })
    },
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后。。。',
            spinner: 'el-icon-loading'
          })
          const data = omit(this.loginForm, !this.isSaas ? ['tenantId'] : [])
          this.$store.dispatch('LoginByUsername', data).then(res => {
            if (res.password_expired) {
              // this.$message('用户首次登录必须先更改其密码')
              this.$router.push({ name: 'UpdatePassword' })
            } else {
              setStore({
                type: 'local',
                name: 'login',
                content: {
                  tenantId: this.loginForm.tenantId,
                  username: this.loginForm.username
                }
              })
              // 记录第一次获取token的时间
              setRefreshTokenTime()
              this.$router.push({ path: this.tagWel.value })
            }
            loading.close()
          }).catch(() => {
            loading.close()
            this.refreshCode()
          })
        }
      })
    }
  }
}
</script>
