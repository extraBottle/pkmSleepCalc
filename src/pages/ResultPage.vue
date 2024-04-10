<template>
    <q-page class="row justify-center bg-googleDark relative-position">
        <q-stepper
            v-model="step"
            ref="stepper"
            contracted
            color="primary"
            active-icon="none"
            class="col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 bg-googleBack"
            animated
        >
            <q-step
                :name="1"
                title="생산량 보고서"
                icon="assignment"
            >
            <ResultProdComponent />
            </q-step>
            <q-step
                :name="2"
                title="기력 그래프"
                icon="favorite"
            >
            <ResultEnergyComponent />
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

defineOptions({
    name: 'ResultPage'
});

// const startCalc = ref(true)
const myInputStore = useInputStore()
const myProdCalcStore = useProdCalcStore()
const router = useRouter()
onBeforeMount(()=>{
    if(!myInputStore.hasEssential()){
        useRouter().push('/prodcalc')
        popupFail('포켓몬 정보를 입력해주세요')
    }
})
onBeforeUnmount(()=>{
    myProdCalcStore.clearCalc()
})
let timerForLoad = null
watchEffect(()=>{
    if(myInputStore.hasEssential()){
        if(!myProdCalcStore.calcLoading){
            // 계산 완료시 로딩 종료
            clearTimeout(timerForLoad)
            stopLoading()
        }
        else{
            // loading screen 등장
            loadingCalc('계산 중...')
            timerForLoad = setTimeout(()=>{
                // 로딩하고 2분 지나도 결과 안나오면 강제종료
                if(myProdCalcStore.calcLoading){
                    stopLoading()
                    router.push('prodCalc')
                    popupFail('오류가 발생했습니다. 잠시 후 다시 시도해주세요')
                }
            }, 120000)
        }
    }
})

// for q-stepper
const step = ref(1)
const stepper = ref()

function redo(){
    router.push('/prodcalc')
    myProdCalcStore.clearCalc()
}
</script>
  