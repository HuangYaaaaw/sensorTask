<template>
  <div>
    <h3>折线图与柱状图</h3>
    <div class="chart-container" ref="linechart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {sensorStore} from '../stores/sensorStore'

const linechart = ref(null)
let mychart = null
const option = ref(null)
const dataStore=sensorStore()

const initChart = async () => {
  await nextTick()
  mychart = window.echarts.init(linechart.value)
  await setOption()
  mychart.setOption(option.value)
  window.addEventListener('resize', resizeChart)
}

const setOption = async () => {
  try {
    await dataStore.fetchData()
    const resData=dataStore.sensorValue()
    const json = resData.proccessData || []

    if (json.length === 0) return

    const elemKeys = Object.keys(json[0])
    const exclude = ['id', '设备编号', '数据类型', '创立时间']
    const fields = elemKeys.filter(k => !exclude.includes(k))

    const times = json.map(item => new Date(item['创立时间']).toLocaleString('zh-CN'))

    const series = fields.map(field => ({
      name: field,
      type: 'line',
      data: json.map(item => parseFloat(item[field])),
    }))

    option.value = {
      tooltip: { trigger: 'axis' ,
        formatter:(params)=>{
          return `
          ${params[0].name}<br/>
          ${params.map(item=>`${item.marker} ${item.seriesName}:${item.value}`).join('<br/>')}`
        }
      },
      toolbox:{feature:{
        magicType:{
            type:['line','bar']
        },
        restore:{},
        dataView:{},
        dataZoom:{},
        saveAsImage:{},

      }},
      legend: { data: fields },
      xAxis: { type: 'category', data: times ,axisLabel: {
      rotate: 20, 
      interval: 0, 
      fontsize:'10px',
    }},
      yAxis: { type: 'value' ,boundaryGap:false},
      series,
    }
  } catch (err) {
    console.error('折线图加载失败:', err)
  }
}

const resizeChart = () => {
  mychart && mychart.resize()
}

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  mychart && mychart.dispose()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 420px;
}
</style>