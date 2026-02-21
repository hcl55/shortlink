<template>
  <div class="login-page">
    <h1 class="title">短 链 分 享 系 统</h1>
    <div class="login-box">
      <div class="logon" :class="{ hidden: !isLogin }">
        <h2>用户登录</h2>
        <el-form ref="loginFormRef1" :model="loginForm" label-width="50px" :rules="loginFormRule">
          <div class="form-container1">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" maxlength="11" show-word-limit clearable>
                <template v-slot:prepend> 用户名 </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" clearable placeholder="请输入密码" show-password
                style="margin-top: 20px">
                <template v-slot:prepend> 密<span class="second-font">码</span> </template>
              </el-input>
            </el-form-item>
          </div>
          <div class="btn-gourp">
            <div>
              <el-checkbox class="remeber-password" v-model="checked"
                style="color: #64748b; margin: 0">记住密码</el-checkbox>
            </div>
            <div>
              <el-button :loading="loading" @keyup.enter="login" type="primary"
                @click="login(loginFormRef1)">登录</el-button>
            </div>
          </div>
        </el-form>
      </div>
      <div class="register" :class="{ hidden: isLogin }">
        <h2>用户注册</h2>
        <el-form ref="loginFormRef2" :model="addForm" label-width="50px" class="form-container" width="width"
          :rules="addFormRule">
          <el-form-item prop="username">
            <el-input v-model="addForm.username" placeholder="请输入用户名" maxlength="11" show-word-limit clearable>
              <template v-slot:prepend> 用户名 </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="mail">
            <el-input v-model="addForm.mail" placeholder="请输入邮箱" show-word-limit clearable>
              <template v-slot:prepend> 邮<span class="second-font">箱</span> </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="addForm.phone" placeholder="请输入手机号" show-word-limit clearable>
              <template v-slot:prepend> 手机号 </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="realName">
            <el-input v-model="addForm.realName" placeholder="请输入姓名" show-word-limit clearable>
              <template v-slot:prepend> 姓<span class="second-font">名</span> </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="addForm.password" type="password" clearable placeholder="请输入密码" show-password>
              <template v-slot:prepend> 密<span class="second-font">码</span> </template>
            </el-input>
          </el-form-item>
          <div class="btn-gourp">
            <div></div>
            <div>
              <el-button :loading="loading" @keyup.enter="login" type="primary"
                @click="addUser(loginFormRef2)">注册</el-button>
            </div>
          </div>
        </el-form>
      </div>
      <div class="move" ref="moveRef">
        <span style="font-size: 18px; margin-bottom: 25px; color: #f8fafc; font-weight: 300;">{{
          !isLogin ? '已有账号？' : '还没有账号？'
        }}</span>
        <span style="font-size: 14px; color: rgba(248, 250, 252, 0.7); letter-spacing: 1px;">{{
          !isLogin ? '欢迎登录账号' : '欢迎注册账号'
        }}</span>
        <el-button class="switch-btn" @click="changeLogin">{{
          !isLogin ? '去登录' : '去注册'
        }}</el-button>
      </div>
    </div>
  </div>
  <el-dialog v-model="isWC" title="人机验证" width="40%" :before-close="handleClose">
    <div class="verification-flex">
      <el-form class="form" :model="verification" :rules="verificationRule" ref="verificationRef">
        <el-form-item prop="code" label="验证码">
          <el-input v-model="verification.code" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isWC = false">取消</el-button>
        <el-button type="primary" @click="verificationLogin(verificationRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { setToken, setUsername, getUsername } from '@/core/auth.js'
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const API = proxy.$API
const loginFormRef1 = ref()
const loginFormRef2 = ref()
const router = useRouter()
const loginForm = reactive({ username: '', password: '' })
const addForm = reactive({ username: '', password: '', realName: '', phone: '', mail: '' })

const addFormRule = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '手机号必须是11位', trigger: 'blur' }
  ],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 15, message: '密码长度请在八位以上', trigger: 'blur' }
  ],
  mail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱号', trigger: 'blur' }
  ],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
})

const loginFormRule = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 15, message: '密码长度请在八位以上', trigger: 'blur' }
  ],
})

