<template>
<q-toolbar class="bg-primary text-white text-center">
    <q-toolbar-title>추천하는 진화는...</q-toolbar-title>
</q-toolbar>
<div class="column items-center q-px-md">
    <div class= "relative-position full-width row justify-center">
        <q-img
        alt="Pokemon image"
        :src="selectPkmImage"
        fit="scale-down"
        style="width: 300px;" />
    </div>
    <div class="q-mb-md"><span class="text-h4 text-weight-bold">{{ checkIfIng }}</span> 입니다.</div>
    <div v-if="yesResult">
        <q-card class="q-mb-md column items-center" style="background-color: #ffe4b5; border: solid #f6c267; width: 250px;">
            <q-card-section class="full-width q-pt-sm">
                <div class="text-subtitle1 text-bold">적합도:</div>
            </q-card-section>      
            <div class="text-h4 text-weight-bold">{{ finalScore }}%</div>      
            <q-card-section>
                (추천하는 최소 적합도: {{ finalRecommend }}%)
            </q-card-section>
        </q-card>
        <q-card class="q-mb-md column items-center" style="background-color: #fbe4f2; border: solid #f6c267;">
            <q-card-section class="full-width q-pt-sm">
                <div class="text-subtitle1 text-bold">소개:</div>
            </q-card-section>        
            <q-card-section>
                {{ finalComment }}
            </q-card-section>
        </q-card>
        <q-card class="q-mb-md column items-center" style="background-color: rgb(240, 219, 246); border: solid #f6c267;">
            <q-card-section class="full-width q-pt-sm">
                <div class="text-subtitle1 text-bold">평가 중점사항:</div>
            </q-card-section>        
            <q-card-section>
                {{ finalEval }}
            </q-card-section>
        </q-card>
    </div>
    <div v-else>
        <q-card class="q-mb-md column items-center" style="border: solid #f6c267;">
            <q-card-section>
                적합한 진화체를 찾지 못했습니다.<br>이 이브이는 지금 상태 그대로를 제일 마음에 들어하는 것 같네요.
            </q-card-section>
        </q-card>
    </div>
    <q-dialog v-model="showRec">
        <q-card>
            <q-bar>          
            <div>다른 추천 후보군(위로 갈수록 더 추천)</div>
            <q-space />          
            <q-btn dense flat icon="close" v-close-popup />                 
            </q-bar>
            <div>
                <q-card-section v-for="(item, index) in finalList" v-bind:key="index">
                    <div class="full-width row flex-center">
                        <q-img
                            alt="Pokemon image"
                            :src="myDownloadStore.fetchImage('pkm', searchDex(korName[tierList.indexOf(item)]))"
                            fit="scale-down"
                            style="width: 100px;"
                            no-spinner
                            >
                        </q-img>
                        <div>
                            <div class="text-h6 text-bold">{{ korName[tierList.indexOf(item)] }}</div> 
                            <div class="text-h6">적합도: <span class="text-bold">{{ Math.floor(eeveeFilter[item]["percent"]) }}%</span></div>  
                            <div>(추천하는 최소 적합도: {{ Math.floor(eeveeFilter[item]["cutPercent"]) }}%)</div>   
                        </div>                               
                    </div>
                </q-card-section>  
            </div>
        </q-card>
    </q-dialog>    
    <q-btn v-if="finalList.length > 0" @click="showRec = true" color="primary" label="다른 진화 추천해주세요" icon="add" />    
</div>

</template>

<script setup>
import { ref } from 'vue';
import { useDownloadStore } from 'src/stores/downloadStore';
import { usePkmDBStore } from 'src/stores/pkmDBStore';
import { useEeveeStore } from 'src/stores/eeveeStore';
import json from 'src/pkmJson/eeveelutionBasis.json'

const myDownloadStore = useDownloadStore()
const myPkmDBStore = usePkmDBStore()
const myEeveeStore = useEeveeStore()
const selectPkmImage = ref()
const korName= ["님피아", "에브이", "샤미드", "쥬피썬더", "블래키", "글레이시아", "부스터", "리피아"];
const tierList= ["sylveon", "espeon", "vaporeon", "jolteon", "umbreon", "glaceon", "flareon", "leafeon"];
const preferList= ["글레이시아", "부스터", "리피아"];
const goldSub = myPkmDBStore.teamSubSkillList.slice()
goldSub.shift()

