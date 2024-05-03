<template>
<q-page :class="showDex ? 'row justify-center bg-googleDark' : 'flex flex-center bg-googleDark'">
<div class="col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 bg-googleBack q-px-md" :style="!showDex ? 'border: 2mm solid #b46856' : ''">
  <q-toolbar class="bg-primary text-white text-center">
      <q-toolbar-title>포켓몬을 검색하세요</q-toolbar-title>
  </q-toolbar>    
<div class="column items-center q-gutter-y-md">
  <!-- 포켓몬 이미지 -->
  <q-img
      alt="Pokemon image"
      :src="selectPkmImage"
      fit="scale-down"
      style="width: 300px;"
      no-spinner
      @load="stopLoading()"
      >
  </q-img>
  <!-- 포켓몬 이름 -->
  <q-select :class="!showDex ? 'q-mt-none' : 'full-width q-mt-none'" filled color="secondary" v-model="pkmName" :options="pkmNameList" 
  label="포켓몬 이름"
  @filter="searchName" @input-value="manageModel"
  use-input hide-selected fill-input input-debounce="0" @update:model-value="fetchApiIng"
  :hint="nameSearchHint" hide-bottom-space />
  <q-space />
</div>
<div v-if="showDex" class="column items-center">
  <div class="q-gutter-y-md full-width" style="max-width: 300px;">
    <div class="row items-center">
      <!-- 나무열매 -->
      <q-chip color="secondary" text-color="white" style="width: 84px;"><span class="full-width row justify-center text-bold">나무열매</span></q-chip>
      <q-btn fab color="ingCircle" :icon="whatBerry">
        <q-badge v-if="berryNum > 1" color="orange" floating class="text-bold">* {{ berryNum }}</q-badge></q-btn>
    </div>
    <!-- 식재료 선택 -->
    <div class="row items-center full-width">
      <q-chip color="secondary" text-color="white" style="width: 84px;"><span class="full-width row justify-center text-bold">식재료</span></q-chip>
      <div class="row">
        <q-btn fab color="ingCircle" :icon="firstIng" >
          <q-badge v-if="firstIngCount > 1" color="orange" floating class="text-bold">* {{ firstIngCount }}</q-badge></q-btn>
        <div class="q-mx-md relative-position">     
          <q-badge v-if="ingCount[0] > 1" color="orange" floating class="text-bold" style="z-index: 1000 !important;">* {{ ingCount[0] }}</q-badge>
          <q-tooltip :hide-delay="tooltipMobile()">
            레벨 30
          </q-tooltip>      
          <q-fab color="ingCircle" :icon="secondIng" direction="up">
            <q-fab-action color="ingCircle" @click="chooseIng(2, 1)" :icon="firstIng" />
            <q-fab-action color="ingCircle" @click="chooseIng(2, 2)" :icon="fixedSecondIng" />                
          </q-fab>                  
        </div>
        <div class="relative-position" >
          <q-badge v-if="ingCount[1] > 1" color="orange" floating class="text-bold" style="z-index: 1000 !important;">* {{ ingCount[1] }}</q-badge>
          <q-tooltip :hide-delay="tooltipMobile()">
            레벨 60
          </q-tooltip>      
          <q-fab color="ingCircle" :icon="thirdIng" direction="up">
            <q-fab-action color="ingCircle" @click="chooseIng(3, 1)" :icon="firstIng" />
            <q-fab-action color="ingCircle" @click="chooseIng(3, 2)" :icon="fixedSecondIng" />
            <q-fab-action color="ingCircle" @click="chooseIng(3, 3)" :icon="fixedThirdIng" />
          </q-fab>
        </div>
      </div>
    </div>
    <q-input v-model="invenSize" class="full-width" readonly input-class="text-center text-bold text-subtitle1">
      <template v-slot:before>
        <q-chip color="primary" text-color="white"><span class="full-width row justify-center text-bold">
          기본 소지 수</span></q-chip>
      </template>
    </q-input>
    <q-input v-model="baseSpeed" readonly input-class="text-center text-bold text-subtitle1">
      <template v-slot:before>
        <q-chip color="primary" text-color="white"><span class="full-width row justify-center text-bold">
          기본 도우미 속도</span></q-chip>
      </template>
    </q-input>
    <q-input v-model="ingProc" readonly input-class="text-center text-bold text-subtitle1">
      <template v-slot:before>
        <q-chip color="primary" text-color="white"><span class="full-width row justify-center text-bold">
          식재료 확률</span></q-chip>
      </template>
    </q-input>
    <q-input v-model="skillProc" readonly class="q-pb-md" input-class="text-center text-bold text-subtitle1">
      <template v-slot:before>
        <q-chip color="primary" text-color="white"><span class="full-width row justify-center text-bold">
          스킬 발동 확률</span></q-chip>
      </template>
    </q-input>
  </div>
</div>
</div>
</q-page>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { usePkmDBStore } from 'src/stores/pkmDBStore';
import { useDownloadStore } from 'src/stores/downloadStore'
import { loadingCalc, stopLoading } from 'src/utils/loading';
import { tooltipMobile } from 'src/utils/tooltip'

