<template>
  <div id="container">
    <el-select
      v-model="selectedValue"
      placeholder="选择你想看的数据吧！"
      style="width: 240px; margin-bottom: 16px;"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <div id="ul-wrapper">
      <template v-for="item in filteredDataList" >
        <!-- template里面不能放key -->
        <ul v-if="item" :key="item.id" class="data-card">
          <li v-for="(val, key) in item" :key="key">
            <span class="key">{{ key }}</span>
            <span class="val">{{ formatValue(key, val) }}</span>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import 'element-plus/dist/index.css'
import {sensorStore} from '../stores/sensorStore'
const dataStore = sensorStore()
let dataList = ref([])
let options = ref([])
const selectedValue = ref('')

const formatValue = (key, value) => {
  if (key === '创立时间') {
    return new Date(value).toLocaleString('zh-CN')
  }
  return value
}

const filteredDataList = computed(() => {
  if (!selectedValue.value) {
    return [dataList.value[0]]
  }
  return dataList.value.filter(item => item.id === selectedValue.value)
})

const getData = async () => {
  try {
    await dataStore.fetchData()
    const resData=dataStore.sensorValue()
    resData.proccessData.forEach(item => {
      options.value.push({ value: item.id, label: item.id })
    })
    dataList.value = resData.proccessData
    if (resData.proccessData.length > 0) {
      selectedValue.value = resData.proccessData[0].id
    }
  } catch (err) {
    console.error('请求出错：', err.message)
  }
}

onMounted(getData)
</script>

<style scoped>
#container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100%;
}
#ul-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}
.data-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  width: 280px;
  border: 1px solid rgba(33, 150, 243, 0.2);
  transition: all 0.3s ease;
}
.data-card li {
  display: flex;
  justify-content: space-between;
  line-height: 28px;
  border-bottom: 1px dashed #e0e0e0;
  padding: 4px 0;
}
.data-card li:last-child {
  border-bottom: none;
}
.key {
  color: #1976d2;
  font-weight: 500;
}
.val {
  color: #444;
}
.data-card li:first-child .val {
  color: #2196f3;
  font-weight: bold;
}
</style>