// input
const subSkills = ref(myEeveeStore.subSkills)
const upNature = ref(myEeveeStore.upNature)
const downNature = ref(myEeveeStore.downNature)
const eeveeLike = ref(myEeveeStore.preferEevee)
const fullSleep = ref(myEeveeStore.fullSleep)

// output
const finalScore = ref()
const finalComment = ref()
const finalEval = ref()
const finalRecommend = ref()
const checkIfIng = ref()
const yesResult = ref()
const showRec = ref()

//이브이 진화별 평가 점수
let allGrade= [
    {"sylveon": 0},
    {"espeon": 0},    
    {"vaporeon": 0},
    {"jolteon": 0},
    {"umbreon": 0}
];
function allAddGrade(b) {
    for(let i= 0; i < allGrade.length; i++) {
        allGrade[i][tierList[i]] += b;
    };
};
function searchDex(z){
    for(let k = 0; k < myEeveeStore.eeveelutionList.length; k++){
        if(myEeveeStore.eeveelutionList[k].label === z){
            return myEeveeStore.eeveelutionList[k].dex
        }
    }
}
if(downNature.value === "메인 스킬 발동률 ▽▽"){
    allAddGrade(-1);
};
if(upNature.value === "도우미 스피드 ▲▲"){
    if(downNature.value === "기력 회복량 ▽▽"){
        allGrade[tierList.indexOf("umbreon")]["umbreon"] += 0.5;
        allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.1;
    }else if(downNature.value === "식재료 도우미 확률 ▽▽"){
        allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.2;
        allGrade[tierList.indexOf("espeon")]["espeon"] += 0.2;
        allGrade[tierList.indexOf("umbreon")]["umbreon"] += 1;
        allGrade[tierList.indexOf("jolteon")]["jolteon"] += 1;
        allGrade[tierList.indexOf("vaporeon")]["vaporeon"] += 1;
    }else if(downNature.value === "EXP 획득량 ▽▽"){
        allAddGrade(1);
        allGrade[tierList.indexOf("sylveon")]["sylveon"] -= 0.8;
        allGrade[tierList.indexOf("espeon")]["espeon"] -= 0.8;
    }else if(downNature.value === "메인 스킬 발동률 ▽▽"){
        allAddGrade(0.5);
        allGrade[tierList.indexOf("umbreon")]["umbreon"] -= 0.5;
        allGrade[tierList.indexOf("sylveon")]["sylveon"] -= 0.5;
    };
}else if(upNature.value === "기력 회복량 ▲▲"){
    if(downNature.value === "도우미 스피드 ▽▽"){
        if(fullSleep.value){
            allAddGrade(-0.5);
            allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.3;
            allGrade[tierList.indexOf("espeon")]["espeon"] += 0.2;
            allGrade[tierList.indexOf("jolteon")]["jolteon"] += 0.1;            
        }else{
            allAddGrade(-0.2);
            allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.2;
            allGrade[tierList.indexOf("espeon")]["espeon"] += 0.2;
            allGrade[tierList.indexOf("jolteon")]["jolteon"] += 0.1;            
        };
    }else if(downNature.value === "식재료 도우미 확률 ▽▽"){
        if(fullSleep.value){
            allAddGrade(-0.5);
            allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.5;
            allGrade[tierList.indexOf("espeon")]["espeon"] += 0.3;
        }else{
            allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.2;
            allGrade[tierList.indexOf("espeon")]["espeon"] += 0.2;
            allGrade[tierList.indexOf("umbreon")]["umbreon"] += 0.5;
            allGrade[tierList.indexOf("jolteon")]["jolteon"] += 0.5;
            allGrade[tierList.indexOf("vaporeon")]["vaporeon"] += 0.5;
        };
    }else if(downNature.value === "EXP 획득량 ▽▽"){
        if(fullSleep.value){
            allAddGrade(-0.5);
            allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.5;
            allGrade[tierList.indexOf("espeon")]["espeon"] += 0.3;
        }else{
            allAddGrade(0.5);
            allGrade[tierList.indexOf("sylveon")]["sylveon"] -= 0.3;
            allGrade[tierList.indexOf("espeon")]["espeon"] -= 0.3;
        };
    };
}else if(upNature.value === "식재료 도우미 확률 ▲▲"){
    if(downNature.value === "도우미 스피드 ▽▽"){
        allAddGrade(-0.5);
        allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.2;
        allGrade[tierList.indexOf("espeon")]["espeon"] += 0.2;
        allGrade[tierList.indexOf("jolteon")]["jolteon"] += 0.1;
    }else if(downNature.value === "기력 회복량 ▽▽"){
        allAddGrade(-0.5);
        allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.3;
        allGrade[tierList.indexOf("espeon")]["espeon"] += 0.2;
    }
}else if(upNature.value === "메인 스킬 발동률 ▲▲"){
    if(downNature.value === "도우미 스피드 ▽▽"){
        allAddGrade(0.5);
        allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.5;
        allGrade[tierList.indexOf("espeon")]["espeon"] += 0.5;
        allGrade[tierList.indexOf("jolteon")]["jolteon"] += 0.1;
        allGrade[tierList.indexOf("umbreon")]["umbreon"] -= 1;        
    }else if(downNature.value === "기력 회복량 ▽▽"){
        allAddGrade(1);
        allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.5;
        allGrade[tierList.indexOf("umbreon")]["umbreon"] -= 1;
    }else if((downNature.value === "식재료 도우미 확률 ▽▽") || (downNature.value === "EXP 획득량 ▽▽")){
        allGrade[tierList.indexOf("sylveon")]["sylveon"] += 1.5;
        allGrade[tierList.indexOf("espeon")]["espeon"] += 1.5;
        allGrade[tierList.indexOf("umbreon")]["umbreon"] += 0.5;
        allGrade[tierList.indexOf("jolteon")]["jolteon"] += 1;
        allGrade[tierList.indexOf("vaporeon")]["vaporeon"] += 1;
    };
}else if(upNature.value === "EXP 획득량 ▲▲"){
    if(downNature.value === "도우미 스피드 ▽▽"){
        allAddGrade(-0.5);
        allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.2;
        allGrade[tierList.indexOf("espeon")]["espeon"] += 0.2;
        allGrade[tierList.indexOf("jolteon")]["jolteon"] += 0.1;        
    }else if(downNature.value === "기력 회복량 ▽▽"){
        allAddGrade(-0.5);
        allGrade[tierList.indexOf("sylveon")]["sylveon"] += 0.3;
        allGrade[tierList.indexOf("espeon")]["espeon"] += 0.2;
        allGrade[tierList.indexOf("umbreon")]["umbreon"] += 0.3;
    }else if(downNature.value === "식재료 도우미 확률 ▽▽"){
        allAddGrade(+0.3);
        allGrade[tierList.indexOf("sylveon")]["sylveon"] -= 0.2;
        allGrade[tierList.indexOf("espeon")]["espeon"] -= 0.2;
    };
};
//이브이 종류에 따른 티어별 급간 점수차
const tierScore= {"goodTier": [1, 0.3, 0.1, 0], "midTier": [1, 0.5, 0.3, 0]};
const sameTierGap= {"goodTier1": 0.5, "midTier1": 0.2, "allTier": 0.01};

