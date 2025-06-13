<template>
  <q-toolbar class="bg-primary text-white text-center">
    <q-toolbar-title>힐러 포켓몬 설정</q-toolbar-title>
  </q-toolbar>
  <q-list>
    <q-item tag="label" v-ripple>
      <q-item-section avatar>
        <q-radio v-model="calcVer" val="lightVer" color="secondary" />
      </q-item-section>
      <q-item-section>
        <q-item-label>라이트</q-item-label>
      </q-item-section>
    </q-item>
    <q-item tag="label" v-ripple>
      <q-item-section avatar>
        <q-radio v-model="calcVer" val="proVer" color="secondary" />
      </q-item-section>
      <q-item-section>
        <q-item-label>프로 (오래 걸림 주의)</q-item-label>
      </q-item-section>
    </q-item>
    <q-item tag="label" v-ripple>
      <q-item-section avatar>
        <q-radio v-model="calcVer" val="noHealer" color="secondary" />
      </q-item-section>
      <q-item-section>
        <q-item-label>힐러 없음</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
    <div class="q-mt-lg" v-if="calcVer == 'lightVer'">
      <div>
        하루 스킬 발동 횟수: {{ healSkillCount }} 회
        <q-slider color="secondary" v-model="healSkillCount" :min="0" :max="24"/>
      </div>
      <div>
        메인 스킬 레벨: {{ mainSkillLevel }}
        <q-slider color="secondary" v-model="mainSkillLevel" :min="1" :max="maxSkillLevel"/>
      </div>
      <div style="height: 5vh;">
      </div>
    </div>
    <div v-else-if="calcVer == 'proVer'" class="column items-center q-gutter-y-md">
      <q-img
        alt="Healer image"
        :src="selectHealerImage"
        style="max-width: 300px"
        fit="scale-down"
        no-spinner
        @load="stopLoading()"/>
    <q-select class="full-width q-mt-none" filled color="secondary" v-model="pkmName"
    :options="pkmNameList" 
    label="포켓몬 이름"
    :error="props.nameValid" :error-message="nameEmptyMsg"
    hint="입력하고 엔터를 눌러서 검색" @filter="searchName" @input-value="manageModel"
    @update:model-value="fetchApiIng"
    use-input hide-selected fill-input input-debounce="0" hide-bottom-space/>
    <div class="text-center full-width">
      <q-btn color="secondary" round size="xs" icon="remove" @click="subtractLevel"></q-btn>
      <span class="q-px-md">레벨: {{ pkmLevel }}</span>
      <q-btn color="secondary" round size="xs" icon="add" @click="addLevel"></q-btn>
      <q-slider color="secondary" v-model="pkmLevel" :min="1" :max="100"/>
    </div>
    <div class="row justify-center q-gutter-x-md">
      <div>
        <q-btn v-if="pkmName == ''" fab color="ingCircle" :icon="firstIng" />
        <q-fab v-else color="ingCircle" :icon="firstIng" direction="up">
          <!-- 레벨 0 -->
          <q-fab-action v-for="(ing, index) in allIngList[0]" :key="index" 
            color="ingCircle" @click="chooseIng(1, index + 1)" :icon="ing.url" 
          />          
        </q-fab>
      </div>      
      <div>
        <q-tooltip :hide-delay="tooltipMobile()">
          레벨 30
        </q-tooltip>
        <q-fab v-if="pkmLevel < 30" color="ingCircle" icon="lock" text-color="teal" :disable= true direction="up" />
        <q-btn v-else-if="pkmName == ''" fab color="ingCircle" :icon="secondIng" />
        <q-fab v-else color="ingCircle" :icon="secondIng" direction="up">          
          <q-fab-action v-for="(ing, index) in allIngList[1]" :key="index"
            color="ingCircle" @click="chooseIng(2, index + 1)" :icon="ing.url" 
          />          
        </q-fab>                
      </div>
      <div>
        <q-tooltip :hide-delay="tooltipMobile()">
          레벨 60
        </q-tooltip>
        <q-fab v-if="pkmLevel < 60" color="ingCircle" icon="lock" text-color="teal" :disable= true direction="up" />
        <q-btn v-else-if="pkmName == ''" fab color="ingCircle" :icon="thirdIng" />
        <q-fab v-else color="ingCircle" :icon="thirdIng" direction="up">          
          <q-fab-action v-for="(ing, index) in allIngList[2]" :key="index"
            color="ingCircle" @click="chooseIng(3, index + 1)" :icon="ing.url" 
          />          
        </q-fab>           
      </div>
    </div>
    <div class="full-width text-center">
      메인 스킬 레벨: {{ mainSkillLevel }}
      <q-slider color="secondary" v-model="mainSkillLevel" :min="1" :max="maxSkillLevel"/>
    </div>
    <q-select class="full-width" filled color="secondary" multiple v-model="subSkills" :options="myPkmDBStore.allSubSkillList"
    :label= "limitSub" behavior="dialog" :max-values="watchLevel">
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" :class="scope.opt.bg">
          <q-item-section>
            <q-item-label >{{ scope.opt.label }}</q-item-label>
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
    <q-select class="full-width" filled color="secondary" v-model="upNature" :options="myPkmDBStore.upNatureList" 
    label="상승 성격" behavior="dialog" :error="props.upValid" :error-message="wrongUpMsg" hide-bottom-space></q-select>
    <q-select class="full-width" filled color="secondary" v-model="downNature" :options="myPkmDBStore.downNatureList" 
    label="하락 성격" behavior="dialog" :error="props.downValid" :error-message="wrongDownMsg" hide-bottom-space></q-select>
    <!-- 절친 리본 적용 여부 -->
    <q-card class="bg-sSkill">
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
    <div v-else>
      <div style="height: 5vh;">
      </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import { useDownloadStore } from 'src/stores/downloadStore';
