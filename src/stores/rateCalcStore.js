import { defineStore } from 'pinia';
import { ref } from 'vue'

// 사용자 입력값 관리
export const useRateCalcStore = defineStore('rate-calc', () => {
    // input값이랑 같으면 api 생략
    const pkmName = ref('')
    const pkmLevel = ref(0)
    // 나무열매, 소지수, 식재료, 스킬, 팀 보너스 순
    const orderData = ref([])    
    // 힐러 사용하는지 여부
    const useHealer = ref(true)
    // 커트라인의 백분위
    const minOrderData = ref([])
    const vsOutput = ref({'ing': [], 'berry': [], 'skill': []})
    const oneBest = ref({'berry': {}, 'ing': {}, 'skill': {}})

    // 무엇 특화인지
    const whatSpeciality = ref('')
    // 도우미 보너스는 큰 가산점
    const hasHb = ref(false)

    // 각 분야별 최소 커트라인
    function minPoke(){
        const cutLine = {
            "ingredient": {
                "sub": [{label: '식재료 확률 업 s', bg: 'bg-sSkill'}],
                "upNature": '식재료 도우미 확률 ▲▲',
                "downNature": '메인 스킬 발동률 ▽▽'
            },
            "berry": {
                "sub": [{label: '나무열매 수 s', bg: 'bg-goldSkill'}],
                "upNature": '영향 없음 --',
                "downNature": '영향 없음 --'
            },
            "skill": {
                "sub": [{label: '스킬 확률 업 s', bg: 'bg-sSkill'}],
                "upNature": '메인 스킬 발동률 ▲▲',
                "downNature": '식재료 도우미 확률 ▽▽'
            }
        }
        return cutLine[whatSpeciality.value]
    }
    // 통합 점수 계산
    function calcFinalGrade(orderData, hasHb){
        // 통합 점수 계산기준
        const finalGrade = {
            "ingredient": {
                "ing": 0.925,
                "berry": 0.045,
                "skill": 0.03
            },
            "berry": {
                "berry": 0.97,
                "skill": 0.02,
                "ing": 0.01
            },
            "skill": {
                "skill": 0.88,
                "berry": 0.09,
                "ing": 0.03
            }
        }
        // 도우미 보너스 가산점
        const hbGood = hasHb ? 3 : 0
        const finalFinal = Math.round(orderData[0] * finalGrade[whatSpeciality.value]["berry"]
            + orderData[2] * finalGrade[whatSpeciality.value]["ing"]
            + orderData[3] * finalGrade[whatSpeciality.value]["skill"])
            + hbGood        
        return finalFinal > 100 ? 100 : finalFinal
    }
    // 등급 커트라인
    function gradeCut(g){
        switch(true){
            case g >= 96:
                return "리자몽"
            case g >= 89:
                return "대왕끼리동"
            case g >= 77:
                return "마빌크"
            case g >= 60:
                return "마자용"
            default:
                return "또가스"
        }
    }

    function storeRate(n, l, o, h, m, b, v, t){
        pkmName.value = n
        pkmLevel.value = l
        orderData.value = o
        useHealer.value = h
        minOrderData.value = m   
        hasHb.value = b  
        vsOutput.value = v
        oneBest.value = t
    }

    return {
        pkmName,
        pkmLevel,        
        orderData,           
        useHealer,     
        minOrderData, 
        whatSpeciality,    
        hasHb,  
        vsOutput,
        oneBest,            
        minPoke,
        calcFinalGrade,
        gradeCut,
        storeRate      
    };
})
