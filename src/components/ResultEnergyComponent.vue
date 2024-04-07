<template>
    <q-toolbar class="bg-primary text-white text-center">
        <q-toolbar-title>기력 변화 그래프</q-toolbar-title>
    </q-toolbar>
    <div class="column items-center q-gutter-y-md relative-position">
        <apexchart
        style="width: 80%;"
        type="area"
        :options="chartOptions"
        :series="series"></apexchart>
        <q-card v-if="myProdCalcStore.finalSkillProcH > 0">
            <q-card-section class="row bg-sSkill">
              <q-avatar size="md" class="shadow-1" color="secondary" text-color="white" icon="priority_high" />
              <div class="q-mx-sm"></div>
              <span class="text-caption q-py-sm">위 그래프는 {{ myProdCalcStore.simulationCount }}번 모의실험의 기댓값입니다.<br>매 시행마다 결과가 달라질 수 있습니다.</span>
            </q-card-section>
        </q-card>
    </div>
    <!-- style="width: 50vw; height: 30vh;" -->
</template>

<script setup>
import { useProdCalcStore } from 'src/stores/finalCalcStore'

defineOptions({
    name: "EnerResult"
})

const myProdCalcStore = useProdCalcStore()

const chartOptions = {
  chart : {
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight'
  },
  xaxis: {
    title: {
      text: '시간 경과 (h)'
    },
    type: "numeric",
    labels: {
      formatter: function (value) {
        return (value / 2).toFixed(1);
      }
    }
  },
  yaxis: {
    title: {
      text: '남은 기력량 (%)'
    },
    labels: {
      formatter: function (value) {
        return Math.floor(value);
      }
    },
    min: 0,
    max: 150
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#FDD835'],
      opacityFrom: 1,
      opacityTo: 0.01,
      stops: [0, 100, 100, 100]
    },
  }
}
const series = [
    {
        name: '남은 기력량',
        data: myProdCalcStore.energyAxis
    }
]
</script>