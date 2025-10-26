<template>
  <div class="container">
    <el-aside width="200px" class="custom-aside">
      <el-menu
        router
        default-active="/home"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Location /></el-icon>
            <span>仪表盘</span>
          </template>
          <el-menu-item-group title="数据分类">
            <el-menu-item index="/home">
              <router-link to="/home">全部数据</router-link>
            </el-menu-item>
            <el-menu-item index="/realtime-info">
              <router-link to="/realtime-info">实时数据</router-link>
            </el-menu-item>
            <el-menu-item index="/history-info">
              <router-link to="/history-info">历史数据</router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <el-menu-item index="2">
          <el-icon><Grid /></el-icon>
          <span>设备管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><Document /></el-icon>
          <span>系统日志</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </div>
</template>

<script lang="ts" setup>
import {
  Location,
  Grid,
  Document,
  Setting,
} from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.container {
  width: 250px;
  height: auto;
}

.custom-aside {
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  height: auto;
}

.el-menu-item a {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
