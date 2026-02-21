<template>
  <div class="common-layout">
    <el-container class="main-layout-container">
      <el-header height="54px" style="padding: 0; z-index: 10;">
        <div class="header">
          <div @click="toMySpace" class="logo">
            <span class="logo-text">主页</span>
          </div>
          <div style="display: flex; align-items: center">
            <el-dropdown trigger="hover">
              <div class="block user-block">
                <span
                  class="name-span"
                  style="text-decoration: none"
                >{{username}}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="custom-dropdown">
                  <el-dropdown-item @click="toMine">个人信息</el-dropdown-item>
                  <el-dropdown-item divided @click="logout" style="color: #f56c6c;">退出系统</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <el-main class="main-container">
        <div class="content-box">
          <RouterView class="content-space" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { removeKey, removeUsername, getToken, getUsername } from '@/core/auth.js'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const API = proxy.$API
const router = useRouter()
const squareUrl = ref('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')

const toMine = () => {
  router.push('/home' + '/account')
}

const logout = async () => {
  const token = getToken()
  const username = getUsername()
  await API.user.logout({ token, username })
  removeUsername()
  removeKey()
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
  ElMessage.success('成功退出！')
}

const toMySpace = () => {
  router.push('/home' + '/space')
}

const username = ref('')

onMounted(async () => {
  const actualUsername = getUsername()
  const res = await API.user.queryUserInfo(actualUsername)
  username.value = truncateText(actualUsername, 8)
})

const extractColorByName = (name) => {
  var temp = []
  temp.push('#')
  for (let index = 0; index < name.length; index++) {
    temp.push(parseInt(name[index].charCodeAt(0), 10).toString(16))
  }
  return temp.slice(0, 5).join('').slice(0, 4)
}

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
</script>

<style lang="scss" scoped>
.common-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5; 
}

.main-layout-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  height: 100%;
  width: 100%;
  padding: 0 24px;
  background-color: #24292e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: opacity 0.3s;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #409eff; 
      border-radius: 2px;
      margin-right: 12px;
    }

    .logo-text {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: 1px;
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  .user-block {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.name-span {
  color: #e5e6eb;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.main-container {
  flex: 1;
  padding: 20px !important; 
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-box {
  flex: 1;
  width: 100%;
  background-color: #ffffff;
  border-radius: 6px; 
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04); 
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-space {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.custom-dropdown .el-dropdown-menu__item {
  padding: 8px 20px;
  font-size: 14px;
}
</style>