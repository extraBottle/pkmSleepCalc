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
                    <div>
                        <q-icon :class="cssGoodCamp" size="xl" name="img:images/goodcampticket.png">
                            <q-tooltip :hide-delay="tooltipMobile()">
                                좋은 캠프 적용 중!
                            </q-tooltip>
                        </q-icon>
                        <q-icon :class="cssRibbon" size="xl" name="img:images/ribbon.png">
                            <q-tooltip :hide-delay="tooltipMobile()">
                                굿나잇리본 적용 중!
                            </q-tooltip>
                        </q-icon>
                    </div>
                    <q-select outlined dense v-model="chooseRange" :options="options" />
                </div>
                <div class="text-h5 text-center text-weight-bold clean-wrap">
                    {{ dishOrDaily }}
                    <span class="text-subtitle2">(기댓값)</span>
                    <q-btn color="grey-5" icon="help" round flat dense @click="showTime = true"></q-btn>
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
    <q-dialog v-model="showTime">
        <q-card>
          <q-bar>          
            <div>도움말</div>
            <q-space />          
            <q-btn dense flat icon="close" v-close-popup />                 
          </q-bar>
          <q-card-section>
            <span class="text-bold">
                "수면 + 활동시간"</span>(총 24h)을 전부 반영하여 계산한 결과입니다            
          </q-card-section>   
        </q-card>
      </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { usePkmDBStore } from 'src/stores/pkmDBStore'
import { useDownloadStore } from 'src/stores/downloadStore'
import { useInputStore, useSleepTimeInputStore, useHealerInputStore } from 'src/stores/inputStore'
import { useProdCalcStore } from 'src/stores/finalCalcStore'
import { tooltipMobile } from 'src/utils/tooltip'

defineOptions({
    name: "IngResult"
})
const prop = defineProps({
    startLoad: {
        type: Boolean
    }
})

const myPkmDBStore = usePkmDBStore()
const myDownloadStore = useDownloadStore()
const myInputStore = useInputStore()
const mySleepTimeInputStore = useSleepTimeInputStore()
const myHealerInputStore = useHealerInputStore()
const myProdCalcStore = useProdCalcStore()

const showTime = ref(false)
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
const hasErb = myInputStore.hasErb

const erbMaxEnergy = myPkmDBStore.erbMaxEnergy
// 굿나잇리본 효과
const ribbonSpeed = myInputStore.useRibbon ? myPkmDBStore.ribbonList[parseInt(myInputStore.ribbonLev, 10) - 1]["speed"][myInputStore.leftEvo] : 0
const ribbonInv = myInputStore.useRibbon ? myPkmDBStore.ribbonList[parseInt(myInputStore.ribbonLev, 10) - 1]["inventory"] : 0

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
const hasErbH = myHealerInputStore.hasErb
// 굿나잇리본 효과 (힐러)
const ribbonSpeedH = myHealerInputStore.useRibbon ? myPkmDBStore.ribbonList[parseInt(myHealerInputStore.ribbonLev, 10) - 1]["speed"][myHealerInputStore.leftEvo] : 0
const ribbonInvH = myHealerInputStore.useRibbon ? myPkmDBStore.ribbonList[parseInt(myHealerInputStore.ribbonLev, 10) - 1]["inventory"] : 0
// 최대 축적 스킬 횟수
const sleepLimit = allData.specialty == "skill" ? myPkmDBStore.collectSkillCount.skill : myPkmDBStore.collectSkillCount.else

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
        return 'hidden'
    }
})
// 굿나잇리본 사용 여부
const useRibbon = ref(myInputStore.useRibbon)
const cssRibbon = computed(() => {
    if(useRibbon.value){
        return ''
    }else{
        return 'invisible'
    }
})
const dishOrDaily = computed(()=>{
    return pkmName.value + '의 ' + (chooseRange.value === "한끼" ? '한끼당' : '하루') + ' 생산량'
})

