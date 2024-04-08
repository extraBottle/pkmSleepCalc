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
        <q-item-label>프로</q-item-label>
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
        <q-slider color="secondary" v-model="mainSkillLevel" :min="1" :max="6"/>
      </div>
      <div class="column items-center" style="visibility: hidden; height: 5vh;">
        <q-img
          alt="Healer image"
          src="images/sylveonStanding.png"
          fit="scale-down"
          no-spinner
          style="max-width: 300px;" />
      </div>
    </div>
    <div v-else-if="calcVer == 'proVer'" class="column items-center q-gutter-y-md">
      <q-img
        alt="Healer image"
        :src="selectHealerImage"
        style="max-width: 300px"
        fit="scale-down"
        no-spinner
        @load="fetchingApi = false" />
    <q-select class="full-width q-mt-none" filled color="secondary" v-model="pkmName"
    :options="pkmNameList" label="포켓몬 이름"
    :error="props.nameValid" :error-message="nameEmptyMsg"
    hint="입력하고 엔터를 눌러서 검색" @filter="searchName" 
    use-input hide-selected fill-input input-debounce="0" hide-bottom-space/>
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
    <q-select class="full-width" filled color="secondary" v-model="upNature" :options="myPkmDBStore.upNatureList" label="상승 성격" behavior="dialog" :error="props.upValid" :error-message="wrongUpMsg" hide-bottom-space></q-select>
    <q-select class="full-width" filled color="secondary" v-model="downNature" :options="myPkmDBStore.downNatureList" label="하락 성격" behavior="dialog" :error="props.downValid" :error-message="wrongDownMsg" hide-bottom-space></q-select>
    <span style="display: none;">{{ mysteryVar }}</span>
    <q-spinner-hourglass
      v-if="fetchingApi"
      color="primary"
      size="4em"
      class="absolute-center"
    />
    </div>
    <div v-else>
      <div class="column items-center" style="visibility: hidden; height: 5vh;">
        <q-img
          alt="Hidden image"
          src="images/sylveonStanding.png"
          fit="scale-down"
          no-spinner
          style="max-width: 300px;" />
      </div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed } from 'vue'
import { useDownloadStore } from 'src/stores/downloadStore';
import { usePkmDBStore } from 'src/stores/pkmDBStore';
import { useHealerInputStore } from 'src/stores/inputStore';

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
  myHealerInputStore.storeEverything(calcVer.value, healSkillCount.value,
    pkmName.value, pkmLevel.value, evoCount.value, subSkills.value, firstIngName.value, secondIngName.value, thirdIngName.value,
    fixedSecondIngName.value, fixedThirdIngName.value, upNature.value, downNature.value,
    selectedHealerDex.value, mainSkillLevel.value,)
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
const mainSkillLevel = ref(myHealerInputStore.mainSkillLevel)
// 이름
const pkmName = ref(myHealerInputStore.pkmName)
const evoCount = ref(myHealerInputStore.evoCount)
// 강제로 힐러 포켓몬 정보 저장
myPkmDBStore.fetchPkmData(myPkmDBStore.convertKorEn(pkmName.value))
// 선택한 힐러 도감번호
const selectedHealerDex = ref(myHealerInputStore.selectedHealerDex)
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
// 선택한 포켓몬의 첫번째 식재료
const firstIng = ref(myDownloadStore.fetchIcon('ing', firstIngName.value.replace(/\s/g, "").toLowerCase()))
// 선택한 포켓몬의 두번째 식재료
const secondIng = ref(myDownloadStore.fetchIcon('ing', secondIngName.value.replace(/\s/g, "").toLowerCase()))
// 선택한 포켓몬의 세번째 식재료
const thirdIng = ref(myDownloadStore.fetchIcon('ing', thirdIngName.value.replace(/\s/g, "").toLowerCase()))
// 선택한 포켓몬의 두번째 식재료 이름만
const fixedSecondIngName = ref(myHealerInputStore.fixedSecondIng)
// 선택한 포켓몬의 세번째 식재료 이름만
const fixedThirdIngName = ref(myHealerInputStore.fixedThirdIng)
// 두번째 식재료
const fixedSecondIng = ref(myDownloadStore.fetchIcon('ing', fixedSecondIngName.value.replace(/\s/g, "").toLowerCase()))
// 세번째 식재료
const fixedThirdIng = ref(myDownloadStore.fetchIcon('ing', fixedThirdIngName.value.replace(/\s/g, "").toLowerCase()))
// api 불러올때 로딩중 아이콘
const fetchingApi = ref(false)
const nameEmptyMsg = ref('힐러 포켓몬을 선택해주세요')
const wrongUpMsg = ref('상승 성격을 다시 입력해주세요')
const wrongDownMsg = ref('하락 성격을 다시 입력해주세요')
// 선택한 포켓몬의 최대 메인 스킬 레벨
const maxSkillLevel = ref(6)

// 포켓몬을 선택하면 데이터 불러오기 + 식재료 목록 출력 + 이미지 불러오기
const mysteryVar = computed(() => {
  return pkmName.value.length > 0 ? fetchApiIng() : 0
})
async function fetchApiIng(){
  fetchingApi.value = true
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
  selectedHealerDex.value = myPkmDBStore.findDexNum(pkmName.value)
  selectHealerImage.value = myDownloadStore.fetchImage('pkm', selectedHealerDex.value)
  maxSkillLevel.value = myPkmDBStore.searchPkmData('name', myPkmDBStore.convertKorEn(pkmName.value)).skill.maxLevel
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
defineExpose({
  calcVer,
  pkmName,
  upNature,
  downNature
})

</script>
