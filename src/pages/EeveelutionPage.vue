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
        title="이브이 정보 입력"
        icon="edit"
        :done="step > 1"
      >
      <!-- Google adsense -->
      <AdsenseComponent v-if="$q.platform.is.mobile" class="full-width q-py-sm"
        style="min-height: 50px;"
        ad-style="display:block; width:100%;height:250px;"
        ad-slot="4218885917" 
      />  
      <ChoosePkmComponent ref="validateFirst" :sub-valid="sendSub" :down-valid="sendDown" :up-valid="sendUp" />
      </q-step>
      <q-step
        :name="2"
        title="이브이 진화 추천"
        icon="favorite"
        :done="step > 2"
      >
        <EeveelutionResultComponent />
      </q-step>
      <q-step
        :name="3"
        title="둘러보기"
        icon="search"
        :done="step > 3"        
      >
        <RecommendCalcComponent />
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation v-if="step < 3" class="row justify-end">                              
            <q-btn v-if="step > 1" flat color="primary" @click="prev()" label="뒤로" class="q-ml-sm" />
            <q-btn v-if="step < 3" @click="gogo()" color="primary" :label="step === 1 ? '결과보기' : '다음'" />            
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <!-- vertical ad -->
    <AdsenseComponent v-if="$q.platform.is.desktop" class="gt-sm q-ml-md"         
      ad-style="display:inline-block;width:300px; height:600px; position: sticky; top: 60px;"
      ad-slot="9801335336" 
    />      
</q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import ChoosePkmComponent from 'src/components/ChoosePkmComponent.vue';
import EeveelutionResultComponent from 'src/components/EeveelutionResultComponent.vue';
import RecommendCalcComponent from 'src/components/RecommendCalcComponent.vue';
import AdsenseComponent from 'src/components/AdsenseComponent.vue';

defineOptions({
  name: 'RatePage'
});
const $q = useQuasar()
// for q-stepper
const step = ref(1)
const stepper = ref()
//첫번째 페이지 검사
const validateFirst = ref()
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
      if(!sendDown.value && !sendUp.value && !sendSub.value){                
        stepper.value.next()
      }
      break;
    default:      
      stepper.value.next()
  }
}
</script>