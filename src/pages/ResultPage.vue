<template>
    <q-page class="row justify-center bg-googleDark relative-position">
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
                title="생산량 보고서"
                icon="assignment"
            >
            <!-- Google adsense -->
            <AdsenseComponent />  
            <q-space />
            <ResultProdComponent :start-load="handleStartLoad" />
            </q-step>
            <q-step
                :name="2"
                title="기력 그래프"
                icon="favorite"
            >
            <ResultEnergyComponent :start-load="handleStartLoad" />
            </q-step>            
            <!-- <q-step
                :name="3"
                title="랭킹 그래프"
                icon="favorite"
            >
            <ResultRankComponent />
            </q-step> -->
            <template v-slot:navigation>
                <q-stepper-navigation class="row justify-between">
                    <q-btn push icon="refresh" color="primary" @click="redo" label="다시하기" text-color="white" />
                    <div>
                        <q-btn v-if="step > 1" flat color="primary" @click="stepper.previous()" label="뒤로" class="q-ml-sm" />
                        <q-btn v-if="step < 2" @click="stepper.next()" color="primary" label='다음' />
                    </div>
                </q-stepper-navigation>
            </template>
        </q-stepper>
    </q-page>
</template>
  
<script setup>
import { ref, onBeforeMount, onBeforeUnmount, watchEffect } from 'vue'
import ResultProdComponent from 'src/components/ResultProdComponent.vue'
import ResultEnergyComponent from 'src/components/ResultEnergyComponent.vue'
import { useProdCalcStore } from 'src/stores/finalCalcStore'
import { useInputStore } from 'src/stores/inputStore'
import { useRouter } from 'vue-router'
import { popupFail } from 'src/utils/popup'
import { loadingCalc, stopLoading } from 'src/utils/loading'
import { useQuasar } from 'quasar'
import AdsenseComponent from 'src/components/AdsenseComponent.vue'

defineOptions({
    name: 'ResultPage'
});

// const startCalc = ref(true)
const myInputStore = useInputStore()
const myProdCalcStore = useProdCalcStore()
const router = useRouter()
const $q = useQuasar()
// 이거 플래그가 켜지면 계산 시작
const handleStartLoad = ref(false)
onBeforeMount(()=>{
    if(!myInputStore.hasEssential()){
        useRouter().push('/prodcalc')
        popupFail('포켓몬 정보를 입력해주세요')
    }
})
onBeforeUnmount(()=>{
    myProdCalcStore.clearCalc()
})
watchEffect(()=>{
    if(myInputStore.hasEssential()){
        if(myProdCalcStore.calcLoading){
            // loading screen 등장
            loadingCalc('계산 중...')            
            const speedTimer = $q.platform.is.mobile ? 100 : 30
            setTimeout(()=>{
                handleStartLoad.value = true   
            }, speedTimer)   
        }
        else{
            // 계산 완료시 로딩 종료
            handleStartLoad.value = false
            stopLoading()
        }
    }
})

// for q-stepper
const step = ref(1)
const stepper = ref()

function redo(){
    myProdCalcStore.clearCalc()
    router.push('/prodcalc')
}
</script>
  