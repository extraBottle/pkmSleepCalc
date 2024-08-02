<template>
  <q-toolbar class="bg-primary text-white text-center">
    <q-toolbar-title>최종 개체값 평가</q-toolbar-title>
  </q-toolbar>
  <div class="column items-center q-px-md">
    <div class= "relative-position full-width row justify-center">
      <q-img
        alt="Pokemon image"
        :src="selectPkmImage"
        fit="scale-down"
        style="width: 300px;"
        @load="loadFunc"
        >
      </q-img>
      <q-intersection class="absolute-top-right" transition="flip-right" :disable="loadedImg">
        <q-img
          alt="Medal image"          
          :src="gradeMedal"
          fit="scale-down"
          style="width: 100px;"
          no-spinner
          >
        </q-img>
      </q-intersection>
    </div>
    <q-card class="q-mb-md column items-center" style="background-color: #f7e0ab; border: solid #C10015; width: 80%;">
      <q-card-section class="full-width">
        <div class="text-subtitle1 text-bold">등급 판정</div>
      </q-card-section>      
      <div class="text-h5 q-pb-md euljiro-font">"{{ whatGradeName }} 급"</div>      
    </q-card>
    <div class="row flex-center q-gutter-md">
      <q-card>
        <q-card-section>
          <span class="text-subtitle1 text-bold q-pr-xs">통합 점수</span>
          <q-icon :class="cssRibbon" size="md" name="img:images/ribbon.png">
              <q-tooltip :hide-delay="tooltipMobile()">
                  굿나잇리본 {{ ribbonLev }}레벨
              </q-tooltip>
          </q-icon>                 
        </q-card-section>
        <apexchart type="radialBar" :options="chartOptions" :series="series"></apexchart>
      </q-card>
      <q-card>
        <q-card-section class="row justify-between items-center">
          <span class="text-subtitle1 text-bold">쓸만한가요?</span>
          <q-btn color="primary" icon="error" round flat dense @click="showCut = true"></q-btn>
        </q-card-section>
        <q-card-section >
          <q-icon v-if="finalGrade >= cutGrade" color="secondary" name="check_circle" size="lg" class="q-pr-md"></q-icon>
          <q-icon v-else color="negative" name="cancel" size="lg" class="q-pr-md"></q-icon>
          <span class="text-subtitle2 ">합격 커트라인: {{ cutGrade }} 점</span>
        </q-card-section>
      </q-card>
      <!-- 커트라인 스펙 보기 -->
      <q-dialog v-model="showCut">
        <q-card>
          <q-bar>          
            <div>합격 커트라인 스펙</div>
            <q-space />          
            <q-btn dense flat icon="close" v-close-popup />                 
          </q-bar>
          <q-card-section>
            <div class="full-width row flex-center">
              <q-img
                alt="Pokemon image"
                :src="selectPkmImage"
                fit="scale-down"
                style="width: 100px;"
                >
              </q-img>
              <div class="text-h6 text-bold">{{ myInputStore.pkmName }}</div>          
            </div>
            <div class="no-wrap">            
              <q-chip :class="cutSub.sub[0].bg" square>{{ cutSub.sub[0].label }}</q-chip>              
            </div>
            <q-separator color="secondary" spaced></q-separator>
            <div class="column items-end">
              <div>{{ cutSub['upNature'] }}</div>
              <div v-if="!cutSub['upNature'].includes('영향 없음 --')" class="q-mt-sm">{{ cutSub['downNature'] }}</div>
            </div>
          </q-card-section>   
        </q-card>
      </q-dialog>
    </div>    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDownloadStore } from 'src/stores/downloadStore'
import { useInputStore } from 'src/stores/inputStore'
import { useRateCalcStore } from 'src/stores/rateCalcStore';
import { tooltipMobile } from 'src/utils/tooltip'

defineOptions({
  name: 'RateResultFirstComponent'
})

const myDownloadStore = useDownloadStore()
const myInputStore = useInputStore()
const myRateCalcStore = useRateCalcStore()

// 선택한 포켓몬 도감번호
const selectedPkmDex = ref(myInputStore.selectedPkmDex)
const selectPkmImage = ref(myDownloadStore.fetchImage('pkm', selectedPkmDex.value))
// 포켓몬 이미지 로딩 후 메달 부여
const loadedImg = ref(true)
// 통합 점수
const finalGrade = ref(myRateCalcStore.calcFinalGrade(myRateCalcStore.orderData, myRateCalcStore.hasHb))
// 커트라인 점수
const cutGrade = ref(myRateCalcStore.calcFinalGrade(myRateCalcStore.minOrderData, false))
// 등급 판정 (이름 반환)
const whatGradeName = ref(myRateCalcStore.gradeCut(finalGrade.value))
// 등급 메달 이미지
const gradeMedal = ref(`images/${whatGradeName.value}.png`)
// 커트라인 창
const showCut = ref(false)
// 커트라인 스펙
const cutSub = ref(myRateCalcStore.minPoke())
// 굿나잇리본 사용 여부
const useRibbon = ref(myInputStore.useRibbon)
const cssRibbon = computed(() => {
    if(useRibbon.value){
        return ''
    }else{
        return 'hidden'
    }
})
const ribbonLev = ref(myInputStore.ribbonLev)

function loadFunc(){
  loadedImg.value = false
}
const chartOptions = {
  chart: {
    type: 'radialBar',
    offsetY: -20,
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "#e7e7e7",
        strokeWidth: '97%'
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          formatter: function(val) {
            return parseInt(val) + ' 점';
          },
          offsetY: -2,
          fontSize: '22px'
        }  
      }
    }
  },
  grid: {
    padding: {
      top: -10
    }
  },
  
  colors: ['#24d96e']
}      

const series = [
  finalGrade.value
]

</script>