for(const key of tierList.slice(0, allGrade.length)){
    let tierScoreEle= (json[key]["performance"] === "good") ? "goodTier" : "midTier";

    for(let i= 0; i < 4; i++){
        let whatTier= "tier" + (i + 1);
        for(let z= 0; z < json[key][whatTier].length; z++){
            let sameTierGapEle= (whatTier === "tier1") ? (tierScoreEle + "1") : "allTier";
            if(whatTier === "tier4"){
                json[key]["subScore"][json[key][whatTier][z]]= tierScore[tierScoreEle][i];
            }else{
                json[key]["subScore"][json[key][whatTier][z]]= tierScore[tierScoreEle][i] - z * sameTierGap[sameTierGapEle]; 
            };
        };
    };
    goldSub.forEach(e => {
        //gold 배점이랑 골드 서브 스킬 배점을 동일하게 부여
        json[key]["subScore"][e]= json[key]["subScore"]["gold"];
    });
    if(fullSleep.value){
        //수면시간 8시간 이상인 유저는 기력 회복 보너스 서브가 꽝
        json[key]["subScore"]["기력 회복 보너스"]= 0;
    };
};
function calcScore(name, subSkillList){
    let score = 0
    subSkillList.forEach((e)=>{
        score += json[name]["subScore"][e.label]
    })
    return score
};
//사용자의 서브 스킬 점수 계산
for (const key of tierList.slice(0, allGrade.length)) {
    for(let z = 0; z < subSkills.value.length; z++){
        if(subSkills.value[z].label === "나무열매 수 s" && downNature.value === "식재료 도우미 확률 ▽▽"){
            //나무열매s 서브가 초반에 있는데 성격도 식재료 감소면 가산점
            allGrade[tierList.indexOf(key)][key] += 0.5;
            break;
        }
    }
    allGrade[tierList.indexOf(key)][key] += calcScore(key, subSkills.value);
};
//합격 커트라인 계산
const sylveonCut= calcScore("sylveon", [{label: "스킬 확률 업 M"}, {label: "도우미 스피드 M"}]);
const espeonCut= 1 + calcScore("espeon", [{label: "스킬 확률 업 M"}, {label: "도우미 스피드 M"}]);
const umbreonCut= 0.5 + calcScore("umbreon", [{label: "나무열매 수 s"}, {label: "도우미 스피드 M"}]);
const jolteonCut= 0.5 + calcScore("jolteon", [{label: "도우미 보너스"}, {label: "스킬 레벨 업 s"}]);
const vaporeonCut= 0.5 + calcScore("vaporeon", [{label: "도우미 스피드 M"}, {label: "도우미 스피드 s"}]);
//커트라인, 최소최대 점수 저장용
let eeveeFilter= {
    "sylveon": {"cut": sylveonCut},
    "espeon": {"cut": espeonCut},
    "umbreon": {"cut": umbreonCut},
    "jolteon": {"cut": jolteonCut},
    "vaporeon": {"cut": vaporeonCut}
}; 
//이브이 진화별 최대최소 점수 계산.
//(나무열매s + 식재료 감소) & 금딱처럼 중복 점수는 편의상 무시
//상당히 하드코딩이라 티어표 변동되면 이것도 꼭 변경해야함! 주의
for(const key of tierList.slice(0, allGrade.length)){
    let mm10, mm25, mm50, mm75, mm100;
    mm10 = json[key]["tier1"][0]; 
    mm25 = json[key]["tier1"][1];
    mm50 = json[key]["tier2"][0];
    mm75 = json[key]["tier2"][1];
    mm100 = json[key]["tier2"][2];
    let params = []
    switch(subSkills.value.length){
        case 5:
            params.push({label: mm100})
        case 4:
            params.push({label: mm75})
        case 3:
            params.push({label: mm50})
        case 2:
            params.push({label: mm25})
        case 1:
            params.push({label: mm10})

    }
    eeveeFilter[key]["max"]= calcScore(key, params);
    if(json[key]["tier4"].length !== 0){
        mm10 = json[key]["tier4"][0]; 
        mm25 = json[key]["tier4"][1];
        mm50 = json[key]["tier4"][2];
        mm75 = json[key]["tier3"][json[key]["tier3"].length - 1];
        mm100 =json[key]["tier3"][json[key]["tier3"].length - 2];
        params = []
        switch(subSkills.value.length){
            case 5:
                params.push({label: mm100})
            case 4:
                params.push({label: mm75})
            case 3:
                params.push({label: mm50})
            case 2:
                params.push({label: mm25})
            case 1:
                params.push({label: mm10})
        }
        eeveeFilter[key]["min"]= calcScore(key, params);
    }else{
        let mmarray= [];
        for(let z=0; z < 5; z++){
            if(json[key]["tier3"].length > z){
                mmarray.push(json[key]["tier3"][json[key]["tier3"].length - 1 - z]);
            }else{
                mmarray.push(json[key]["tier3"][json[key]["tier2"].length - 1 - z]);
            };
        };        
        eeveeFilter[key]["min"]= calcScore(key, [{label: mmarray[0]}, {label: mmarray[1]}, {label: mmarray[2]}, {label: mmarray[3]}, {label: mmarray[4]}]);
    };
};
//최대최소 점수에 진화체별 성격 보정 추가
eeveeFilter["sylveon"]["max"] += 2;
eeveeFilter["espeon"]["max"] += 2;
eeveeFilter["jolteon"]["max"] += 1.5;
eeveeFilter["vaporeon"]["max"] += 1.5;
eeveeFilter["umbreon"]["max"] += 1.5;

