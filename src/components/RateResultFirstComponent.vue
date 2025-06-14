<template>
  <q-toolbar class="bg-primary text-white text-center">
    <q-toolbar-title>포켓몬 성적표</q-toolbar-title>
  </q-toolbar>
  <div class="row justify-center q-gutter-md">
    <div class="col-12 row flex-center">
      <div>
        <q-img
          alt="Pokemon image"
          :src="selectPkmImage"
          fit="scale-down"
          style="width: 100px;"
          >
        </q-img>
      </div>
      <div class="text-h6 text-bold">{{ myInputStore.pkmName }}</div>
    </div>
    <q-card class="col-xs-12 col-sm-10">
      <q-card-section>
        <span class="text-subtitle1 text-bold q-pr-xs">분야별 백분위</span>
        <q-icon :class="cssRibbon" size="md" name="img:images/ribbon.png">
            <q-tooltip :hide-delay="tooltipMobile()">
                굿나잇리본 {{ ribbonLev }}레벨
            </q-tooltip>
        </q-icon>                        
      </q-card-section>        
        <apexchart type="radar" 
        height="300"
        :options="chartOptions" 
        :series="series"></apexchart>
    </q-card>        
    <q-card class="col-xs-12 col-sm-10 col-md-5">
      <q-card-section class="row justify-between items-center">
        <span class="text-subtitle1 text-bold">나무열매 수 비교</span>
        <q-btn color="primary" icon="error" round flat dense @click="dialogBest('berry')"></q-btn>
      </q-card-section>
      <apexchart type="bar" :options="genOptions('berry')" :series="genSeries('berry')"></apexchart>
    </q-card>
    <q-card class="col-xs-12 col-sm-10 col-md-5">
      <q-card-section class="row justify-between items-center">
        <span class="text-subtitle1 text-bold">식재료 도움 횟수 비교</span>
        <q-btn color="primary" icon="error" round flat dense @click="dialogBest('ing')"></q-btn>
      </q-card-section>
      <apexchart type="bar" :options="genOptions('ing')" :series="genSeries('ing')"></apexchart>
    </q-card>
    <q-card class="col-xs-12 col-sm-10 col-md-5">
      <q-card-section class="row justify-between items-center">
        <span class="text-subtitle1 text-bold">스킬 발동 횟수 비교</span>
        <q-btn color="primary" icon="error" round flat dense @click="dialogBest('skill')"></q-btn>
      </q-card-section>
      <apexchart type="bar" :options="genOptions('skill')" :series="genSeries('skill')"></apexchart>
    </q-card>
    <!-- ALL 특기인 포켓몬 안내 문구 -->
    <q-card v-if="myRateCalcStore.whatSpeciality == 'all'" class="bg-ingCircle q-mb-md" style="border: 4px solid #b46856" flat>
      <q-card-section class="row">
        <q-icon color="primary" size="md" name="info" left />
        <div class="col column justify-center" style="word-break: keep-all;"><span>'올' 특기인 포켓몬은 <span class="text-bold">최종 개체값 평가</span>를 제공하지 않습니다.</span></div>
      </q-card-section>
    </q-card>    
    <!-- 1등 스펙 보기 -->
    <q-dialog v-model="showBest">
      <q-card>
        <q-bar>          
          <div>{{ choose[whichDialog] }} 1등 스펙</div>
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
            <span v-for="(sub, index) in oneBest[whichDialog]['sub']" v-bind:key="index">
              <q-chip :class="sub.bg" square>{{ sub.label }}</q-chip>
              <br v-if="index % 2 === 1" />
            </span>
          </div>
          <q-separator color="secondary" spaced></q-separator>
          <div class="column items-end">
            <div>{{ oneBest[whichDialog]['upNature'] }}</div>
            <div v-if="!oneBest[whichDialog]['upNature'].includes('영향 없음 --')" class="q-mt-sm">{{ oneBest[whichDialog]['downNature'] }}</div>
          </div>
        </q-card-section>   
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onBeforeMount, computed } from 'vue'
import { usePkmDBStore } from 'src/stores/pkmDBStore'
import { useDownloadStore } from 'src/stores/downloadStore'
import { useInputStore, useHealerInputStore } from 'src/stores/inputStore'
import { useRateCalcStore } from 'src/stores/rateCalcStore'
import { stopLoading } from 'src/utils/loading';
import { tooltipMobile } from 'src/utils/tooltip'

defineOptions({
  name: 'RateResultFirstComponent'
})

const myDownloadStore = useDownloadStore()
const myInputStore = useInputStore()
const myPkmDBStore = usePkmDBStore()
const myHealerInputStore = useHealerInputStore()
const myRateCalcStore = useRateCalcStore()

//dialog
const showBest = ref(false)
// 어떤 1등 볼것인지
const whichDialog = ref('')

// 선택한 포켓몬 도감번호
const selectedPkmDex = ref(myInputStore.selectedPkmDex)
const selectPkmImage = ref(myDownloadStore.fetchImage('pkm', selectedPkmDex.value))

