<template>
  <q-toolbar class="bg-primary text-white text-center">
    <q-toolbar-title>포켓몬 정보 입력</q-toolbar-title>
  </q-toolbar>
  <div class="column items-center q-gutter-y-md">        
    <!-- 포켓몬 이미지 -->
    <q-img              
      alt="Pokemon image"
      :src="selectPkmImage"
      fit="scale-down"
      style="max-width: 300px;"
      no-spinner
      @load="stopLoading()"
    />    
    <!-- 추천 개체값 평가 세팅 안내 -->
    <q-card v-if="showRecommend" class="bg-ingCircle q-mb-md" style="border: 4px solid #b46856" flat>
      <q-card-section class="row">
        <q-icon color="primary" size="md" name="info" left />
        <div class="col column justify-center" style="word-break: keep-all;"><span><span class="text-bold">최종진화 & 레벨 50</span>으로 설정하고 평가하기를 추천해요</span></div>
      </q-card-section>
    </q-card>     
    <!-- 포켓몬 이름 -->      
    <q-select class="full-width q-mt-none" filled color="secondary" v-model="pkmName" :options="pkmNameList" 
    label="포켓몬 이름"
    :error="props.nameValid" :error-message="nameEmptyMsg" @filter="searchName" @input-value="manageModel"
    use-input hide-selected fill-input input-debounce="0" @update:model-value="fetchApiIng"
    :hint="nameSearchHint" hide-bottom-space :readonly="selectPkmName" />    
    <!-- 직접 진화시킨 횟수 -->
    <div v-if="showEvoCount" class="text-center">
      직접 진화시킨 횟수: {{ evoCount }} 회
      <q-slider color="secondary" v-model="evoCount" :min="0" :max="2"/>
    </div>
    <!-- 레벨 -->
    <div class="text-center full-width">
      <q-btn color="secondary" round size="xs" icon="remove" @click="subtractLevel"></q-btn>
      <span class="q-px-md">레벨: {{ pkmLevel }}</span>
      <q-btn color="secondary" round size="xs" icon="add" @click="addLevel"></q-btn>
      <q-slider color="secondary" v-model="pkmLevel" :min="1" :max="100"/>
    </div>
    <!-- 식재료 선택 -->
    <div v-if="showIngChoose" class="row justify-center q-gutter-x-md">
      <q-btn fab color="ingCircle" :icon="firstIng" />
      <div>
        <q-tooltip :hide-delay="tooltipMobile()">
          레벨 30
        </q-tooltip>
        <q-fab v-if="pkmLevel < 30" color="ingCircle" icon="lock" text-color="teal" :disable= true direction="up" />
        <q-fab v-else color="ingCircle" :icon="secondIng" :disable="pkmLevel < 30" direction="up">
          <q-fab-action color="ingCircle" @click="chooseIng(2, 1)" :icon="firstIng" />
          <q-fab-action color="ingCircle" @click="chooseIng(2, 2)" :icon="fixedSecondIng" />
        </q-fab>
      </div>
      <div>
        <q-tooltip :hide-delay="tooltipMobile()">
          레벨 60
        </q-tooltip>
        <q-fab v-if="pkmLevel < 60" color="ingCircle" icon="lock" text-color="teal" :disable= true direction="up" />
        <q-fab v-else color="ingCircle" :icon="thirdIng" :disable="pkmLevel < 60" direction="up">
          <q-fab-action color="ingCircle" @click="chooseIng(3, 1)" :icon="firstIng" />
          <q-fab-action color="ingCircle" @click="chooseIng(3, 2)" :icon="fixedSecondIng" />
          <q-fab-action color="ingCircle" @click="chooseIng(3, 3)" :icon="fixedThirdIng" />
        </q-fab>
      </div>
    </div>
    <!-- 메인 스킬 렙 -->
    <div v-if="showMainSkillLevel" class="full-width text-center">
      메인 스킬 레벨: {{ mainSkillLevel }}
      <q-slider color="secondary" v-model="mainSkillLevel" :min="1" :max="maxSkillLevel"/>
    </div>
    <!-- 도우미 보너스 개수 -->
    <div v-if="showHbCount" class="text-center full-width">
      팀전체 <q-chip square class="bg-goldSkill">도우미 보너스</q-chip> 개수: {{ hbCount }}
      <q-slider color="secondary" v-model="hbCount" :min="0" :max="5"/>
    </div>
    <!-- 기력 회복 보너스 개수 -->
    <div v-if="showErbCount" class="text-center full-width">
      팀전체 <q-chip square class="bg-goldSkill">기력 회복 보너스</q-chip> 개수: {{ erbCount }}
      <q-slider color="secondary" v-model="erbCount" :min="0" :max="5"/>
    </div>
    <!-- 서브 스킬 선택 -->
    <q-select class="full-width" filled color="secondary" multiple v-model="subSkills" :options="subSkillOptions"
     :label= "limitSub" behavior="dialog" :max-values="watchLevel" clearable clear-icon="close"
     :error="props.subValid" :error-message="emptySub" hide-bottom-space>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" :class="scope.opt.bg">
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:selected-item="scope">
        <q-chip
          square
          removable
          @remove="scope.removeAtIndex(scope.index)"
          :tabindex="scope.tabindex"
          :class="scope.opt.bg"
          >{{ scope.opt.label }}</q-chip>
      </template>
    </q-select>
    <!-- 상승 성격 -->
    <q-select class="full-width" filled color="secondary" v-model="upNature" :options="myPkmDBStore.upNatureList" 
    label="상승 성격" behavior="dialog" :error="props.upValid" :error-message="wrongUpMsg" hide-bottom-space />
    <!-- 하락 성격 -->
    <q-select class="full-width" filled color="secondary" v-model="downNature" :options="myPkmDBStore.downNatureList" 
    label="하락 성격" behavior="dialog" :error="props.downValid" :error-message="wrongDownMsg" hide-bottom-space />
    <!-- 선호 이브이 진화 선택 -->
    <q-select v-if="showEeveePrefer" class="full-width" filled color="secondary" v-model="preferEevee" :options="myEeveeStore.eeveelutionList" 
    label="선호하는 진화체" behavior="dialog" :style="preferEeveeColor(preferEevee)" >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" :style="preferEeveeColor(scope.opt)">
          <q-item-section>
            <q-item-label >{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <span v-if="showEeveePrefer" class="full-width row justify-start q-mt-none">(선호해야지만 결과에 나오는 진화체가 있습니다)</span>    
    <q-card class="bg-sSkill">
      <q-card-section>
        <!-- 좋캠 적용 여부 -->
        <q-checkbox v-if="showGoodCamp" v-model="useGoodCamp">
          <template v-slot:default>
            좋은 캠프 적용
            <q-icon size="xl" name="img:images/goodcampticket.png" />
          </template>
        </q-checkbox>
        <!-- 힐러 포함 여부 -->
        <q-checkbox v-else-if="showUseHealer" v-model="useHealer">
          <template v-slot:default>
            추가 힐러 포켓몬 사용
            <q-icon size="xl" name="img:images/sylveonLink.png" />
          </template>
        </q-checkbox>
        <!-- 이브이 수면시간 풀잠 이상인지 -->
        <q-checkbox v-else-if="showEeveePrefer" v-model="fullSleep">
          <template v-slot:default>
            나는 8 시간 이상 잠을 잔다
          </template>
        </q-checkbox>
      </q-card-section>
    </q-card>
    <!-- 절친 리본 적용 여부 -->
    <q-card v-if="showUseRibbon" class="bg-sSkill">
      <q-card-section>        
        <q-checkbox v-model="useRibbon" @click="ribbonDialog">
          <template v-slot:default>
            굿나잇리본 적용
            <q-icon size="xl" name="img:images/ribbon.png" />
          </template>
        </q-checkbox>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showRibbon" persistent>
        <q-card>
          <q-bar>          
            <div>굿나잇리본 선택</div>              
          </q-bar>
          <q-card-section>
            <q-list>
              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-radio dense v-model="ribbonLev" val="0" color="secondary"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>선택 안함</q-item-label>                  
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-radio dense v-model="ribbonLev" val="1" color="secondary"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label><span class="text-bold">레벨 1</span> (수면 200h+)</q-item-label>
                  <q-item-label caption>최대 소지수 + {{ firstRibbonInv }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-radio dense v-model="ribbonLev" val="2" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><span class="text-bold">레벨 2</span> (수면 500h+)</q-item-label>
                  <q-item-label caption>최대 소지수 + {{ secondRibbonInv }}</q-item-label>
                  <q-item-label v-if="leftEvo > 0" caption>도우미 속도 + {{ secondRibbonSpeed }}%</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section avatar top>
                  <q-radio dense v-model="ribbonLev" val="3" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><span class="text-bold">레벨 3</span> (수면 1000h+)</q-item-label>
                  <q-item-label caption>최대 소지수 + {{ thirdRibbonInv }}</q-item-label>
                  <q-item-label v-if="leftEvo > 0" caption>도우미 속도 + {{ thirdRibbonSpeed }}%</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section avatar top>
                  <q-radio dense v-model="ribbonLev" val="4" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><span class="text-bold">레벨 4</span> (수면 2000h+)</q-item-label>
                  <q-item-label caption>최대 소지수 + {{ fourthRibbonInv }}</q-item-label>
                  <q-item-label v-if="leftEvo > 0" caption>도우미 속도 + {{ fourthRibbonSpeed }}%</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>   
            <div class="row justify-end full-width"><q-btn label="확인" color="primary" @click="updateRibbon" v-close-popup/></div> 
          </q-card-section>   
        </q-card>
      </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router';
import { usePkmDBStore } from 'src/stores/pkmDBStore';
import { useDownloadStore } from 'src/stores/downloadStore'
import { useInputStore, useHealerInputStore } from 'src/stores/inputStore'
import { useEeveeStore } from 'src/stores/eeveeStore'
import { useRateCalcStore } from 'src/stores/rateCalcStore';
import { loadingCalc, stopLoading } from 'src/utils/loading';
import { tooltipMobile } from 'src/utils/tooltip'

defineOptions({
  name: 'ChoosePkmComponent'
})

const myPkmDBStore = usePkmDBStore()
myPkmDBStore.loadKorPkmName()

// 컴포넌트를 현재 페이지에 따라 내용 바꾼다
const route = useRoute()
// 보여줄 요소 관리
const selectPkmName = ref(false)
const showEvoCount = ref(true)
const showIngChoose = ref(true)
const showMainSkillLevel = ref(true)
const showHbCount = ref(true)
const showErbCount = ref(true)
const showGoodCamp = ref(true)
const showUseHealer = ref(true)
const showEeveePrefer = ref(false)
const showUseRibbon = ref(true)
const showRecommend = ref(false)
// 선택 가능한 포켓몬 목록
const pkmNameList = ref(myPkmDBStore.korPkmName)

// 같은 루트 내에서 움직일때만 저장
const prevRoute = ref(route.path)
watch(prevRoute, (newPath, oldPath)=>{
  // unmount로 바뀐 루트를 비교한다. 바꼈으면 저장안함
  prevRoute.value = oldPath
})
onBeforeUnmount(()=>{
  if(route.path === prevRoute.value){
    if(prevRoute.value == '/rate'){      
      let subtractSkillLevel = 0
      for(let z=0; z< subSkills.value.length; z++){
        if(subSkills.value[z].label.includes("스킬 레벨 업")){
          subtractSkillLevel += subSkills.value[z].mult
        }
        else if(subSkills.value[z].label === '도우미 보너스'){ hbCount.value = 1 }
        else if(subSkills.value[z].label === '기력 회복 보너스'){ erbCount.value = 1 }
      }
      if(mainSkillLevel.value <= subtractSkillLevel){
        // 스렙업 서브가 사용자 입력 메인 스킬 레벨보다 작으면 적용 안했다고 가정해서 더함
        mainSkillLevel.value += subtractSkillLevel
      }
      // 힐러는 라이트 버전
      myHealerInputStore.calcVer = calcVer.value
      myHealerInputStore.healSkillCount = 4
    }
    if(prevRoute.value == '/eeveelution'){
      myEeveeStore.storeEverything(pkmLevel.value, subSkills.value, upNature.value, downNature.value, preferEevee.value, fullSleep.value)
    }
    else{
      // 기력회복보너스 보유시 수면 회복 기력 증가
      let hasErb = false
      for(let i = 0; i < subSkills.length; i++){
          if(subSkills[i].label === '기력 회복 보너스'){
              hasErb = true
          }
      }
      if(myPkmDBStore.searchPkmData('name', 'SYLVEON') !== undefined){
        myHealerInputStore.mainSkillLevel = myPkmDBStore.searchPkmData('name', 'SYLVEON').skill.maxLevel  
      }  
      // store에 저장
      myInputStore.storeEverything(hbCount.value, erbCount.value, 
        pkmName.value, pkmLevel.value, evoCount.value, subSkills.value, firstIngName.value,
        secondIngName.value, thirdIngName.value, fixedSecondIngName.value, fixedThirdIngName.value, upNature.value, downNature.value,
        selectedPkmDex.value, mainSkillLevel.value, useGoodCamp.value, useRibbon.value, ribbonLev.value, leftEvo.value, hasErb)
    }
  }
})

const props = defineProps({
  nameValid: {
    type: Boolean
  },
  subValid: {
    type: Boolean,
    default: false
  },
  upValid: {
    type: Boolean
  },
  downValid: {
    type: Boolean
  }
})

const myDownloadStore = useDownloadStore()
const myInputStore = useInputStore()
const myHealerInputStore = useHealerInputStore()
const myEeveeStore = useEeveeStore()
const myRateCalcStore = useRateCalcStore()

// 사용자 입력 포켓몬 이름
const pkmName = ref(myInputStore.pkmName)
// 사용자 입력 포켓몬 레벨
const pkmLevel = ref(myInputStore.pkmLevel)
// 직접 진화시킨 횟수
const evoCount = ref(myInputStore.evoCount)
// 가능한 진화 횟수
const leftEvo = ref(myInputStore.leftEvo)
// 사용자 선택 보유중인 서브 스킬들
const subSkills = ref(myInputStore.subSkills)
// 사용자 입력 총 도우미 보너스 개수
const hbCount = ref(myInputStore.hbCount)
// 사용자 입력 총 기력 회복 보너스 개수
const erbCount = ref(myInputStore.erbCount)
// 선택한 포켓몬의 첫번째 식재료 (이미지 주소꼴)
const firstIng = ref(myDownloadStore.fetchIcon('ing', myInputStore.firstIng.replace(/\s/g, "").toLowerCase()))
// 선택한 포켓몬의 두번째 식재료
const secondIng = ref(myDownloadStore.fetchIcon('ing', myInputStore.secondIng.replace(/\s/g, "").toLowerCase()))
// 선택한 포켓몬의 세번째 식재료
const thirdIng = ref(myDownloadStore.fetchIcon('ing', myInputStore.thirdIng.replace(/\s/g, "").toLowerCase()))
// 선택한 포켓몬의 첫번째 식재료 이름만
const firstIngName = ref(myInputStore.firstIng)
// 선택한 포켓몬의 두번째 식재료 이름만
const secondIngName = ref(myInputStore.secondIng)
// 선택한 포켓몬의 세번째 식재료 이름만
const thirdIngName = ref(myInputStore.thirdIng)
// 선택한 포켓몬의 두번째 식재료 이름만
const fixedSecondIngName = ref(myInputStore.fixedSecondIng)
// 선택한 포켓몬의 세번째 식재료 이름만
const fixedThirdIngName = ref(myInputStore.fixedThirdIng)
// 두번째 식재료 (이미지 주소꼴)
const fixedSecondIng = ref(myDownloadStore.fetchIcon('ing', myInputStore.fixedSecondIng.replace(/\s/g, "").toLowerCase()))
// 세번째 식재료
const fixedThirdIng = ref(myDownloadStore.fetchIcon('ing', myInputStore.fixedThirdIng.replace(/\s/g, "").toLowerCase()))
// 선택한 상승 성격
const upNature = ref(myInputStore.upNature)
// 선택한 하락 성격
const downNature = ref(myInputStore.downNature)
// 선택한 포켓몬 도감번호
const selectedPkmDex = ref(myInputStore.selectedPkmDex)
// 선택한 포켓몬 이미지
const selectPkmImage = ref()
// 선택한 포켓몬의 최대 메인 스킬 레벨
const maxSkillLevel = ref(6)
const mainSkillLevel = ref(myInputStore.mainSkillLevel)
// 선호 이브이 진화체 선택
const preferEevee = ref(myEeveeStore.preferEevee)
// 이브이 풀잠
const fullSleep = ref(myEeveeStore.fullSleep)
// 굿나잇리본 레벨 선택
const ribbonLev = ref(myInputStore.ribbonLev)
// 굿나잇리본 1렙
const firstRibbonInv = ref(myPkmDBStore.ribbonList[0]["inventory"])
// 굿나잇리본 2렙
const secondRibbonInv = ref(myPkmDBStore.ribbonList[1]["inventory"])
const secondRibbonSpeed = ref(myPkmDBStore.ribbonList[1]["speed"][leftEvo.value])
// 굿나잇리본 3렙
const thirdRibbonInv = ref(myPkmDBStore.ribbonList[2]["inventory"])
const thirdRibbonSpeed = ref(myPkmDBStore.ribbonList[2]["speed"][leftEvo.value])
// 굿나잇리본 4렙
const fourthRibbonInv = ref(myPkmDBStore.ribbonList[3]["inventory"])
const fourthRibbonSpeed = ref(myPkmDBStore.ribbonList[3]["speed"][leftEvo.value])
// 유효성 검사 이름 & 성격
// 유효성 검사 메시지
const nameEmptyMsg = ref('포켓몬을 선택해주세요')
const wrongUpMsg = ref('상승 성격을 다시 입력해주세요')
const wrongDownMsg = ref('하락 성격을 다시 입력해주세요')
const emptySub = computed(()=>{
  return `서브 스킬을 ${watchLevel.value}개 선택해주세요`
})
const nameSearchHint = ref('입력하고 엔터를 눌러서 검색')

// 현재 레벨에 따라 선택 가능한 서브 스킬 수 제한
const watchLevel = computed(()=>{
  switch(true){
    case pkmLevel.value < 10:
      return 0
    case pkmLevel.value < 25:
      return 1
    case pkmLevel.value < 50:
      return 2
    case pkmLevel.value < 75:
      return 3
    case pkmLevel.value < 100:
      return 4
    default:
      return 5
  }
})
const limitSub = computed(()=>{
  return `서브 스킬 (최대 ${watchLevel.value}개)`
})
// 서브 스킬 전부 선택했는지
const didSelectAllSub = computed(()=>{
  return subSkills.value.length === watchLevel.value ? true : false
})

// 좋은 캠프 티켓 사용할지
const useGoodCamp = ref(myInputStore.useGoodCamp)
// 힐러 쓰고 계산할지
const useHealer = ref(myRateCalcStore.useHealer)
const calcVer = computed(()=>{
  return useHealer.value ? 'lightVer' : 'noHealer'
})
// 굿나잇리본 적용 여부
const useRibbon = ref(myInputStore.useRibbon)
const showRibbon = ref(false)

// 현재 페이지에 따라 선택 가능한 서브 스킬 목록 다름
const subSkillOptions = ref()

// 포켓몬 선택시 식재료 목록 불러오기
function chooseIng(location, ingNum){
  let chosenIcon;
  let chosenIconName;
  switch(ingNum){
    case 1:
      chosenIcon = firstIng.value;
      chosenIconName = firstIngName.value;
      break;
    case 2:
      chosenIcon = fixedSecondIng.value;
      chosenIconName = fixedSecondIngName.value;
      break;
    case 3:
      chosenIcon = fixedThirdIng.value;
      chosenIconName = fixedThirdIngName.value;
      break;
    default:
      return 0
  }
  if(location === 2){
    secondIng.value = chosenIcon
    secondIngName.value = chosenIconName
  }
  else if(location === 3){
    thirdIng.value = chosenIcon
    thirdIngName.value = chosenIconName
  }
}
// 포켓몬을 선택하면 데이터 불러오기 + 식재료 목록 출력 + 이미지 불러오기
async function fetchApiIng(){
  loadingCalc('불러오는 중...')
  await myPkmDBStore.fetchPkmData(myPkmDBStore.convertKorEn(pkmName.value))
  firstIng.value = myDownloadStore.fetchIcon('ing', myPkmDBStore.bringIng(pkmName.value, 0))
  fixedSecondIng.value = myDownloadStore.fetchIcon('ing', myPkmDBStore.bringIng(pkmName.value, 1))
  fixedThirdIng.value = myDownloadStore.fetchIcon('ing', myPkmDBStore.bringIng(pkmName.value, 2))
  secondIng.value = fixedSecondIng.value
  thirdIng.value = fixedThirdIng.value
  firstIngName.value = myPkmDBStore.bringIng(pkmName.value, 0, 'store')
  fixedSecondIngName.value = myPkmDBStore.bringIng(pkmName.value, 1, 'store')
  fixedThirdIngName.value = myPkmDBStore.bringIng(pkmName.value, 2, 'store')
  secondIngName.value = fixedSecondIngName.value
  thirdIngName.value = fixedThirdIngName.value
  // 연달아 2번 동일한 포켓몬 불러오면 로딩 화면 종료
  const originDex = selectedPkmDex.value
  selectedPkmDex.value = myPkmDBStore.findDexNum(pkmName.value)
  if(originDex === selectedPkmDex.value){ stopLoading() }
  // 힐러 정보 미리 불러오기
  await myPkmDBStore.fetchPkmData('SYLVEON')
  
  selectPkmImage.value = myDownloadStore.fetchImage('pkm', selectedPkmDex.value)
  // 불러온 포켓몬의 모든 정보
  const allData = myPkmDBStore.searchPkmData('name', myPkmDBStore.convertKorEn(pkmName.value))
  // 불러온 포켓몬의 남은 진화횟수
  leftEvo.value = allData.remainingEvolutions
  // 굿나잇리본 효과 반영
  secondRibbonSpeed.value = myPkmDBStore.ribbonList[1]["speed"][leftEvo.value]
  thirdRibbonSpeed.value = myPkmDBStore.ribbonList[2]["speed"][leftEvo.value]
  fourthRibbonSpeed.value = myPkmDBStore.ribbonList[3]["speed"][leftEvo.value]
  // 메인 스킬 최대 레벨 반영
  maxSkillLevel.value = allData.skill.maxLevel
  mainSkillLevel.value = mainSkillLevel.value > maxSkillLevel.value ? maxSkillLevel.value : mainSkillLevel.value
}
function addLevel(){
  pkmLevel.value += 1
}
function subtractLevel(){
  pkmLevel.value -= 1
}

function searchName (val, update, abort) {
  update(() => {
    pkmNameList.value = myPkmDBStore.korPkmName.filter(v => v.indexOf(val) > -1)
  })
}
function manageModel(val){
  if(val.length > 0 && val !== myInputStore.pkmName && route.path !== '/eeveelution'){
    pkmName.value = ''
  }
}
// 선호 이브이 선택시 배경색 변경
function preferEeveeColor(c){
  if(c !== undefined){
    if(c.label === "없음"){
      return
    }
    let color = `background-color: ${c.bg};`
    if(c.label === "블래키"){
      const white = "#fcfcfc"
      color += `color: ${white};`
    }
    return color
  }  
}
// 굿나잇리본 팝업 띄우기
function ribbonDialog(){
  showRibbon.value = true
}
// 굿나잇리본 선택 사항 업데이트
function updateRibbon(){
  if(ribbonLev.value == "0"){
    useRibbon.value = false
  }
  else{
    useRibbon.value = true
  }
}
onBeforeMount(()=>{
  // 첫 로딩때 미리 저장해둔 이미지 불러와야 로딩 빠름  
  if(route.path !== 'eeveelution' && pkmName.value.length > 0){
    selectPkmImage.value = myDownloadStore.fetchImage('pkm', selectedPkmDex.value)
  }
  else if(route.path !== 'eeveelution'){
    selectPkmImage.value = 'images/pikachuStanding.png'
  }
  switch(route.path){
    case '/prodcalc':
      showUseHealer.value = false
      subSkillOptions.value = myPkmDBStore.allSubSkillList
      break
    case '/rate':      
      showHbCount.value = false
      showErbCount.value = false
      showGoodCamp.value = false
      showRecommend.value = true
      subSkillOptions.value = myPkmDBStore.allSubSkillList    
      break
    case '/eeveelution':
      selectPkmName.value = true
      showHbCount.value = false
      showErbCount.value = false
      showEvoCount.value = false
      showIngChoose.value = false
      showMainSkillLevel.value = false
      showGoodCamp.value = false
      showUseHealer.value = false
      showEeveePrefer.value = true
      showUseRibbon.value = false
      subSkillOptions.value = myPkmDBStore.allSubSkillList
      selectPkmImage.value = myDownloadStore.fetchImage('pkm', 133)
      pkmName.value = "이브이"
      nameSearchHint.value = "즐거운 이브이 진로상담 시간"
      pkmLevel.value = myEeveeStore.pkmLevel
      subSkills.value = myEeveeStore.subSkills
      upNature.value = myEeveeStore.upNature
      downNature.value = myEeveeStore.downNature
      preferEevee.value = myEeveeStore.preferEevee
      break
    default:
      return
  }
})

// 부모 컴포넌트에서 입력했는지 확인
defineExpose({
  pkmName,
  upNature,
  downNature,
  didSelectAllSub
})

</script>