import { usePkmDBStore } from 'src/stores/pkmDBStore';
import { useHealerInputStore } from 'src/stores/inputStore';
import { loadingCalc, stopLoading } from 'src/utils/loading';
import { tooltipMobile } from 'src/utils/tooltip';

defineOptions({
  name: 'ChooseHealerComponent'
})
const props = defineProps({
  nameValid: {
    type: Boolean
  },
  upValid: {
    type: Boolean
  },
  downValid: {
    type: Boolean
  }
})
onBeforeUnmount(()=>{
  // 기력회복보너스 보유시 수면 회복 기력 증가
  let hasErb = false
  for(let i = 0; i < subSkills.value.length; i++){
      if(subSkills.value[i].label === '기력 회복 보너스'){
          hasErb = true
      }
  }
  myHealerInputStore.storeEverything(calcVer.value, healSkillCount.value,
    pkmName.value, pkmLevel.value, subSkills.value, firstIngName.value, secondIngName.value, thirdIngName.value,
    fixedFirstIngName.value, fixedSecondIngName.value, fixedThirdIngName.value, upNature.value, downNature.value,
    selectedHealerDex.value, mainSkillLevel.value, useRibbon.value, ribbonLev.value, leftEvo.value, hasErb)
})
const myDownloadStore = useDownloadStore()
const myPkmDBStore = usePkmDBStore()
const myHealerInputStore = useHealerInputStore()
const pkmNameList = ref(myPkmDBStore.korPkmName)
// 힐러 포켓몬 설정 스펙
const calcVer = ref(myHealerInputStore.calcVer)
// 힐러 메인 스킬 사용 횟수
const healSkillCount = ref(myHealerInputStore.healSkillCount)
// 힐러 메인 스킬 레벨
myHealerInputStore.mainSkillLevel = myPkmDBStore.searchPkmData('kor_name', '가디안').main_skills.max_level
const mainSkillLevel = ref(myHealerInputStore.mainSkillLevel)
const maxSkillLevel = ref(6)
// 이름
const pkmName = ref(myHealerInputStore.pkmName)
onBeforeMount(async()=>{
  try{
    // 처음엔 가디안이 기본 힐러로 설정돼있다
    await myPkmDBStore.fetchPkmData(pkmName.value)  
    maxSkillLevel.value = myPkmDBStore.searchPkmData('kor_name', '가디안').main_skills.max_level
  }
  catch(e){
    console.log('healer fetch error', e)
  }
})

// 선택한 힐러 도감번호
const selectedHealerDex = ref(myHealerInputStore.selectedPkmDex)
// 선택한 힐러 이미지
const selectHealerImage = ref(myDownloadStore.fetchImage('pkm', selectedHealerDex.value))
// 힐러 레벨
const pkmLevel = ref(myHealerInputStore.pkmLevel)
// 힐러 서브 스킬 목록
const subSkills = ref(myHealerInputStore.subSkills)
// 힐러 상승 성격
const upNature = ref(myHealerInputStore.upNature)
// 힐러 하락 성격
const downNature = ref(myHealerInputStore.downNature)
// 선택한 포켓몬의 첫번째 식재료 이름만
const firstIngName = ref(myHealerInputStore.firstIng)
// 선택한 포켓몬의 두번째 식재료 이름만
const secondIngName = ref(myHealerInputStore.secondIng)
// 선택한 포켓몬의 세번째 식재료 이름만
const thirdIngName = ref(myHealerInputStore.thirdIng)
// 선택한 포켓몬의 첫번째 식재료 이미지
const firstIng = ref(myDownloadStore.fetchIcon('ing', firstIngName.value))
// 선택한 포켓몬의 두번째 식재료 이미지
const secondIng = ref(myDownloadStore.fetchIcon('ing', secondIngName.value))
// 선택한 포켓몬의 세번째 식재료 이미지
const thirdIng = ref(myDownloadStore.fetchIcon('ing', thirdIngName.value))
// 고정- 선택한 포켓몬의 첫번째 식재료 이름만
const fixedFirstIngName = ref(myHealerInputStore.fixedFirstIng)
// 고정- 선택한 포켓몬의 두번째 식재료 이름만
const fixedSecondIngName = ref(myHealerInputStore.fixedSecondIng)
// 고정- 선택한 포켓몬의 세번째 식재료 이름만
const fixedThirdIngName = ref(myHealerInputStore.fixedThirdIng)
// 고정 - 첫번째 식재료 이미지
const fixedFirstIng = ref(myDownloadStore.fetchIcon('ing', fixedFirstIngName.value))
// 고정 - 두번째 식재료 이미지
const fixedSecondIng = ref(myDownloadStore.fetchIcon('ing', fixedSecondIngName.value))
// 고정 - 세번째 식재료 이미지
const fixedThirdIng = ref(myDownloadStore.fetchIcon('ing', fixedThirdIngName.value))
// 레벨별 모든 식재료
const allIngList = ref([])
const nameEmptyMsg = ref('힐러 포켓몬을 선택해주세요')
const wrongUpMsg = ref('상승 성격을 다시 입력해주세요')
const wrongDownMsg = ref('하락 성격을 다시 입력해주세요')

