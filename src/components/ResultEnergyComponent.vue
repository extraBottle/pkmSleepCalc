<template>
    <q-toolbar class="bg-primary text-white text-center">
        <q-toolbar-title>기력 변화 그래프</q-toolbar-title>
    </q-toolbar>
    <div class="column items-center q-gutter-y-md relative-position">
        <apexchart
        ref="energyChartRef"
        class="apexchart_width"
        type="area"
        :options="chartOptions"
        :series="series"></apexchart>
        <q-card v-if="myProdCalcStore.finalSkillProcH > 0">
            <q-card-section class="bg-sSkill">
              <div class="row">
                <q-avatar size="md" class="shadow-1" color="secondary" text-color="white" icon="priority_high" />
                <div class="q-mx-sm"></div>
                <span class="text-caption q-py-sm">위 그래프는 {{ myProdCalcStore.simulationCount }}회 모의시행의 기댓값입니다.<br>매 시행마다 결과가 달라질 수 있습니다.</span>
              </div>            
              <q-btn class="full-width" rounded label="기력 다시 계산하기" icon="restart_alt" color="positive" @click="restartCalc"></q-btn>                            
            </q-card-section>
        </q-card>
    </div>
    <!-- style="width: 50vw; height: 30vh;" -->
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useProdCalcStore } from 'src/stores/finalCalcStore'

defineOptions({
    name: "EnerResult"
})
const prop = defineProps({
    startLoad: {
        type: Boolean
    }
})

const myProdCalcStore = useProdCalcStore()
const energyChartRef = ref()

function restartCalc(){
  energyChartRef.value.updateSeries([])
  // loading start
  myProdCalcStore.calcLoading = true
}
watchEffect(async()=>{
  if(prop.startLoad){
    const pkmDB = await import('src/stores/pkmDBStore')
    const inp = await import('src/stores/inputStore')

    const myPkmDBStore = pkmDB.usePkmDBStore()
    const myInputStore = inp.useInputStore()
    const myHealerInputStore = inp.useHealerInputStore()
    const mySleepTimeInputStore = inp.useSleepTimeInputStore()

    const pkmName = ref(myInputStore.pkmName)
    const pkmLevel = myInputStore.pkmLevel
    const upNature = myInputStore.upNature
    const downNature = myInputStore.downNature
    const upMult = myPkmDBStore.upMult[upNature]
    const downMult = myPkmDBStore.downMult[downNature]
    const mySub = myInputStore.subSkills
    const allData = myPkmDBStore.searchPkmData('name', myPkmDBStore.convertKorEn(pkmName.value))
    const evoCount = myInputStore.evoCount
    const firstIngName = myInputStore.firstIng
    const secondIngName = myInputStore.secondIng
    const thirdIngName = myInputStore.thirdIng
    const mainSkillLevel = myInputStore.mainSkillLevel
    const mealRecovery = myPkmDBStore.mealRecovery

    const maxE = myPkmDBStore.maxE
    const totalMainSkill = myPkmDBStore.totalMainSkill
    const mainSkillLevelH = myHealerInputStore.mainSkillLevel
    const sleepTime = mySleepTimeInputStore.sleepTime
    const calcVer = myHealerInputStore.calcVer
    const skillCount = myHealerInputStore.healSkillCount
    const timeForFull = myPkmDBStore.timeForFull
    const upNatureH = myHealerInputStore.upNature
    const downNatureH = myHealerInputStore.downNature
    const pkmNameH = myHealerInputStore.pkmName
    const pkmLevelH = myHealerInputStore.pkmLevel
    const mySubH = myHealerInputStore.subSkills
    const allDataH = myPkmDBStore.searchPkmData('name', myPkmDBStore.convertKorEn(pkmNameH))
    const erbCount = myInputStore.erbCount
    const erbMult = myPkmDBStore.erbMult
    const enerPerHour = myPkmDBStore.enerPerHour
    const speedEnerMultList = myPkmDBStore.speedEnerMultList
    const evoCountH = myHealerInputStore.evoCount

    // 힐러 포켓몬의 두번째 식재료
    const secondIngH = myHealerInputStore.secondIng
    // 힐러 포켓몬의 세번째 식재료
    const thirdIngH = myHealerInputStore.thirdIng
    // 좋캠 티켓 사용 여부
    const useGoodCamp = ref(myInputStore.useGoodCamp)


    myProdCalcStore.calcEnergyCurve(totalMainSkill, pkmLevel, evoCount, mySub, secondIngName, thirdIngName, mainSkillLevel, allData, mealRecovery, useGoodCamp.value, maxE, mainSkillLevelH, sleepTime, calcVer, skillCount, timeForFull, upNature, downNature, upMult, downMult, erbCount, erbMult, enerPerHour, speedEnerMultList,
      allDataH, evoCountH, mySubH, pkmLevelH, secondIngH, thirdIngH, upNatureH, downNatureH)
    // 기력 적용 도우미 속도
    myProdCalcStore.calcSpeedWithEner(speedEnerMultList, calcVer, enerPerHour)            
    // 식재료 종류별 생산량
    myProdCalcStore.calcLeveLIng(totalMainSkill, false, allData, pkmLevel, firstIngName, secondIngName, thirdIngName, sleepTime, enerPerHour, speedEnerMultList, evoCount, mySub, useGoodCamp.value, mainSkillLevel)    
    energyChartRef.value.updateSeries([{
      name: '남은 기력량',
      data: myProdCalcStore.energyAxis
    }])
  }
})

const chartOptions = {
  chart : {
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false,
  },
  noData: {
    text: '기력 계산 중...'
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