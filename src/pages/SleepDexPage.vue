<template>
<q-page :class="showDex ? 'row justify-center bg-googleDark' : 'flex flex-center bg-googleDark'">
<div class="col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-6 bg-googleBack q-px-md" :style="!showDex ? 'border: 2mm solid #b46856' : ''">
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
        <div class="relative-position">
          <!-- 레벨 0 -->
          <q-badge v-if="ingCount[0] > 1" color="orange" floating class="text-bold" style="z-index: 1000 !important;">* {{ ingCount[0] }}</q-badge>
          <q-fab color="ingCircle" :icon="firstIng" direction="up">          
            <q-fab-action v-for="(ing, index) in allIngList[0]" :key="index"
              color="ingCircle" @click="chooseIng(1, index + 1)" :icon="ing.url" 
            />          
          </q-fab>   
        </div> 
        <!-- <q-btn fab color="ingCircle" :icon="firstIng" >
          <q-badge v-if="ingCount[0] > 1" color="orange" floating class="text-bold">* {{ firstIngCount }}</q-badge></q-btn> -->
        <div class="q-mx-md relative-position">
          <q-badge v-if="ingCount[1] > 1" color="orange" floating class="text-bold" style="z-index: 1000 !important;">* {{ ingCount[1] }}</q-badge>
          <q-tooltip :hide-delay="tooltipMobile()">
            레벨 30
          </q-tooltip> 
          <q-fab color="ingCircle" :icon="secondIng" direction="up">          
            <q-fab-action v-for="(ing, index) in allIngList[1]" :key="index"
              color="ingCircle" @click="chooseIng(2, index + 1)" :icon="ing.url" 
            />          
          </q-fab>   
        </div>
        <div class="relative-position">
          <q-badge v-if="ingCount[2] > 1" color="orange" floating class="text-bold" style="z-index: 1000 !important;">* {{ ingCount[2] }}</q-badge>
          <q-tooltip :hide-delay="tooltipMobile()">
            레벨 60
          </q-tooltip> 
          <q-fab color="ingCircle" :icon="thirdIng" direction="up">          
            <q-fab-action v-for="(ing, index) in allIngList[2]" :key="index"
              color="ingCircle" @click="chooseIng(3, index + 1)" :icon="ing.url" 
            />          
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
// 고정= 선택한 포켓몬의 첫번째 식재료 이름만
const fixedFirstIngName = ref('')
// 고정= 선택한 포켓몬의 두번째 식재료 이름만
const fixedSecondIngName = ref('')
// 고정= 선택한 포켓몬의 세번째 식재료 이름만
const fixedThirdIngName = ref('')
// 고정= 첫번째 식재료
const fixedFirstIng = ref(firstIng.value)
// 고정= 두번째 식재료
const fixedSecondIng = ref(secondIng.value)
// 고정= 세번째 식재료
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
// const firstIngCount = ref(1)
const ingCount = ref([0, 0, 0])
// 각종 수치 데이터
const invenSize = ref(0)
const baseSpeed = ref('')
const ingProc = ref(0)
const skillProc = ref(0)

// 포켓몬 선택시 식재료 목록 불러오기
function chooseIng(location, ingPlace){
  const chosenIconName = myPkmDBStore.bringIng(pkmName.value, ingPlace);
  const chosenIcon = `img:ingredients/${chosenIconName}.png`;
  if(location === 1){
    firstIng.value = chosenIcon
    firstIngName.value = chosenIconName
  }
  else if(location === 2){
    secondIng.value = chosenIcon
    secondIngName.value = chosenIconName
  }
  else if(location === 3){
    thirdIng.value = chosenIcon
    thirdIngName.value = chosenIconName
  }
  allIngList.value[location - 1].forEach((e)=>{
    if(e.name === chosenIconName){
      ingCount.value[location - 1] = e.amount
    }
  })
}
// 포켓몬을 선택하면 데이터 불러오기 + 식재료 목록 출력 + 이미지 불러오기
async function fetchApiIng(){
  loadingCalc('불러오는 중...')
  await myPkmDBStore.fetchPkmData(pkmName.value)
  const fetchedData = myPkmDBStore.searchPkmData('kor_name', pkmName.value)  
  whatBerry.value = myDownloadStore.fetchIcon('berry', fetchedData.berries.name);

  fixedFirstIng.value = `img:ingredients/${myPkmDBStore.bringIng(pkmName.value, 1)}.png`
  fixedSecondIng.value = `img:ingredients/${myPkmDBStore.bringIng(pkmName.value, 2)}.png`
  fixedThirdIng.value = `img:ingredients/${myPkmDBStore.bringIng(pkmName.value, 3)}.png`
  firstIng.value = fixedFirstIng.value
  secondIng.value = fixedSecondIng.value
  thirdIng.value = fixedThirdIng.value  

  fixedFirstIngName.value = myPkmDBStore.bringIng(pkmName.value, 1)
  fixedSecondIngName.value = myPkmDBStore.bringIng(pkmName.value, 2)
  fixedThirdIngName.value = myPkmDBStore.bringIng(pkmName.value, 3)
  firstIngName.value = fixedFirstIngName.value
  secondIngName.value = fixedSecondIngName.value
  thirdIngName.value = fixedThirdIngName.value  

  invenSize.value = fetchedData.carry_size + fetchedData.previous_evolutions * 5
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
  ingProc.value = fetchedData.ingredient_percentage + " %"
  skillProc.value= fetchedData.skill_percentage + " %"
  allIngList.value = []  
  // 식재료 & 열매수 불러오기  
  berryNum.value = fetchedData.specialty === "berry" || fetchedData.specialty === "all" ? 2 : 1
  allIngList.value.push(fetchedData["ingredient0"])
  allIngList.value.push(fetchedData["ingredient30"])
  allIngList.value.push(fetchedData["ingredient60"])
  for (let z = 0; z < 3; z++){
    allIngList.value[z].forEach(ele => {
      ele['url'] = `img:ingredients/${ele.name}.png`
    })
  }  
  fetchedData["ingredient0"].forEach((e)=>{    
    if(e.name === fixedFirstIngName.value){
      ingCount.value[0] = e.amount
    }
  })
  fetchedData["ingredient30"].forEach((e)=>{
    if(e.name === fixedSecondIngName.value){
      ingCount.value[1] = e.amount
    }
  })
  fetchedData["ingredient60"].forEach((e)=>{
    if(e.name === fixedThirdIngName.value){
      ingCount.value[2] = e.amount
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
  myPkmDBStore.loadKorPkmName()
  // 첫 로딩때 미리 저장해둔 이미지 불러와야 로딩 빠름  
  selectPkmImage.value = 'images/pikachuStanding.png'
})

</script>

