<template>
  <q-toolbar class="bg-primary text-white text-center">
    <q-toolbar-title>포켓몬 정보 입력</q-toolbar-title>
  </q-toolbar>
  <div class="column items-center q-gutter-y-md">
    <q-img
        alt="Pokemon image"
        :src="selectPkmImage"
        fit="scale-down"
        style="max-width: 300px;"
        >
      <!-- <template v-slot:loading>
        <q-spinner-hourglass
          color="primary"/>
      </template> -->
    </q-img>
    <q-select class="full-width q-mt-none" filled color="secondary" v-model="pkmName" :options="pkmNameList" label="포켓몬 이름"
    :error="props.nameValid" :error-message="nameEmptyMsg" @filter="searchName"
    use-input hide-selected fill-input input-debounce="0" 
    hint="입력하고 엔터를 눌러서 검색" hide-bottom-space />
    <div class="text-center">
      직접 진화시킨 횟수: {{ evoCount }} 회
      <q-slider color="secondary" v-model="evoCount" :min="0" :max="2"/>
    </div>
    <div class="text-center full-width">
      <q-btn color="secondary" round size="xs" icon="remove" @click="subtractLevel"></q-btn>
      <span class="q-px-md">레벨: {{ pkmLevel }}</span>
      <q-btn color="secondary" round size="xs" icon="add" @click="addLevel"></q-btn>
      <q-slider color="secondary" v-model="pkmLevel" :min="1" :max="100"/>
    </div>
    <div class="row justify-center q-gutter-x-md">
      <q-fab color="ingCircle" :icon="firstIng" direction="up">
        <q-fab-action color="ingCircle" :icon="firstIng" />
      </q-fab>
      <div>
        <q-tooltip>
          레벨 30
        </q-tooltip>
        <q-fab v-if="pkmLevel < 30" color="ingCircle" icon="lock" text-color="teal" :disable= true direction="up" />
        <q-fab v-else color="ingCircle" :icon="secondIng" :disable="pkmLevel < 30" direction="up">
          <q-fab-action color="ingCircle" @click="chooseIng(2, 1)" :icon="firstIng" />
          <q-fab-action color="ingCircle" @click="chooseIng(2, 2)" :icon="fixedSecondIng" />
        </q-fab>
      </div>
      <div>
        <q-tooltip>
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
    <div class="full-width text-center">
      메인 스킬 레벨: {{ mainSkillLevel }}
      <q-slider color="secondary" v-model="mainSkillLevel" :min="1" :max="maxSkillLevel"/>
    </div>
    <div class="text-center full-width">
      <q-chip square class="bg-goldSkill">도우미 보너스</q-chip> 개수: {{ hbCount }}
      <q-slider color="secondary" v-model="hbCount" :min="0" :max="5"/>
    </div>
    <div class="text-center full-width">
      <q-chip square class="bg-goldSkill">기력 회복 보너스</q-chip> 개수: {{ erbCount }}
      <q-slider color="secondary" v-model="erbCount" :min="0" :max="5"/>
    </div>
    <q-select class="full-width" filled color="secondary" multiple v-model="subSkills" :options="myPkmDBStore.subSkillList" label="서브 스킬 (최대 6개)" behavior="dialog" max-values="6">
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
    <q-select class="full-width" filled color="secondary" v-model="upNature" :options="myPkmDBStore.upNatureList" label="상승 성격" behavior="dialog" :error="props.upValid" :error-message="wrongUpMsg" hide-bottom-space />
    <q-select class="full-width" filled color="secondary" v-model="downNature" :options="myPkmDBStore.downNatureList" label="하락 성격" behavior="dialog" :error="props.downValid" :error-message="wrongDownMsg" hide-bottom-space />
    <q-card class="bg-sSkill">
      <q-card-section>
        <q-checkbox v-model="useGoodCamp">
          <template v-slot:default>
            좋은 캠프 적용
            <q-icon size="xl" name="img:images/goodcampticket.png" />
          </template>
        </q-checkbox>
      </q-card-section>
    </q-card>
  </div>
    <span style="display: none;">{{ mysteryVar }}</span>
</template>

<script setup>
import { ref, onBeforeUnmount, computed } from 'vue'
import { usePkmDBStore } from 'src/stores/pkmDBStore';
import { useDownloadStore } from 'src/stores/downloadStore'
import { useInputStore } from 'src/stores/inputStore'

defineOptions({
  name: 'ChoosePkmComponent'
})
const myPkmDBStore = usePkmDBStore()
myPkmDBStore.loadKorPkmName()
  
// 선택 가능한 포켓몬 목록
const pkmNameList = ref(myPkmDBStore.korPkmName)
// 넘어갈때 저장
onBeforeUnmount(() => {
  // store에 저장
  myInputStore.storeEverything(hbCount.value, erbCount.value, 
    pkmName.value, pkmLevel.value, evoCount.value, subSkills.value, firstIngName.value,
    secondIngName.value, thirdIngName.value, fixedSecondIngName.value, fixedThirdIngName.value, upNature.value, downNature.value,
    selectedPkmDex.value, mainSkillLevel.value, useGoodCamp.value)
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

const myDownloadStore = useDownloadStore()
const myInputStore = useInputStore()

// 사용자 입력 포켓몬 이름
const pkmName = ref(myInputStore.pkmName)
// 사용자 입력 포켓몬 레벨
const pkmLevel = ref(myInputStore.pkmLevel)
// 직접 진화시킨 횟수
const evoCount = ref(myInputStore.evoCount)
// 사용자 선택 보유중인 서브 스킬들
const subSkills = ref(myInputStore.subSkills)
// 사용자 입력 총 도우미 보너스 개수
const hbCount = ref(myInputStore.hbCount)
// 사용자 입력 총 기력 회복 보너스 개수
const erbCount = ref(myInputStore.erbCount)
// 선택한 포켓몬의 첫번째 식재료
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
// 두번째 식재료
const fixedSecondIng = ref(secondIng.value)
// 세번째 식재료
const fixedThirdIng = ref(thirdIng.value)
// 선택한 상승 성격
const upNature = ref(myInputStore.upNature)
// 선택한 하락 성격
const downNature = ref(myInputStore.downNature)
// 선택한 포켓몬 도감번호
const selectedPkmDex = ref(myInputStore.selectedPkmDex)
// 선택한 포켓몬 이미지
const selectPkmImage = ref(myDownloadStore.fetchImage('pkm', selectedPkmDex.value))
// 선택한 포켓몬의 최대 메인 스킬 레벨
const maxSkillLevel = ref(6)
const mainSkillLevel = ref(myInputStore.mainSkillLevel)
// 유효성 검사 이름 & 성격
// 유효성 검사 메시지
const nameEmptyMsg = ref('포켓몬을 선택해주세요')
const wrongUpMsg = ref('상승 성격을 다시 입력해주세요')
const wrongDownMsg = ref('하락 성격을 다시 입력해주세요')

const useGoodCamp = ref(myInputStore.useGoodCamp)

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
const mysteryVar = computed(() => {
  return pkmName.value.length > 0 ? fetchApiIng() : 0
})
async function fetchApiIng(){
  
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
  selectedPkmDex.value = myPkmDBStore.findDexNum(pkmName.value)
  selectPkmImage.value = myDownloadStore.fetchImage('pkm', selectedPkmDex.value)
  maxSkillLevel.value = myPkmDBStore.searchPkmData('name', myPkmDBStore.convertKorEn(pkmName.value)).skill.maxLevel
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

// 부모 컴포넌트에서 입력했는지 확인
defineExpose({
  pkmName,
  upNature,
  downNature
})

</script>