const addUser = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const res1 = await API.user.hasUsername({ username: addForm.username })
      if (res1.data.success !== false) {
        const res2 = await API.user.addUser(addForm)
        if (res2.data.success === false) {
          ElMessage.warning(res2.data.message)
        } else {
          const res3 = await API.user.login({ username: addForm.username, password: addForm.password })
          const token = res3?.data?.data?.token
          if (token) {
            setToken(token)
            setUsername(addForm.username)
            localStorage.setItem('token', token)
            localStorage.setItem('username', addForm.username)
          }
          ElMessage.success('注册登录成功！')
          router.push('/home')
        }
      } else {
        ElMessage.warning('用户名已存在！')
      }
    }
  })
}

const isWC = ref(false)
const verificationRef = ref()
const verification = reactive({ code: '' })
const verificationRule = reactive({ code: [{ required: true, message: '请输入验证码', trigger: 'blur' }] })
const verificationLogin = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const tempPassword = loginForm.password
      loginForm.password = verification.code
      const res1 = await API.user.login(loginForm)
      if (res1.data.code === '0') {
        const token = res1?.data?.data?.token
        if (token) {
          setToken(token)
          setUsername(loginForm.username)
          localStorage.setItem('token', token)
          localStorage.setItem('username', loginForm.username)
        }
        ElMessage.success('登录成功！')
        router.push('/home')
      } else if (res1.data.message === '用户已登录') {
        const cookiesUsername = getUsername()
        if (cookiesUsername === loginForm.username) {
          ElMessage.success('登录成功！')
          router.push('/home')
        } else {
          ElMessage.warning('用户已在别处登录，请勿重复登录！')
        }
      } else {
        ElMessage.error('请输入正确的验证码!')
      }
      loginForm.password = tempPassword
    }
  })
}

const login = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const res1 = await API.user.login(loginForm)
      if (res1.data.code === '0') {
        const token = res1?.data?.data?.token
        if (token) {
          setToken(token)
          setUsername(loginForm.username)
          localStorage.setItem('token', token)
          localStorage.setItem('username', loginForm.username)
        }
        ElMessage.success('登录成功！')
        router.push('/home')
      } else if (res1.data.message === '用户已登录') {
        const cookiesUsername = getUsername()
        if (cookiesUsername === loginForm.username) {
          ElMessage.success('登录成功！')
          router.push('/home')
        } else {
          ElMessage.warning('用户已在别处登录，请勿重复登录！')
        }
      } else if (res1.data.message === '用户不存在') {
        ElMessage.error('请输入正确的账号密码!')
      }
    }
  })
}

const loading = ref(false)
const checked = ref(true)
const isLogin = ref(true)
const moveRef = ref()
const changeLogin = () => {
  isLogin.value = !isLogin.value
  if (isLogin.value) {
    moveRef.value.style.transform = 'translate(0, 0)'
  } else {
    moveRef.value.style.transform = 'translate(-420px, 0)'
  }
}
</script>

<style lang="less" scoped>
.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
}

.login-box {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  padding: 0 40px;
  width: 700px;
  height: 480px;
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.5s ease-out;

  h2 {
    font-size: 24px;
    font-family: "PingFang SC", sans-serif;
    font-weight: 600;
    color: #1e293b;
    width: 100%;
    text-align: left;
    padding: 45px 0 25px 0;
  }

  .el-form-item {
    margin-bottom: 22px;
  }

  :deep(.el-input-group__prepend) {
    background-color: #f1f5f9;
    color: #475569;
    border-right: none;
  }

  .btn-gourp {
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-button {
      width: 120px;
      height: 42px;
      background: #0f172a;
      border: none;
      border-radius: 4px;
      &:hover {
        background: #334155;
      }
    }
  }
}

.move {
  position: absolute;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  align-items: center;
  background: #1e293b;

  .switch-btn {
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    width: 100px;
    margin-top: 30px;
    border-radius: 4px;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #fff;
    }
  }
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 15%;
  z-index: 999;
  font-size: 32px;
  color: #f8fafc;
  font-weight: 200;
  letter-spacing: 10px;
}

.logon, .register {
  width: 55%;
  display: flex;
  flex-direction: column;
}

.hidden {
  opacity: 0;
  pointer-events: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -48%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}

.second-font {
  margin-left: 13px;
}
</style>