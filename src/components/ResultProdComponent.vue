<template>
    <q-toolbar class="bg-primary text-white text-center">
        <q-toolbar-title>생산량 보고서</q-toolbar-title>
    </q-toolbar>
    <div class="column items-center q-gutter-y-md relative-position">
        <q-img
            alt="Pokemon image"
            :src="selectPkmImage"
            fit="scale-down"
            style="max-width: 300px;"
            no-spinner/>
        <q-card bordered class="full-width bg-googleBack">
            <q-card-section>                
                <div class="full-width row justify-between">
                    <q-icon :class="cssGoodCamp" size="xl" name="img:images/goodcampticket.png">
                        <q-tooltip :hide-delay="tooltipMobile()">
                            좋은 캠프 적용 중!
                        </q-tooltip>
                    </q-icon>
                    <q-select outlined dense v-model="chooseRange" :options="options" />
                </div>
                <div class="text-h5 text-center text-weight-bold clean-wrap">
                    {{ dishOrDaily }}
                    <span class="text-subtitle2">(기댓값)</span>
                </div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="column q-gutter-y-md">
                <div class="col">
                    <q-card>
                        <q-card-section class="row bg-sSkill">
                            <q-avatar class="shadow-1" color="ingCircle" :icon="firstIng" />
                            <q-separator vertical class="q-mx-md"/>
                            <div class="text-h5 q-py-sm">{{ amountFirstIng }} 개</div>
                        </q-card-section>
                    </q-card>
                </div>
                <div v-if="myProdCalcStore.checkSecondDisplay" class="col">
                    <q-card>
                        <q-card-section class="row bg-sSkill">
                            <q-avatar class="shadow-1" color="ingCircle" :icon="secondIng" />
                            <q-separator vertical class="q-mx-md"/>
                            <span class="text-h5 q-py-sm">{{ amountSecondIng}} 개</span>
                        </q-card-section>
                    </q-card>
                </div>
                <div v-if="myProdCalcStore.checkThirdDisplay" class="col">
                    <q-card>
                        <q-card-section class="row bg-sSkill">
                            <q-avatar class="shadow-1" color="ingCircle" :icon="thirdIng" />
                            <q-separator vertical class="q-mx-md"/>
                            <span class="text-h5 q-py-sm">{{ amountThirdIng }} 개</span>
                        </q-card-section>
                    </q-card>
                </div>
                <div v-if="myProdCalcStore.checkIngSkillDisplay" class="col">
                    <q-card>
                        <q-card-section class="row bg-sSkill no-wrap">
                            <q-avatar class="shadow-1" color="ingCircle" icon="img:images/ingall.png" />
                            <q-separator vertical class="q-mx-md"/>
                            <div class="row q-py-sm">
                                <div class="text-h5 no-wrap">{{ amountIngSkill }} 개&nbsp;</div>
                                <div class="text-subtitle1 no-wrap">(나머지 모든 식재료)</div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePkmDBStore } from 'src/stores/pkmDBStore'
import { useDownloadStore } from 'src/stores/downloadStore'
import { useInputStore, useSleepTimeInputStore, useHealerInputStore } from 'src/stores/inputStore'
import { useProdCalcStore } from 'src/stores/finalCalcStore'
import { tooltipMobile } from 'src/utils/tooltip'

defineOptions({
    name: "IngResult"
})
const prop = defineProps({
    isLoading: {
        type: Boolean
    }
})

const myPkmDBStore = usePkmDBStore()
const myDownloadStore = useDownloadStore()
const myInputStore = useInputStore()
const mySleepTimeInputStore = useSleepTimeInputStore()
const myHealerInputStore = useHealerInputStore()
const myProdCalcStore = useProdCalcStore()

// 선택한 포켓몬 이미지
const selectPkmImage = ref(myDownloadStore.fetchImage('pkm', myInputStore.selectedPkmDex))
const pkmName = ref(myInputStore.pkmName)
const pkmLevel = myInputStore.pkmLevel
const upNature = myInputStore.upNature
const downNature = myInputStore.downNature
const upMult = myPkmDBStore.upMult[upNature]
const downMult = myPkmDBStore.downMult[downNature]
const hBonus = myInputStore.hbCount
const hbMult = myPkmDBStore.hbMult
const mySub = myInputStore.subSkills
const allData = myPkmDBStore.searchPkmData('name', myPkmDBStore.convertKorEn(pkmName.value))
const maxHS = myPkmDBStore.maxHS
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

const options = ["한끼", "1일"]
const chooseRange = ref(options[0])
// 선택한 포켓몬의 첫번째 식재료
const firstIng = ref(myDownloadStore.fetchIcon('ing', firstIngName.replace(/\s/g, "").toLowerCase()))
// 선택한 포켓몬의 두번째 식재료
const secondIng = ref(myDownloadStore.fetchIcon('ing', secondIngName.replace(/\s/g, "").toLowerCase()))
// 선택한 포켓몬의 세번째 식재료
const thirdIng = ref(myDownloadStore.fetchIcon('ing', thirdIngName.replace(/\s/g, "").toLowerCase()))

