<template>
<div class="row justify-center bg-googleDark">
<div class="col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 bg-googleBack">
<div class="column items-center q-px-md q-gutter-y-md">
    <q-space />
    <q-toolbar class="bg-primary text-white text-center">
        <q-toolbar-title>현재 레벨 {{ maxLevel }}까지만 계산 가능!</q-toolbar-title>
    </q-toolbar>
    <q-card class="column items-center" style="background-color: #f0fed2; border: solid #b46856; width: 300px;">
        <q-card-section class="full-width q-pt-sm">
            <div class="text-subtitle1 text-bold">사탕 부스트:</div>
        </q-card-section>        
        <q-card-section class="q-pt-none full-width row justify-center">            
            <div class="full-width row justify-around items-center">
                <q-toggle size="lg" color="accent" v-model="boost" />
                <div>
                    <q-avatar><img src="images/handycandym.png"></q-avatar>
                    <span>X <span class="text-bold">{{ candyRate }}</span></span>
                </div>
                <div>
                    <q-avatar size="35px"><img src="images/dreamshard.png"></q-avatar>
                    <span>X <span class="text-bold">{{ shardRate }}</span></span>
                </div>                
            </div>
            <q-select class="col-12" label="부스트 종류" outlined v-model="whatBoost" :options="boostList" :disable="!boost" />
        </q-card-section>
    </q-card>
    <q-card class="column items-center" style="background-color: #faebd7; border: solid #b46856; width: 300px;">
        <q-card-section class="full-width q-pt-sm">
            <div class="text-subtitle1 text-bold">계산기 버전:</div>
        </q-card-section>        
        <q-card-section>            
            <q-radio color="accent" v-model="calcVer" val="light" label="라이트" />
            <q-radio color="accent" v-model="calcVer" val="pro" label="프로" />                        
        </q-card-section>
    </q-card>
    <q-card class="column items-center full-width" style="background-color: #ffe4c4; border: solid #b46856;">
        <q-card-section class="full-width q-pt-sm">
            <div class="text-subtitle1 text-bold">여기에 입력하세요:</div>
        </q-card-section>        
        <q-card-section class="q-gutter-y-md" style="min-width: 300px;">  
            <div v-if="boost" class="full-width row justify-center text-accent">@@현재 사탕 부스트 적용중!@@</div>          
            <q-select v-if="calcVer === 'pro'" outlined v-model="species" :options="specList" hint="종류에 따라 필요 경험치량 다름" dense>
                <template v-slot:before>
                    <span class="text-bold text-subtitle1 text-dark">포켓몬 종류:</span>
                </template></q-select>
            <q-select v-if="calcVer === 'pro'" outlined v-model="nature" :options="natList" hint="경험치사탕의 효율 20% 증감" dense>
                <template v-slot:before>
                    <span class="text-bold text-subtitle1 text-dark">포켓몬 성격:</span>
                </template></q-select>
            <q-input ref="currentL" outlined type="number" v-model.number="startLev" :hint="levelRange('현재')" :rules="levRule" dense>
                <template v-slot:before>
                    <span class="text-bold text-subtitle1 text-dark">현재 레벨:</span>
                </template>
            </q-input>
            <q-input v-if="calcVer === 'pro'" outlined type="number" v-model.number="leftExp" hint="현재 레벨에서 다음 레벨까지" 
            :error="leftExpRule" :error-message="leftExpMsg" dense>
                <template v-slot:before>
                    <span class="text-bold text-subtitle1 text-dark">남은 경험치:</span>
                </template></q-input>
            <q-input ref="targetL" outlined type="number" v-model.number="endLev" :hint="levelRange('목표')" 
            :rules="levRule" :error="levSmall" :error-message="levSmallMsg" dense>
                <template v-slot:before>
                    <span class="text-bold text-subtitle1 text-dark">목표 레벨:</span>
                </template></q-input>                                    
        </q-card-section>
    </q-card>
    <div class="row justify-end full-width q-mb-md">
        <q-btn color="primary" @click="calcExp" label="필요 경험치량 계산하기"></q-btn>
    </div>
    <q-dialog v-model="showResult">
        <q-card style="background-color: #d8bfd8; border: solid #b46856;">
          <q-bar>          
            <div>계산 결과</div>
            <q-space />          
            <q-btn dense flat icon="close" v-close-popup />                 
          </q-bar>
          <q-card-section>
            <div class="full-width column flex-center">
                <div class="text-subtitle1 text-bold">목표 레벨까지 필요한</div>
                <q-input v-model="resultExp" label="경험치량" readonly>
                    <template v-slot:prepend>
                    <q-avatar><img src="images/growthincense.png" /></q-avatar>
                    </template>
                </q-input>
                <q-input v-model="resultCandy" label="사탕 개수" readonly>
                    <template v-slot:prepend>
                    <q-avatar><img src="images/handycandym.png" /></q-avatar>
                    </template>
                </q-input>
                <q-input v-model="resultShard" label="꿈의 조각 개수" readonly>
                    <template v-slot:prepend>
                    <q-avatar size="25px"><img src="images/dreamshard.png" /></q-avatar>
                    </template>
                </q-input>
                <div v-if="boost" class="text-accent">@@사탕 부스트 적용@@</div>
            </div>
          </q-card-section>   
        </q-card>
    </q-dialog>
</div>
</div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue';

