import { defineStore } from "pinia";
import {ref} from 'vue'

export const sensorStore=defineStore('sensorStore',()=>{
    const sensorData=ref({})
    const sensorValue=()=>sensorData.value
    const fetchData=async ()=>{
        const respond=await fetch('/data')
        const json=await respond.json()
        sensorData.value=json
    }
    return {sensorData,fetchData,sensorValue}
})