onMounted(()=>{
    if(myInputStore.hasEssential() && myProdCalcStore.onlyBaseSpeed === 0){
        // loading start
        myProdCalcStore.calcLoading = true
    }
})
watchEffect(async()=>{
    try{
        if(prop.startLoad){
            let ingSkillData = {}
            let selfHealSkillData = {}
            let randHealSkillData = {}
            let allHealSkillData = {}
            if(allData.skill.name.includes('Metronome')){
                // 손가락흔들기 포켓몬 선택했으면 자힐 & 랜덤힐 & 식재 스킬 정보도 저장한다        
                await myPkmDBStore.fetchPkmData('LEAFEON')
                await myPkmDBStore.fetchPkmData('UMBREON')
                await myPkmDBStore.fetchPkmData('VAPOREON')
                await myPkmDBStore.fetchPkmData('SYLVEON')
                ingSkillData = myPkmDBStore.searchPkmData('name', 'VAPOREON').skill
                selfHealSkillData = myPkmDBStore.searchPkmData('name', 'UMBREON').skill
                randHealSkillData = myPkmDBStore.searchPkmData('name', 'LEAFEON').skill
                allHealSkillData = myPkmDBStore.searchPkmData('name', 'SYLVEON').skill
            }            
            // 기력 제외 도우미 속도
            myProdCalcStore.onlyBaseSpeed = myProdCalcStore.calcBaseSpeed(ribbonSpeed, pkmLevel, upNature, downNature, upMult, downMult, hBonus, hbMult, mySub, allData, maxHS, useGoodCamp.value)
            myProdCalcStore.finalSkillProc = myProdCalcStore.calcSkillProc(allData, upNature, downNature, upMult, downMult, mySub)
            // 식재료 확률
            myProdCalcStore.finalIngProc = myProdCalcStore.calcIngProc(allData, upNature, downNature, upMult, downMult, mySub)
            // 기력 그래프
            if(calcVer === 'proVer'){
                myProdCalcStore.onlyBaseSpeedH = myProdCalcStore.calcBaseSpeed(ribbonSpeedH, pkmLevelH, upNatureH, downNatureH, upMult, downMult, hBonus, hbMult, mySubH, allDataH, maxHS, useGoodCamp.value)
                myProdCalcStore.finalSkillProcH = myProdCalcStore.calcSkillProc(allDataH, upNatureH, downNatureH, upMult, downMult, mySubH)
                // 힐러 식재료 확률
                myProdCalcStore.finalIngProcH = myProdCalcStore.calcIngProc(allDataH, upNatureH, downNatureH, upMult, downMult, mySubH)
                myProdCalcStore.calcEnergyCurve(hasErb, erbMaxEnergy, ribbonInv, ribbonInvH, allHealSkillData, selfHealSkillData, randHealSkillData, totalMainSkill, pkmLevel, evoCount, mySub, secondIngName, thirdIngName, mainSkillLevel, allData, mealRecovery, useGoodCamp.value, maxE, mainSkillLevelH, sleepTime, calcVer, skillCount, timeForFull, upNature, downNature, upMult, downMult, erbCount, erbMult, enerPerHour, speedEnerMultList,
                allDataH, evoCountH, mySubH, pkmLevelH, secondIngH, thirdIngH, upNatureH, downNatureH, hasErbH)       
            }
            else{
                myProdCalcStore.calcEnergyCurve(hasErb, erbMaxEnergy, ribbonInv, ribbonInvH, allHealSkillData, selfHealSkillData, randHealSkillData, totalMainSkill, pkmLevel, evoCount, mySub, secondIngName, thirdIngName, mainSkillLevel, allData, mealRecovery, useGoodCamp.value, maxE, mainSkillLevelH, sleepTime, calcVer, skillCount, timeForFull, upNature, downNature, upMult, downMult, erbCount, erbMult, enerPerHour, speedEnerMultList, 
                allDataH)           
            }
            // 기력 적용 도우미 속도
            myProdCalcStore.calcSpeedWithEner(speedEnerMultList, calcVer, enerPerHour, sleepLimit)
            if(calcVer !== 'proVer' && (allData.skill.name.includes('Charge Energy') || allData.skill.name.includes('Energizing Cheer') || allData.skill.name.includes("Energy For Everyone") || allData.skill.name.includes('Metronome'))){
                // 자힐 가능한 포켓몬은 2번 기력 계산한다
                myProdCalcStore.calcEnergyCurve(hasErb, erbMaxEnergy, ribbonInv, ribbonInvH, allHealSkillData, selfHealSkillData, randHealSkillData, totalMainSkill, pkmLevel, evoCount, mySub, secondIngName, thirdIngName, mainSkillLevel, allData, mealRecovery, useGoodCamp.value, maxE, mainSkillLevelH, sleepTime, calcVer, skillCount, timeForFull, upNature, downNature, upMult, downMult, erbCount, erbMult, enerPerHour, speedEnerMultList,
                allDataH, evoCountH, mySubH, pkmLevelH, secondIngH, thirdIngH, upNatureH, downNatureH)
                myProdCalcStore.calcSpeedWithEner(speedEnerMultList, calcVer, enerPerHour, sleepLimit)              
            }          
            // 식재료 종류별 생산량
            myProdCalcStore.calcLeveLIng(calcVer, ribbonInv, ingSkillData, totalMainSkill, false, allData, pkmLevel, firstIngName, secondIngName, thirdIngName, sleepTime, enerPerHour, speedEnerMultList, evoCount, mySub, useGoodCamp.value, mainSkillLevel)    
            myProdCalcStore.calcLoading = false
        }
    }
    catch(e){      
        console.log('ing production calc err', e)
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

</script>