//레벨 당 경험치량
const expPerLevel= [54, 71, 108, 128, 164, 202, 244, 274,
315, 345,  376, 407, 419, 429, 440, 454, 469, 483, 497, 515,
537, 558, 579, 600, 622, 643, 665, 686, 708, 729, 748, 766, 785,
803, 821, 839, 857, 875, 893, 910, 928, 945, 963, 980, 997, 1015,
1032, 1049, 1066, 1362, 1562, 1747, 1946, 2195];
//특정 레벨에서 사탕 하나 당 필요한 꿈의 조각 개수
const shardPerLevel= [14, 18, 22, 27, 30, 34, 39, 44, 48, 50, 52, 53,
56, 59, 62, 66, 68, 71, 74, 78, 81, 85, 88, 92, 95, 100, 105, 111,
117, 122, 126, 130, 136, 143, 151, 160, 167, 174, 184, 192, 201,
211, 221, 227, 236, 250, 264, 279, 295, 309, 323, 338, 356, 372, 391];
// 현재 최고 레벨
const maxLevel = 55;
// 포켓몬 종류에 따른 exp 배율
const pkmSpeciesObj = {
    "일반": 1.0,
    "600족(1.5배)": 1.5,
    "전설(1.8배)": 1.8
};
let candy= 25

// input
const calcVer = ref('light')
const boost = ref(false)
const whatBoost = ref("미니 부스트")
const boostList = ["미니 부스트", "일반 부스트"]
const species = ref("일반")
const specList = ["일반", "600족(1.5배)",  "전설(1.8배)"]
const nature = ref('영향 없음 --')
const natList = ["EXP 획득량 ▲▲", '영향 없음 --', 'EXP 획득량 ▽▽']
const startLev = ref(1)
const leftExp = ref(54)
const endLev = ref(55)
const showResult = ref(false)
const boostRate = {
    "미니 부스트": [2, 4],
    "일반 부스트": [2, 6]
}
const candyRate = computed(()=>{ 
    return boost.value ? boostRate[whatBoost.value][0] : 1
 })
 const shardRate = computed(()=>{ 
    return boost.value ? boostRate[whatBoost.value][1] : 1 
 })
 const resultCandy = ref(1)
 const resultExp = ref(1)
 const resultShard = ref(1)
 const levRule = [
    val => val > 0 && val <= maxLevel || `1이상 ${maxLevel}이하로 입력해주세요`
 ]
 const leftExpRule = ref(false)
 const leftExpMsg = ref("")
 const levSmall = ref(false)
 const levSmallMsg = "목표 레벨은 현재 레벨보다 커야 합니다"
 const currentL = ref()
 const targetL = ref()

function levelRange(l){
    let limit = l === '현재' ? 0 : 1
    return `${1 + limit}부터 ${maxLevel - 1 + limit}사이 숫자를 입력하세요` 
}
function calcExp(){
    if(startLev.value >= endLev.value){
        levSmall.value = true
    }
    else if(Math.round(expPerLevel[startLev.value - 1] * pkmSpeciesObj[species.value]) < leftExp.value && calcVer.value === 'pro'){
        leftExpRule.value = true
        leftExpMsg.value = `남은 경험치는 ${Math.round(expPerLevel[startLev.value - 1] * pkmSpeciesObj[species.value])}이하로 입력해주세요`
    }
    else if(currentL.value.validate && targetL.value.validate){
        currentL.value.resetValidation
        targetL.value.resetValidation
        leftExpRule.value = false
        levSmall.value = false
        if(calcVer.value === 'light'){
            // 라이트 버전에선 프로 설정을 전부 기본값으로 변경한다
            species.value = "일반"
            nature.value = '영향 없음 --'
            leftExp.value = expPerLevel[startLev.value - 1]
        }
        candy = 25
        if(nature.value === "EXP 획득량 ▲▲"){
            candy *= 1.2
        }
        else if(nature.value === "EXP 획득량 ▽▽"){
            candy = 21
        }
        if(boost.value){ candy *= boostRate[whatBoost.value][0] }
        //현재 레벨에서 목표레벨까지 필요한 경험치량
        let totalExpRequired= leftExp.value;
        //사탕으로 렙업할 때 렙업하고도 초과하는 경험치량
        let leftoverCandyExp= candy - leftExp.value % candy;
        if(leftExp.value % candy === 0){
            leftoverCandyExp= 0;
        };
        //현재 레벨에서 목표레벨까지 필요한 꿈의 조각 개수
        let totalShardsRequired= Math.ceil(leftExp.value / candy) * shardPerLevel[startLev.value - 1];        

        for(let z= 0; z < (endLev.value - startLev.value - 1); z++){
            let addExp = Math.round(expPerLevel[z + startLev.value] * pkmSpeciesObj[species.value]);
            totalExpRequired += addExp;
            totalShardsRequired += Math.ceil((addExp - leftoverCandyExp) / candy) * shardPerLevel[z + startLev.value];
            if((addExp - leftoverCandyExp) % candy === 0){
                leftoverCandyExp= 0;
            }else{
                leftoverCandyExp= candy - (addExp - leftoverCandyExp) % candy;
            };
        };
        //현재 레벨에서 목표레벨까지 필요한 사탕 개수
        let totalCandyRequired= Math.ceil(totalExpRequired / candy);        
        if(boost.value){
            totalShardsRequired *= boostRate[whatBoost.value][1]
        };
        resultExp.value = totalExpRequired
        resultCandy.value = totalCandyRequired
        resultShard.value = totalShardsRequired
        showResult.value = true
    }
}
</script>