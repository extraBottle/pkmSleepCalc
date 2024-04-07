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
                        <q-btn v-if="step < 3" @click="stepper.next()" color="primary" label='다음' />
                    </div>
                </q-stepper-navigation>
            </template>
        </q-stepper>
        <q-inner-loading :showing="myProdCalcStore.calcLoading" >
            <q-spinner-hourglass size="3em"/>
            계산 중...
        </q-inner-loading>
    </q-page>
</template>
  
<script setup>
import { ref, onBeforeMount } from 'vue'
import ResultProdComponent from 'src/components/ResultProdComponent.vue'
import ResultEnergyComponent from 'src/components/ResultEnergyComponent.vue'
import { useProdCalcStore } from 'src/stores/finalCalcStore'
import { useInputStore } from 'src/stores/inputStore'
import { useRouter } from 'vue-router'
import { popupFail } from 'src/utils/popup'

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

// for q-stepper
const step = ref(1)
const stepper = ref()

// watch(myProdCalcStore.finalSpeedCount, (newCount) => {
//     if(newCount > 0){
//         startCalc.value = false
//     }
// })

function redo(){
    router.push('/prodcalc')
    myProdCalcStore.clearCalc()
}
</script>
  