// 가능한 진화 횟수
const leftEvo = ref(myHealerInputStore.leftEvo)
// 굿나잇리본 적용 여부
const useRibbon = ref(myHealerInputStore.useRibbon)
const showRibbon = ref(false)
// 굿나잇리본 팝업 띄우기
function ribbonDialog(){
  showRibbon.value = true
}
// 굿나잇리본 레벨 선택
const ribbonLev = ref(myHealerInputStore.ribbonLev)
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
// 굿나잇리본 선택 사항 업데이트
function updateRibbon(){
  if(ribbonLev.value == "0"){
    useRibbon.value = false
  }
  else{
    useRibbon.value = true
  }
}

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
  return `서브 스킬 (${watchLevel.value}개 선택)`
})
// 포켓몬 선택시 식재료 목록 불러오기
function chooseIng(location, ingNum){
  let chosenIcon;
  let chosenIconName;
  switch(ingNum){
    case 1:
      chosenIcon = fixedFirstIng.value;
      chosenIconName = fixedFirstIngName.value;
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
  await myPkmDBStore.fetchPkmData(pkmName.value)
  // 고정 식재료 이름 저장
  fixedFirstIngName.value = myPkmDBStore.bringIng(pkmName.value, 1)
  fixedSecondIngName.value = myPkmDBStore.bringIng(pkmName.value, 2)
  fixedThirdIngName.value = myPkmDBStore.bringIng(pkmName.value, 3)
  // 고정 식재료 이미지 저장
  fixedFirstIng.value = myDownloadStore.fetchIcon('ing', fixedFirstIngName.value)
  fixedSecondIng.value = myDownloadStore.fetchIcon('ing', fixedSecondIngName.value)
  fixedThirdIng.value = myDownloadStore.fetchIcon('ing', fixedThirdIngName.value)
  // 선택 식재료 이미지 저장
  firstIng.value = fixedFirstIng.value
  secondIng.value = fixedSecondIng.value
  thirdIng.value = fixedThirdIng.value
  // 선택 식재료 이름 저장
  firstIngName.value = fixedFirstIngName.value
  secondIngName.value = fixedSecondIngName.value
  thirdIngName.value = fixedThirdIngName.value
  // 연달아 2번 동일한 포켓몬 불러오면 로딩 화면 종료
  const originDex = selectedHealerDex.value
  selectedHealerDex.value = myPkmDBStore.findDexNum(pkmName.value)
  if(originDex === selectedHealerDex.value){ stopLoading() }
  // 불러온 포켓몬의 모든 정보
  const allData = myPkmDBStore.searchPkmData('kor_name', pkmName.value)
  allIngList.value = []  
  allIngList.value.push(allData["ingredient0"])
  allIngList.value.push(allData["ingredient30"])
  allIngList.value.push(allData["ingredient60"])
  for (let z = 0; z < 3; z++){
    allIngList.value[z].forEach(ele => {
      ele['url'] = myDownloadStore.fetchIcon('ing', ele.name)
    })
  }

  selectHealerImage.value = myDownloadStore.fetchImage('pkm', selectedHealerDex.value)
  maxSkillLevel.value = allData.main_skills.max_level
  // test
  stopLoading();
}
function addLevel(){
  pkmLevel.value += 1
}
function subtractLevel(){
  pkmLevel.value -= 1
}
function searchName(val, update, abort) {
  update(() => {
    pkmNameList.value = myPkmDBStore.korPkmName.filter(v => v.indexOf(val) > -1)
  })
}
function manageModel(val){
  if(val.length > 0 && val !== myHealerInputStore.pkmName){
    pkmName.value = ''
  }
}

defineExpose({
  calcVer,
  pkmName,
  upNature,
  downNature
})

</script>
