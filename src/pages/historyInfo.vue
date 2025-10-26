<template>
    <div>
        <div class="card-chart-wrapper">
            <div class="card-container-wrapper">
                <CardContainer />
            </div>
            <div class="chart-wrapper">
                <LineBar />
            </div>
        </div>
        <div class="errhistory-wrapper">
            <ErrHistory />
        </div>
    </div>
</template>

<script setup>
import CardContainer from '../components/CardContainer.vue'
import LineBar from '../components/LineBar.vue'
import ErrHistory from '../components/ErrHistory.vue'
</script>

<style>
.card-chart-wrapper {
    display: flex;
    gap: 20px;
    align-items: stretch;
}

.card-container-wrapper {
    width: 300px;
}

.chart-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.errhistory-wrapper {
    width: 100%;
}
</style>