onBeforeUnmount(()=>{
  myRateCalcStore.storeRate(pkmName.value, pkmLevel, orderData.value, minOrderData.value, hasHb, vsOutput.value, oneBest.value)
})

const prop = defineProps({
    startLoad: {
        type: Boolean
    }
})

// 선택한 포켓몬 이미지
const pkmName = ref(myInputStore.pkmName)
const pkmLevel = myInputStore.pkmLevel
const upNature = myInputStore.upNature
const downNature = myInputStore.downNature
const upMult = myPkmDBStore.upMult
const downMult = myPkmDBStore.downMult
const mySub = myInputStore.subSkills
const allData = myPkmDBStore.searchPkmData('kor_name', pkmName.value)
const maxHS = myPkmDBStore.maxHS
const firstIngName = myInputStore.firstIng
const secondIngName = myInputStore.secondIng
const thirdIngName = myInputStore.thirdIng
let mainSkillLevel = myInputStore.mainSkillLevel
const mealRecovery = myPkmDBStore.mealRecovery
// 굿나잇리본 선택
const ribbonSpeed = myInputStore.useRibbon ? myPkmDBStore.ribbonList[parseInt(myInputStore.ribbonLev, 10) - 1]["speed"][myInputStore.leftEvo] : 0
const ribbonInv = myInputStore.useRibbon ? myPkmDBStore.ribbonList[parseInt(myInputStore.ribbonLev, 10) - 1]["inventory"] : 0
const ribbonLev = ref(myInputStore.ribbonLev)

const maxE = myPkmDBStore.maxE
const mainSkillLevelH = myHealerInputStore.mainSkillLevel
const skillCount = myHealerInputStore.fixedHealSkillCount
const pkmNameH = myHealerInputStore.pkmName
const allDataH = myPkmDBStore.searchPkmData('kor_name', pkmNameH)
const enerPerHour = myPkmDBStore.enerPerHour
const speedEnerMultList = myPkmDBStore.speedEnerMultList

const upNatureList = myPkmDBStore.upNatureList
const downNatureList = myPkmDBStore.downNatureList
// 최대 축적 가능 스킬 횟수
const sleepLimit = allData.specialty == "skill" ? myPkmDBStore.collectSkillCount.skill : myPkmDBStore.collectSkillCount.else

// 분야별 1등
const oneBest = ref(myRateCalcStore.oneBest)
// ["berry", "inv", "ing", "skill", "team"]
const orderData = ref(myRateCalcStore.orderData)
const minOrderData = ref(myRateCalcStore.minOrderData)
// 나 vs 1등
const vsOutput = ref(myRateCalcStore.vsOutput)
// 피검사 포켓몬이 힐러면 추가 힐러는 자동으로 체크해제
const useHealer = (allData.specialty === "skill" && allData.skill === "Energy For Everyone") ? false : myRateCalcStore.useHealer
// 도우미보너스 존재 유무
let hasHb = false
for(let i=0; i < mySub.length; i++){
  if(mySub[i].label === '도우미 보너스'){
    hasHb = true
  }
}
if(myRateCalcStore.pkmName !== pkmName.value){
  // 무엇 특화인지
  myRateCalcStore.whatSpeciality = myPkmDBStore.searchPkmData('kor_name', myInputStore.pkmName).specialty
}
// 기력 회복 보너스 반영
const maxEnergy = myInputStore.hasErb ? myPkmDBStore.erbMaxEnergy : 100
// 굿나잇리본 사용 여부
const useRibbon = ref(myInputStore.useRibbon)
const cssRibbon = computed(() => {
    if(useRibbon.value){
        return ''
    }else{
        return 'hidden'
    }
})

