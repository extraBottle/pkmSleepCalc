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
        title="Create an ad"
        icon="favorite"
        :done="step > 2"
      >
      <ChooseHealerComponent ref="validateThird" :name-valid="sendNameHealer" :down-valid="sendDownHealer" :up-valid="sendUpHealer"/>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation class="row justify-end">
          <q-btn v-if="step > 1" flat color="primary" @click="prev()" label="뒤로" class="q-ml-sm" />
          <q-btn @click="gogo()" color="primary" :label="step === 2 ? '결과보기' : '다음'" />
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import ChoosePkmComponent from 'src/components/ChoosePkmComponent.vue'
import ChooseHealerComponent from'src/components/ChooseHealerComponent.vue'
import { usePkmDBStore } from 'src/stores/pkmDBStore';
import { popupFail } from 'src/utils/popup'
import AdsenseComponent from 'src/components/AdsenseComponent.vue';

defineOptions({
  name: 'ProdCalcPage'
});

const $q = useQuasar()
const router = useRouter()
// for q-stepper
const step = ref(1)
const stepper = ref()
//첫번째 페이지 검사
const validateFirst = ref()
const sendName = ref(false)
const sendDown = ref(false)
const sendUp = ref(false)
const sendSub = ref(false)
//세번째 페이지 검사
const validateThird = ref()
const sendNameHealer = ref(false)
const sendDownHealer = ref(false)
const sendUpHealer = ref(false)

const myPkmDBStore = usePkmDBStore()

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
        }
        else{ sendDown.value = false; sendUp.value = false }
      }
      if(!sendName.value && !sendDown.value && !sendUp.value){
        stepper.value.next()
      }
      break;
    case 2:
      if(validateThird.value.calcVer === "proVer"){
        const upup = validateThird.value.upNature
        const downdown = validateThird.value.downNature
        if(!myPkmDBStore.searchPkmData('kor_name', validateThird.value.pkmName).skill.includes("Energy For Everyone") &&
          !myPkmDBStore.searchPkmData('kor_name', validateThird.value.pkmName).skill.includes("Energizing Cheer")){
          // 힐러 포켓몬 선택했는지          
          sendNameHealer.value = true
        } 
        else{ sendNameHealer.value = false }
        if(upup.substring(0, 3) === downdown.substring(0, 3)){
          // 상승 하락 성격은 같을 수 없다
          if(upup !== "영향 없음 --"){
            sendDownHealer.value = true
            sendUpHealer.value = true
          }else{ sendDownHealer.value = false; sendUpHealer.value = false }
        }
        else{
          // 영향없음은 상승하락 동일해야 한다
          if(upup === "영향 없음 --" || downdown === "영향 없음 --" || upup.length == 0 || downdown.length == 0){
            sendDownHealer.value = true
            sendUpHealer.value = true
          }else{ sendDownHealer.value = false; sendUpHealer.value = false }
        }
        if(!sendNameHealer.value && !sendDownHealer.value && !sendUpHealer.value){
          router.push('/prodcalc/result')            
        }        
      }else{
        // 라이트 버전은 걍 통과        
        router.push('/prodcalc/result')          
      }
      break;
      default:
        stepper.value.next()
  }
}

</script>