eeveeFilter["sylveon"]["min"] -= 1;
eeveeFilter["espeon"]["min"] -= 1;
eeveeFilter["jolteon"]["min"] -= 1;
eeveeFilter["vaporeon"]["min"] -= 1;
eeveeFilter["umbreon"]["min"] -= 1;

//최종 합격 목록
const finalList= ref([]);
let sylEsp= [];
//최종 결과가 커트라인을 넘기면 합격 목록에 추가
for (const key of tierList.slice(0, allGrade.length)) {
    if(eeveeFilter[key]["cut"] <= allGrade[tierList.indexOf(key)][key]){            
        finalList.value.push(key);
    };
};
if(finalList.value.length !== 0){
    //님피아&에브이 -> 쥬피썬더&샤미드&블래키 순으로 선택
    if(finalList.value.includes(tierList[0]) || finalList.value.includes(tierList[1])){
        //님&에 둘다 존재하면 점수순으로 나열. 동점 시 님피아 우선
        if(finalList.value.includes(tierList[0]) && finalList.value.includes(tierList[1])){
            if(allGrade[1][tierList[1]] > allGrade[0][tierList[0]]){
                const esp= finalList.value[1];
                finalList.value[1]= finalList.value[0];
                finalList.value[0]= esp;
            };
            sylEsp= finalList.value.slice(0, 2);
            finalList.value= finalList.value.slice(2);
        }else{
            sylEsp.push(finalList.value.shift());
        };
    };
    //님&에 제외한 나머지를 점수순으로 나열
    finalList.value.sort((a, b) => allGrade[tierList.indexOf(b)][b] - allGrade[tierList.indexOf(a)][a]);
    //다시 님&에랑 합쳐서 전체 점수순 배열 완성
    finalList.value= sylEsp.concat(finalList.value);
    if(finalList.value[0] === undefined){
        //뒤에 추가하므로 첫 원소인 빈칸이 안사라지는 문제 해결
        finalList.value.shift();
    };
    for(const j of finalList.value){
        if(allGrade[j] >= eeveeFilter[j]["max"]){
            eeveeFilter[j]["percent"]= 100;    
        }else{
            eeveeFilter[j]["percent"]= 100 * (allGrade[tierList.indexOf(j)][j] - eeveeFilter[j]["min"]) / (eeveeFilter[j]["max"] - eeveeFilter[j]["min"]);
            eeveeFilter[j]["cutPercent"]= 100 * (eeveeFilter[j]["cut"] - eeveeFilter[j]["min"]) / (eeveeFilter[j]["max"] - eeveeFilter[j]["min"]);
        };
    };
    if(eeveeLike.value.label !== undefined && eeveeLike.value.label !== "없음"){
        //선호하는 진화가 글&부&리 가 아닐 경우
        if(preferList.indexOf(eeveeLike.value.label) === -1){
            //선호하는 이브이가 추천 후보에 있을 경우
            if(finalList.value.indexOf(tierList[korName.indexOf(eeveeLike.value.label)]) !== -1){
                //선호 이브이를 1순위로 배치한다.
                finalList.value.splice(finalList.value.indexOf(tierList[korName.indexOf(eeveeLike.value.label)]), 1);
                finalList.value.unshift(tierList[korName.indexOf(eeveeLike.value.label)]);
            };
        }else{
            if(eeveeLike.value.label === "리피아"){
                if(finalList.value.indexOf("sylveon") !== -1){
                    finalList.value.unshift(tierList[korName.indexOf(eeveeLike.value.label)]);
                    eeveeFilter[tierList[korName.indexOf(eeveeLike.value.label)]]= eeveeFilter["sylveon"];
                };
            }else{
                //선호하는 진화가 글&부 중에 하나
                let findSubstitute= tierList.slice(2, 4);                
                for(const z of findSubstitute){
                    if(finalList.value.indexOf(z) !== -1){
                        //블&주&샤가 후보에 있으면 동일한 평가로 1순위에 선호 이브이를 추가
                        finalList.value.unshift(tierList[korName.indexOf(eeveeLike.value.label)]);
                        eeveeFilter[tierList[korName.indexOf(eeveeLike.value.label)]]= eeveeFilter[z];
                        console.log(tierList[korName.indexOf(eeveeLike.value.label)])
                        break;
                    };
                }
            }
        };
    };
    const firstEevee = finalList.value.shift()
    checkIfIng.value= korName[tierList.indexOf(firstEevee)];
    

    //간단 코멘트
    const eeveeComment= {
        "sylveon": "포켓몬 슬립 내에서 몇 안되는 기력 서포터 포켓몬입니다. 기력은 포켓몬들의 도우미 효율과 직결되므로 그 중요성은 이루 다 말할 수 없습니다. 또한 서포터 포켓몬 특성 상 어떠한 파티에도 쉽게 어우러집니다. 최소한의 조건만 갖추면 바로 훌륭한 성능을 발휘하기에 개체 선별도 쉬운 편입니다. 이러한 복합적인 이유로 이브이 진화체 중에서도 최상위권으로 평가 받고 있습니다.",
        "espeon": "포켓몬 슬립 내에서 최고의 스킬 중 하나로 평가 받는 '에너지 차지 M' 스킬을 보유한 포켓몬입니다. 스킬 레벨에 따른 에너지 증가량이 기하급수적으로 늘어나는 것이 특징입니다. 메인 스킬 6렙 기준 잠만보에게 4546의 에너지를 주며, 이는 적당한 요리 1개 분량의 에너지입니다.",
        "vaporeon":"무작위 종류의 식재료를 최대 21개까지 주는 '식재료 획득 S'스킬을 보유한 포켓몬입니다. 스킬 자체의 성능은 매우 우수하기에 동일한 스킬을 보유한 비스킬형 포켓몬들도 웬만하면 메인 스킬 발동률 감소는 피하는 편입니다. 느린 도우미 속도의 반대급부로 높은 스킬 발동 확률을 보유하고 있습니다.",
        "jolteon": "포켓몬 슬립 내에서 라이츄, 팬텀과 더불어 제일 빠른 도우미 속도를 보유한 포켓몬입니다. 그렇기에 스킬을 배제해도 자체 스펙이 매우 뛰어납니다. 쥬피썬더는 동료 포켓몬이 일정 횟수 즉시 도움을 발동하는 스킬을 보유했는데, 이는 동료 포켓몬의 성능에 따라 편차가 큽니다. 따라서 단독으로도 고성능을 내는 에브이에 밀리는 것이 사실입니다. 하지만 게임 후반으로 갈수록, 팀 포켓몬의 성능이 좋아질수록 잠재능력은 충분한 포켓몬입니다.",        
        "umbreon": "상당히 흥미로운 구조를 지닌 포켓몬입니다. 높은 스킬 발동 확률로 자체 기력 유지에 용이합니다만, 그것 뿐이라는 점이 아쉽습니다.",
        "glaceon": "요리에 필요한 냄비 용량을 늘리는 독특한 스킬을 보유한 포켓몬입니다. 사실 자체적으로 잠만보 에너지에 기여하는 능력이 없고, 동료 포켓몬이 모은 식재료를 사용할 수 있게 해주는 능력이라 사용처가 한정된 포켓몬입니다. 하지만 반대로 식재료 중심 파티라면 반드시 필요한 녀석입니다.",
        "flareon": "요리에 필요한 냄비 용량을 늘리는 독특한 스킬을 보유한 포켓몬입니다. 사실 자체적으로 잠만보 에너지에 기여하는 능력이 없고, 동료 포켓몬이 모은 식재료를 사용할 수 있게 해주는 능력이라 사용처가 한정된 포켓몬입니다. 하지만 반대로 식재료 중심 파티라면 반드시 필요한 녀석입니다.",
        "leafeon": "포켓몬 슬립 내에서 몇 안되는 기력 서포터 포켓몬입니다. 기력은 포켓몬들의 도우미 효율과 직결되므로 그 중요성은 이루 다 말할 수 없습니다. 또한 서포터 포켓몬 특성 상 어떠한 파티에도 쉽게 어우러집니다. 하지만 무작위의 포켓몬에게 기력을 회복시켜준다는 점은 아쉽습니다."
    };
    //간략한 평가 기준 설명
    const eeveeGuide= {
        "sylveon": "별다른 준비 없이도 훌륭한 서포팅 능력을 보입니다. 그렇기에 웬만하면 적합 판정을 주려고 했습니다. '스킬 확률업 M', '스킬 확률업 S', 그리고 '메인 스킬 발동률 증가' 성격이 고평가를 받습니다. 또한 서포터의 특성을 고려해, 팀 전체를 서포팅하는 서브 스킬에 가산점을 주었습니다.",
        "espeon": "메인 스킬의 성능이 압도적이기에 스킬 관련 능력치에 높은 비중을 두었습니다. '스킬 확률업 M', '스킬 확률업 S', 그리고 '메인 스킬 발동률 증가' 성격이 고평가를 받습니다. 님피아와 유사한 조건을 갖췄지만, 팀 에이스의 역할이기에 보다 엄격한 기준을 적용했습니다. 따라서 에브이가 추천으로 나왔으면 웬만하면 님피아로도 훌륭한 친구입니다.",
        "vaporeon": "느린 도우미 속도를 보완하는 데 중점을 두었습니다. 비슷한 경쟁 상대인 쥬피썬더와 조건이 비슷하지만, 동료 서포팅에 무게를 둔 쥬피썬더에 비해 '도우미 스피드 M'등 자체 스펙을 보완하는 능력에 중점을 두었습니다. '스킬 확률업 M'은 당연히 좋습니다.",
        "jolteon": "자체 스펙이 훌륭하기에 '나무열매 수 S'의 효율이 매우 좋습니다. '스킬 확률업 M'은 당연히 좋습니다. 이미 훌륭한 스펙 덕분에 자신의 강화 대신 팀원 서포팅에 투자할 여유가 있습니다. 그래서 '도우미 보너스'를 필두로 다양한 팀 서포팅 능력에 가산점을 주었습니다.",        
        "umbreon": "스킬형이지만 스킬이 중요하지 않다는 특징이 핵심입니다. 따라서 메인 스킬 관련 성격 및 서브 스킬의 중요도가 떨어지고 그 외에 도움이 되는 많은 능력에서 가점을 얻습니다. 어떻게 키워도 밥값을 하기에 육성 방향이 자유롭습니다.",
        "glaceon": "적당한 스확과 적당한 도우미 능력이 균형있게 필요하다고 생각합니다. '스킬 확률 업 M', '나무열매 수 S'등 밸런스 있게 좋은 서브 스킬들에 가산점을 주었습니다.",
        "flareon": "적당한 스확과 적당한 도우미 능력이 균형있게 필요하다고 생각합니다. '스킬 확률 업 M', '나무열매 수 S'등 밸런스 있게 좋은 서브 스킬들에 가산점을 주었습니다.",
        "leafeon": "스킬 확률업 M, 스킬 확률업 S, 그리고 메인 스킬 발동률 증가 성격이 고평가를 받을 수 있습니다. 또한 서포터의 특성을 고려해, 팀 전체를 서포팅하는 서브 스킬에 가산점을 주었습니다."
    };
    let naming= firstEevee;
    selectPkmImage.value = myDownloadStore.fetchImage('pkm',searchDex(checkIfIng.value))
    finalScore.value = Math.floor(eeveeFilter[firstEevee]["percent"])
    finalRecommend.value = Math.floor(eeveeFilter[firstEevee]["cutPercent"])
    finalComment.value = eeveeComment[firstEevee]
    finalEval.value = eeveeGuide[naming]  
    yesResult.value = true                                                                  
}else{
    checkIfIng.value = "이브이"
    selectPkmImage.value = myDownloadStore.fetchImage('sleep', 133)
    yesResult.value = false
};
// console.log(eeveeFilter)
// console.log(allGrade)
</script>