defineOptions({
  name: 'ChoosePkmComponent'
})

const myPkmDBStore = usePkmDBStore()
myPkmDBStore.loadKorPkmName()
const myDownloadStore = useDownloadStore()

// 선택 가능한 포켓몬 목록
const pkmNameList = ref(myPkmDBStore.korPkmName)

const showDex = ref(false)
// 사용자 입력 포켓몬 이름
const pkmName = ref('')
const whatBerry = ref('')
// 선택한 포켓몬의 첫번째 식재료
const firstIng = ref('')
// 선택한 포켓몬의 두번째 식재료
const secondIng = ref('')
// 선택한 포켓몬의 세번째 식재료
const thirdIng = ref('')
// 선택한 포켓몬의 첫번째 식재료 이름만
const firstIngName = ref('')
// 선택한 포켓몬의 두번째 식재료 이름만
const secondIngName = ref('')
// 선택한 포켓몬의 세번째 식재료 이름만
const thirdIngName = ref('')
// 선택한 포켓몬의 두번째 식재료 이름만
const fixedSecondIngName = ref('')
// 선택한 포켓몬의 세번째 식재료 이름만
const fixedThirdIngName = ref('')
// 두번째 식재료
const fixedSecondIng = ref(secondIng.value)
// 세번째 식재료
const fixedThirdIng = ref(thirdIng.value)
// 레벨별 모든 식재료
const allIngList = ref([])
// 선택한 포켓몬 도감번호
const selectedPkmDex = ref(1)
// 선택한 포켓몬 이미지
const selectPkmImage = ref()
const nameSearchHint = ref('입력하고 엔터를 눌러서 검색')
// 열매, 식재료 개수
const berryNum = ref(1)
const firstIngCount = ref(1)
const ingCount = ref([0, 0])
// 각종 수치 데이터
const invenSize = ref(0)
const baseSpeed = ref('')
const ingProc = ref(0)
const skillProc = ref(0)

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
  allIngList.value[location - 2].forEach((e)=>{
    if(e.ingredient.longName === chosenIconName){
      ingCount.value[location - 2] = e.amount
    }
  })
}
// 포켓몬을 선택하면 데이터 불러오기 + 식재료 목록 출력 + 이미지 불러오기
async function fetchApiIng(){
  loadingCalc('불러오는 중...')
  await myPkmDBStore.fetchPkmData(myPkmDBStore.convertKorEn(pkmName.value))
  const fetchedData = myPkmDBStore.searchPkmData('name', myPkmDBStore.convertKorEn(pkmName.value))
  whatBerry.value = myDownloadStore.fetchIcon('berry', fetchedData.berry.name)
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
  invenSize.value = fetchedData.carrySize
  baseSpeed.value = ''
  let justSec = fetchedData.frequency
  if(Math.floor(justSec / Math.pow(60, 2)) > 0){
    baseSpeed.value += `${Math.floor(justSec / Math.pow(60, 2))}시간`
    justSec = justSec % Math.pow(60, 2)
  }
  if(Math.floor(justSec / 60) > 0){
    baseSpeed.value += ` ${Math.floor(justSec / 60)}분`
    justSec = justSec % 60
  }
  baseSpeed.value += ` ${justSec}초`
  ingProc.value = fetchedData.ingredientPercentage + " %"
  skillProc.value= fetchedData.skillPercentage + " %"
  allIngList.value = []
  const just = ["ingredient30", "ingredient60"]
  for(let i in just){    
    allIngList.value.push(fetchedData[just[i]])    
  }
  // 식재료 & 열매수 불러오기
  firstIngCount.value = fetchedData["ingredient0"].amount
  berryNum.value = fetchedData.specialty === "berry" ? 2 : 1
  allIngList.value[0].forEach((e)=>{
    if(e.ingredient.longName === fixedSecondIngName.value){
      ingCount.value[0] = e.amount
    }
  })
  allIngList.value[1].forEach((e)=>{
    if(e.ingredient.longName === fixedThirdIngName.value){
      ingCount.value[1] = e.amount
    }
  })
  // 연달아 2번 동일한 포켓몬 불러오면 로딩 화면 종료
  const originDex = selectedPkmDex.value
  selectedPkmDex.value = myPkmDBStore.findDexNum(pkmName.value)
  if(originDex === selectedPkmDex.value){ stopLoading() }
  selectPkmImage.value = myDownloadStore.fetchImage('pkm', selectedPkmDex.value)
  showDex.value = true
}

function searchName (val, update, abort) {
  update(() => {
    pkmNameList.value = myPkmDBStore.korPkmName.filter(v => v.indexOf(val) > -1)
  })
}
function manageModel(val){
  if(val.length > 0){
    pkmName.value = ''
  }
}

onBeforeMount(()=>{
  // 첫 로딩때 미리 저장해둔 이미지 불러와야 로딩 빠름  
  selectPkmImage.value = 'images/pikachuStanding.png'
})

</script>

