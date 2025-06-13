import { defineStore } from 'pinia';
import { ref } from 'vue'

// 사용자 입력값 관리
export const useInputStore = defineStore('manage-input', () => {
    //
    //          힐러는 이 정보를 빌려 쓴다
    //
    // 사용자 입력 총 도우미 보너스 개수
    const hbCount= ref(0)
    // 사용자 입력 총 기력 회복 보너스 개수
    const erbCount= ref(0)
    //
    //          이건 힐러랑 공통
    //
    // 사용자 입력 포켓몬 이름
    const pkmName= ref('')
    // 사용자 입력 포켓몬 레벨
    const pkmLevel= ref(50)
    // 사용자 선택 보유중인 서브 스킬들
    const subSkills= ref([])
    // 선택한 포켓몬의 첫번째 식재료
    const firstIng= ref('fancyapple')
    // 선택한 포켓몬의 두번째 식재료
    const secondIng= ref('warmingginger')
    // 선택한 포켓몬의 세번째 식재료
    const thirdIng= ref('fancyegg')
    const fixedFirstIng= ref('fancyapple')
    const fixedSecondIng= ref('warmingginger')
    const fixedThirdIng= ref('fancyegg')
    const allIngList = ref([])
    // 선택한 상승 성격
    const upNature= ref('')
    // 선택한 하락 성격
    const downNature= ref('')
    // 선택한 도감번호
    const selectedPkmDex= ref('25')
    const mainSkillLevel = ref(1)
    // 좋은 캠프 티켓 적용 여부
    const useGoodCamp = ref(false)
    // 굿나잇리본 적용 여부
    const useRibbon = ref(false)
    // 굿나잇리본 레벨
    const ribbonLev = ref("0")
    // 남은 진화 횟수
    const leftEvo = ref(1)
    // 기력회복 보너스 보유 여부
    const hasErb = ref(false)
    // 전부 저장
    function storeEverything(h, e, n, l, s, f, se, t, ff, fs, ft, u, d, num, ms, gc, ur, rl, le, he, ai) {
        hbCount.value = h;
        erbCount.value = e;
        
        pkmName.value = n;
        pkmLevel.value = l;
        subSkills.value = s;
        firstIng.value = f;
        secondIng.value = se;
        thirdIng.value = t;
        fixedFirstIng.value = ff;
        fixedSecondIng.value = fs;
        fixedThirdIng.value = ft;
        upNature.value = u;
        downNature.value = d;
        selectedPkmDex.value = num;
        mainSkillLevel.value = ms;
        useGoodCamp.value = gc;
        useRibbon.value = ur;
        ribbonLev.value = rl;
        leftEvo.value = le;   
        hasErb.value = he;     
        allIngList.value = ai;
    }
    function hasEssential(){
        if(pkmName.value !== '' && upNature.value !== '' && downNature.value !== ''){
            return true
        }
        else{
            return false
        }
    }

    return {
        hbCount,
        erbCount,

        pkmName,
        pkmLevel,
        subSkills,
        firstIng,
        secondIng,
        thirdIng,
        fixedFirstIng,
        fixedSecondIng,
        fixedThirdIng,
        upNature,
        downNature,
        selectedPkmDex,
        mainSkillLevel,
        useGoodCamp,
        useRibbon,
        ribbonLev,
        leftEvo,
        hasErb,
        storeEverything,
        hasEssential,
        allIngList
    };
})
// 수면 시간 입력값 관리
export const useSleepTimeInputStore = defineStore('sleepTime-input', ()=> {
    // 수면 시간
    const sleepTime = ref('08:30')
    return{
        sleepTime
    }
})


// 힐러 포켓몬 입력값 관리
export const useHealerInputStore = defineStore('healer-input', ()=> {
    /*
            이거는 힐러만 수집하는 정보
    */
    // 힐러 포켓몬 설정 스펙
    const calcVer = ref('lightVer')
    // 힐러 메인 스킬 사용 횟수
    const healSkillCount = ref(5)
    // 이건 개체값 검사기에서 사용하기 위한 수정불가값
    const fixedHealSkillCount = 6
    /*
            이거는 일반 포켓몬이랑 공통인 정보
    */
    // 사용자 입력 포켓몬 이름
    const pkmName= ref('가디안')
    // 사용자 입력 포켓몬 레벨
    const pkmLevel= ref(50)
    // 사용자 선택 보유중인 서브 스킬들
    const subSkills= ref([])
    // 선택한 포켓몬의 첫번째 식재료
    const firstIng= ref('fancyapple')
    // 선택한 포켓몬의 두번째 식재료
    const secondIng= ref('greengrasscorn')
    // 선택한 포켓몬의 세번째 식재료
    const thirdIng= ref('largeleek')
    const fixedFirstIng= ref('fancyapple')
    const fixedSecondIng= ref('soothingcacao')
    const fixedThirdIng= ref('largeleek')
    const allIngList = ref([])
    // 선택한 상승 성격
    const upNature= ref('')
    // 선택한 하락 성격
    const downNature= ref('')
    // 선택한 도감번호
    const selectedPkmDex= ref('282')
    const mainSkillLevel = ref(6)
    // 굿나잇리본 적용 여부
    const useRibbon = ref(true)
    // 굿나잇리본 레벨
    const ribbonLev = ref("3")
    // 남은 진화 횟수
    const leftEvo = ref(0)
    // 기력회복 보너스 보유 여부
    const hasErb = ref(false)

    // 전부 저장
    function storeEverything(ver, hc, n, l, s, f, se, t, ff, fs, ft, u, d, num, ms, ur, rl, le, he, ai) {
        calcVer.value = ver;
        healSkillCount.value = hc;

        pkmName.value = n;
        pkmLevel.value = l;        
        subSkills.value = s;
        firstIng.value = f;
        secondIng.value = se;
        thirdIng.value = t;
        fixedFirstIng.value = ff;
        fixedSecondIng.value = fs;
        fixedThirdIng.value = ft;
        upNature.value = u;
        downNature.value = d;
        selectedPkmDex.value = num;
        mainSkillLevel.value = ms;
        useRibbon.value = ur;
        ribbonLev.value = rl;
        leftEvo.value = le;
        hasErb.value = he;
        allIngList.value = ai;
    }
    function hasEssential(){
        if(pkmName.value !== '' && upNature.value !== '' && downNature.value !== ''){
            return true
        }
        else{
            return false
        }
    }

    return {
        calcVer,
        healSkillCount,
        fixedHealSkillCount,

        pkmName,
        pkmLevel,
        subSkills,
        firstIng,
        secondIng,
        thirdIng,
        fixedFirstIng,
        fixedSecondIng,
        fixedThirdIng,
        upNature,
        downNature,
        selectedPkmDex,
        mainSkillLevel,
        useRibbon,
        ribbonLev,
        leftEvo,
        hasErb,
        storeEverything,
        hasEssential,
        allIngList
    }
})