// 힐러 포켓몬의 첫번째 식재료
// const firstIngH = ref(myDownloadStore.fetchIcon('ing', firstIngName.replace(/\s/g, "").toLowerCase()))
// 힐러 포켓몬의 두번째 식재료
const secondIngH = myHealerInputStore.secondIng
// 힐러 포켓몬의 세번째 식재료
const thirdIngH = myHealerInputStore.thirdIng
// 좋캠 티켓 사용 여부
const useGoodCamp = ref(myInputStore.useGoodCamp)
const cssGoodCamp = computed(() => {
    if(useGoodCamp.value){
        return ''
    }else{
        return 'invisible'
    }
})
// 로딩 화면 관리
const calcLoading = ref(true)

const dishOrDaily = computed(()=>{
    return pkmName.value + '의 ' + (chooseRange.value === "한끼" ? '한끼당' : '하루') + ' 생산량'
})

onMounted(()=>{
    if(myInputStore.hasEssential() && myProdCalcStore.onlyBaseSpeed === 0){
        setTimeout(function(){
            // 기력 제외 도우미 속도
            myProdCalcStore.onlyBaseSpeed = myProdCalcStore.calcBaseSpeed(pkmLevel, upNature, downNature, upMult, downMult, hBonus, hbMult, mySub, allData, maxHS, useGoodCamp.value)
            myProdCalcStore.finalSkillProc = myProdCalcStore.calcSkillProc(allData, upNature, downNature, upMult, downMult, mySub)
            // 식재료 확률
            myProdCalcStore.finalIngProc = myProdCalcStore.calcIngProc(allData, upNature, downNature, upMult, downMult, mySub)
            // 기력 그래프
            if(calcVer === 'proVer'){
                myProdCalcStore.onlyBaseSpeedH = myProdCalcStore.calcBaseSpeed(pkmLevelH, upNatureH, downNatureH, upMult, downMult, hBonus, hbMult, mySubH, allDataH, maxHS, useGoodCamp.value)
                myProdCalcStore.finalSkillProcH = myProdCalcStore.calcSkillProc(allDataH, upNatureH, downNatureH, upMult, downMult, mySubH)
                // 힐러 식재료 확률
                myProdCalcStore.finalIngProcH = myProdCalcStore.calcIngProc(allDataH, upNatureH, downNatureH, upMult, downMult, mySubH)
                myProdCalcStore.calcEnergyCurve(totalMainSkill, pkmLevel, evoCount, mySub, secondIngName, thirdIngName, mainSkillLevel, allData, mealRecovery, useGoodCamp.value, maxE, mainSkillLevelH, sleepTime, calcVer, skillCount, timeForFull, upNature, downNature, upMult, downMult, erbCount, erbMult, enerPerHour, speedEnerMultList,
                allDataH, evoCountH, mySubH, pkmLevelH, secondIngH, thirdIngH, upNatureH, downNatureH)               
            }
            else{
                myProdCalcStore.calcEnergyCurve(totalMainSkill, pkmLevel, evoCount, mySub, secondIngName, thirdIngName, mainSkillLevel, allData, mealRecovery, useGoodCamp.value, maxE, mainSkillLevelH, sleepTime, calcVer, skillCount, timeForFull, upNature, downNature, upMult, downMult, erbCount, erbMult, enerPerHour, speedEnerMultList, allDataH)            
            }
            // 기력 적용 도우미 속도
            myProdCalcStore.calcSpeedWithEner(speedEnerMultList, calcVer, enerPerHour)            
            // 식재료 종류별 생산량
            myProdCalcStore.calcLeveLIng(totalMainSkill, false, allData, pkmLevel, firstIngName, secondIngName, thirdIngName, sleepTime, enerPerHour, speedEnerMultList, evoCount, mySub, useGoodCamp.value, mainSkillLevel)    
        }, 30)
    }
})

const amountFirstIng = computed(()=>{
    return chooseRange.value === "한끼" ? Math.round(myProdCalcStore.totalIngCalc[firstIngName] / 3) : Math.round(myProdCalcStore.totalIngCalc[firstIngName])
})
const amountSecondIng = computed(()=>{
    return chooseRange.value === "한끼" ? Math.round(myProdCalcStore.totalIngCalc[secondIngName] / 3) : Math.round(myProdCalcStore.totalIngCalc[secondIngName])
})
const amountThirdIng = computed(()=>{
    return chooseRange.value === "한끼" ? Math.round(myProdCalcStore.totalIngCalc[thirdIngName] / 3) : Math.round(myProdCalcStore.totalIngCalc[thirdIngName])
})
const amountIngSkill = computed(()=>{
    return chooseRange.value === "한끼" ? (myProdCalcStore.totalIngCalc['all'] / 3).toFixed(2) : (myProdCalcStore.totalIngCalc['all']).toFixed(2)
})

defineExpose({
    calcLoading
})

</script>