onBeforeMount(async()=>{
  try{
      if(prop.startLoad){   
        const addValidSub = []
        if(allData.specialty === "skill"){          
          // 스킬몬은 스킬 레벨업 서브가 꽝
          myPkmDBStore.allSubSkillList.forEach((e)=>{
            if(e.label === "도우미 보너스" || e.label === "기력 회복 보너스"){
              addValidSub.push(e)
            }            
          }) 
        }
        else if(allData.main_skills.unit === 'energy'){
          // 비스킬몬은 스킬 레벨업이 유효
          myPkmDBStore.allSubSkillList.forEach((e)=>{
            if(e.label === "도우미 보너스" || e.label === "기력 회복 보너스" || e.label === "스킬 레벨 업 M" || e.label === "스킬 레벨 업 s"){
              addValidSub.push(e)
            }            
          }) 
        }
        const subSkillList = [
          ...addValidSub.slice(),
          ...myPkmDBStore.subSkillList.slice()
        ]
        mySub.forEach((e)=>{
          if(e.label.includes("스킬 레벨 업")){
            // 비스킬몬에게 스렙업 서브 가산점을 주기 위해서, 비교군은 스렙업 없는 만큼 스킬렙 감소한 상태로 시작
            mainSkillLevel -= e.mult
          }
        })      
                 
        // 기존에 검색한 포켓몬과 레벨이 다시 검색한 것과 동일하면 api 생략           
        const obj = {
          "upNature": upNature,
          "downNature": downNature,
          "upNatureList": upNatureList,
          "downNatureList": downNatureList,
          "mySub": mySub,
          "subSkillList": subSkillList, // <-이거 일반 리스트 + 도보 & 기력 회복
          "allSubSkillListLength": myPkmDBStore.allSubSkillList.length,
          "pkmLevel": pkmLevel,
          "upMult": upMult,
          "downMult": downMult,
          "allData": allData,
          "maxHS": maxHS,            
          "firstIngName": firstIngName,      
          "secondIngName": secondIngName,
          "thirdIngName": thirdIngName,
          "mainSkillLevel": mainSkillLevel,
          "mealRecovery": mealRecovery,
          "maxE": maxE,
          "mainSkillLevelH": mainSkillLevelH,
          "useHealer": useHealer,
          "skillCount": skillCount,                      
          "enerPerHour": enerPerHour,
          "speedEnerMultList": speedEnerMultList,
          "allDataH": allDataH,
          "teamSubSkillList": myPkmDBStore.teamSubSkillList,
          "speciality": myRateCalcStore.whatSpeciality,
          "ribbonSpeed": ribbonSpeed,
          "ribbonInv": ribbonInv,
          "sleepLimit": sleepLimit,
          "maxEnergy": maxEnergy
        }        
        const response = await fetch('https://fg1kg79is8.execute-api.ap-northeast-2.amazonaws.com/rate', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(obj)
        })
        const json = await response.json()
        orderData.value = json.orderData
        minOrderData.value = json.minOrderData
        vsOutput.value = json.vsOutput
        oneBest.value = json.oneBest               
                                                    
        stopLoading()       
      }
    }
    catch(e){
      console.log('rate api err', e)      
    }
})

function dialogBest(w){
  showBest.value = true
  whichDialog.value = w
}

// -------------- 차트 설정 --------------

const chartOptions = {
  chart: {   
    height: 300,           
    type: 'radar',
  },
  noData: {
    text: '평가하는 중...',
    style: {
      color: '#1D1D1D',
      fontSize: '20px'
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function(val) {
      return Math.round(val)
    }
  },
  plotOptions: {
    radar: {
      polygons: {
        strokeColors: '#e9e9e9',
        fill: {
          colors: ['#f8f8f8', '#fff']
        }
      }
    }
  },
  colors: ['#FF4560'],
  markers: {
    size: 4,
    colors: ['#fff'],
    strokeColor: '#FF4560',
    strokeWidth: 2,
  },
  tooltip: {
    y: {
      formatter: function(val) {
        return Math.round(val)
      }
    }
  },
  xaxis: {
    categories: ['나무열매 수', '최대 소지수', '식재료 횟수', '스킬 횟수', '팀 보너스'],
    labels: {
      style: {
        fontWeight: 1000
      }
    }
  },
  yaxis: {
    stepSize: 20,
    min: 0,
    max: 100
  }
}

const series = computed(()=>{
  if(orderData.value.length > 0){
    return [{
        name: '백분위',
        data: orderData.value 
        // 나무열매, 소지수, 식재료, 스킬, 팀 보너스 순
    }]
  }
  else{
    return []
  }
})
// 생산량 결과 비교용
function genOptions(a){
  const choose = {
    'berry': ['일일 나무열매 생산량 (개)', ' 개'],
    'ing': ['일일 식재료 도움 횟수 (회)', ' 회'],
    'skill': ['일일 스킬 발동 횟수 (회)', ' 회']
  }
  const options = {
    chart: {
      type: 'bar'
    },
    noData: {
      text: '평가하는 중...',
      style: {
        color: '#1D1D1D'
      }
    },
    tooltip: {
      y: {
        formatter: function(val){
          return val.toFixed(2) + choose[a][1]
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true        
      }
    },
    noData: {
      text: '계산 중...'
    },
    dataLabels: {
      formatter: function(val) {
        return val.toFixed(2) + choose[a][1]
      },
      style: {
        colors: ['#1D1D1D']
      }
    },
    xaxis: {
      title: {
        text: choose[a][0]
      }
    }
  }
  return options
}
const choose = {
  'berry': '나무열매 수',
  'ing': '식재료 횟수',
  'skill': '스킬 횟수'
}
function genSeries(a){
  const series = [
    {
      name: choose[a],
      data: [
        {
          x: '나',
          y: vsOutput.value[a][0],
          fillColor: '#24d96e',
          strokeColor: '#C23829'        
        },
        {
          x: '1등',
          y: vsOutput.value[a][1],
          fillColor: '#fee672',
          strokeColor: '#C23829'
        }
      ]
    }
  ]
  return series
}
</script>

