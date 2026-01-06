<template>
  <q-page class="row justify-center bg-googleDark">
    <q-stepper
      v-model="step"
      ref="stepper"
      contracted
      color="primary"
      active-icon="none"
      class="col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-6 bg-googleBack"
      animated
    >
      <q-step
        :name="1"
        title="포켓몬 정보 입력"
        icon="edit"
        :done="step > 1"
      >
      <!-- Google adsense -->
      <AdsenseComponent v-if="$q.platform.is.mobile" class="full-width q-py-sm"
        style="min-height: 50px;"
        ad-style="display:block; width:100%;height:250px;"
        ad-slot="4218885917" 
      />  
      <ChoosePkmComponent ref="validateFirst" :name-valid="sendName" :sub-valid="sendSub" :down-valid="sendDown" :up-valid="sendUp" />
      </q-step>

      <q-step
        :name="2"
        title="항목별 결과"
        icon="assignment" 
      >
      <RateResultFirstComponent :start-load="handleStartLoad"/>
      </q-step>

      <q-step
        :name="3"
        title="최종 평가"
        icon="emoji_events"
      >
      <!-- Google adsense -->
      <AdsenseComponent v-if="$q.platform.is.mobile" class="full-width q-py-sm"
        style="min-height: 50px;"
        ad-style="display:block; width:100%;height:250px;"
        ad-slot="4218885917" 
        :delay="400"
      />  
      <RateResultSecondComponent/>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation class="row justify-end">
          <q-btn v-if="step > 1" flat color="primary" @click="prev()" label="뒤로" class="q-ml-sm" />
          <q-btn v-if="step === 1" @click="gogo()" color="primary" label="평가하기"/>
          <q-btn v-else-if="step === 2 && myRateCalcStore.whatSpeciality !== 'all'" @click="gogo()" color="primary" label="다음"/>
          <q-btn v-else @click="step = 1" color="primary" label="다시하기" icon="refresh" />
        </q-stepper-navigation>        
      </template>      
    </q-stepper>
    <!-- vertical ad -->    
    <AdsenseComponent v-if="$q.platform.is.desktop" class="gt-sm q-ml-md"   
      style="position: sticky; top: 60px;"   
      ad-style="display:inline-block;width:300px; height:600px; position: sticky; top: 60px;"
      ad-slot="9801335336" 
    />        
  </q-page>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import ChoosePkmComponent from 'src/components/ChoosePkmComponent.vue';
import RateResultFirstComponent from 'src/components/RateResultFirstComponent.vue'
import RateResultSecondComponent from 'src/components/RateResultSecondComponent.vue'
import { popupFail } from 'src/utils/popup';
import { useRateCalcStore } from 'src/stores/rateCalcStore'
import { useProdCalcStore } from 'src/stores/finalCalcStore'
import { loadingCalc } from 'src/utils/loading';
import AdsenseComponent from 'src/components/AdsenseComponent.vue';

defineOptions({
  name: 'RatePage'
});
onBeforeUnmount(()=>{
    myProdCalcStore.clearCalc()
})

const $q = useQuasar()
const myProdCalcStore = useProdCalcStore()
const myRateCalcStore = useRateCalcStore()
// 이거 플래그가 켜지면 계산 시작
const handleStartLoad = ref(false)

// for q-stepper
const step = ref(1)
const stepper = ref()
//첫번째 페이지 검사
const validateFirst = ref()
const sendName = ref(false)
const sendDown = ref(false)
const sendUp = ref(false)
const sendSub = ref(false)

// 뒤로
function prev(){
  stepper.value.previous()
}
// 다음
function gogo(){
  switch(step.value){
    case 1:
      const upup = validateFirst.value.upNature
      const downdown = validateFirst.value.downNature
      if(validateFirst.value.pkmName.length === 0){
        // 포켓몬 선택했는지
        sendName.value = true
        popupFail('포켓몬 이름을 입력해주세요')
      }
      else{ sendName.value = false }
      // 서브 스킬 전부 선택했는지
      sendSub.value = validateFirst.value.didSelectAllSub ? false : true
      if(upup.substring(0, 3) === downdown.substring(0, 3)){
        // 상승 하락 성격은 같을 수 없다
        if(upup !== "영향 없음 --"){
          sendDown.value = true
          sendUp.value = true
        }else{ sendDown.value = false; sendUp.value = false }
      }
      else{
        // 영향없음은 상승하락 동일해야 한다
        if(upup === "영향 없음 --" || downdown === "영향 없음 --" || upup.length == 0 || downdown.length == 0){
          sendDown.value = true
          sendUp.value = true
        }else{ sendDown.value = false; sendUp.value = false }
      }
      if(!sendName.value && !sendDown.value && !sendUp.value && !sendSub.value){        
        handleStartLoad.value = true   
        loadingCalc('계산 중...')
        stepper.value.next()
        myProdCalcStore.calcLoading = true
      }
      break;
    default:
      handleStartLoad.value = false
      stepper.value.next()
  }
}

</script>
