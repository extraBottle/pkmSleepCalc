import { defineStore } from 'pinia';
import { ref } from 'vue'

// 사용자 입력값 관리
export const useEeveeStore = defineStore('eevee-input', () => {
    // 사용자 입력 포켓몬 레벨
    const pkmLevel= ref(30)    
    // 사용자 선택 보유중인 서브 스킬들
    const subSkills= ref([])
    // 선택한 상승 성격
    const upNature= ref('')
    // 선택한 하락 성격
    const downNature= ref('')
    // 선호 이브이
    const preferEevee = ref()
    // 풀잠 여부
    const fullSleep = ref(true)
    // 추천 결과
    const recommendEevee = ref([])
    // 이브이 진화체
    const eeveelutionList = [
        { label: "없음", bg: '#fcfcfc' },
        { label: "에브이", bg: '#fbe4f2', dex: 196 },
        { label: "님피아", bg: '#ffaec0', dex: 700 },
        { label: "샤미드", bg: '#9cd4ea', dex: 134 },
        { label: "부스터", bg: '#f49e63', dex: 136 },
        { label: "글레이시아", bg: '#65c4dc', dex: 471 },
        { label: "리피아", bg: '#7fdc9e', dex: 470 },
        { label: "쥬피썬더", bg: '#fef06d', dex: 135 },
        { label: "블래키", bg: '#5e6b6c', dex: 197 }
    ]
    // 전부 저장
    function storeEverything(l, s, u, d, p, f){        
        pkmLevel.value = l;
        subSkills.value = s;        
        upNature.value = u;
        downNature.value = d;
        preferEevee.value = p;
        fullSleep.value = f;
    }
    return {
        pkmLevel,        
        subSkills,
        upNature,
        downNature,
        eeveelutionList,
        preferEevee,
        fullSleep,
        recommendEevee,
        storeEverything
    }
})
