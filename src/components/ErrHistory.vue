<template>
  <div class="container">
    <h3 class="title">查看故障记录</h3>

    <el-select 
      v-model="selectedValue" 
      placeholder="选择设备" 
      class="select-box"
    >
      <el-option 
        v-for="item in selection" 
        :key="item.value" 
        :label="item.label" 
        :value="item.value" 
      />
    </el-select>

    <div class="errhistory-wrapper">
      <div class="errhistory-box">
        <el-splitter lazy>
          <el-splitter-panel 
            collapsible 
            min="50" 
            v-for="item in filterValue" 
            :key="item.id"
          >
            <div class="panel">
              <ul>
                <li v-for="(val, key) in item" :key="val">
                  <span class="key">{{ key }}：</span>
                  <span class="value">{{ val }}</span>
                </li>
              </ul>
            </div>
          </el-splitter-panel>
        </el-splitter>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {sensorStore} from '../stores/sensorStore'

const dataStore=sensorStore()
const selection = ref([])
const selectedValue = ref('')
const sortedData = ref({})

const filterValue = computed(() => {
  if (selectedValue.value === '') {
    return sortedData.value[Object.keys(sortedData.value)[0]] || []
  }
  for (let key in sortedData.value) {
    if (selectedValue.value === key) {
      return sortedData.value[key]
    }
  }
})

const getData = async () => {
  try {
    await dataStore.fetchData()
    let sortedData1=await dataStore.sensorValue()
    sortedData1 = sortedData1.sortedData

    Object.keys(sortedData1).forEach(item => {
      selection.value.push({ value: item, label: item })
      sortedData1[item].forEach(elem => {
        if (elem['更新时间']) {
          elem['更新时间'] = new Date(elem['更新时间']).toLocaleString('zh-CN')
        }
      })
    })
    sortedData.value = sortedData1
  } catch (err) {
    console.log('err:', err)
  }
}

onMounted(getData)
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f8fbff; 
  border-radius: 12px;
  font-family: "Microsoft YaHei", sans-serif;
  color: #2d2d2d;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f3b63; 
}

.select-box {
  width: 260px;
  margin-bottom: 20px;
  font-size: 15px;
}

.errhistory-wrapper {
  padding-top:20px;
  width: 100%;
}

.errhistory-box {
  height: 280px;
  border: 1px solid #dbe6f1;
  border-radius: 10px;
  background-color: #f9fcff;
  overflow: hidden;
}

.panel {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  padding: 14px 24px;
  box-sizing: border-box;
  font-size: 15px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e6eef7;
  transition: background-color 0.2s ease;
}

li:last-child {
  border-bottom: none;
}

li:hover {
  background-color: #eef6ff;
}

.key {
  font-weight: 500;
  color: #3a4b61;
}

.value {
  color: #4a5b75;
}

</style>
