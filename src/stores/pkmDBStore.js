import { defineStore } from 'pinia';
import fullDex from 'src/fetch-api-data-action/data.json'
import sleepDex from 'src/fetch-api-data-action/data2.json'

// 인게임 포켓몬 정보 관리
export const usePkmDBStore = defineStore('pokemon-DB', ()=> {
    // 서브 스킬 목록 (생산량에 영향을 주는)
    const subSkillList = [
        {
            label: '나무열매 수 s',
            bg: 'bg-goldSkill',
            mult: 1 // 이건 곱셈 아님! 덧셈임
        },
        {
            label: '도우미 스피드 M',
            bg: 'bg-mSkill',
            mult: 0.14
        },
        {
            label: '식재료 확률 업 M',
            bg: 'bg-mSkill',
            mult: 0.36
        },
        {
            label: '스킬 확률 업 M',
            bg: 'bg-mSkill',
            mult: 0.36
        },
        {
            label: '최대 소지 수 업 L',
            bg: 'bg-mSkill',
            mult: 18
        },
        {
            label: '최대 소지 수 업 M',
            bg: 'bg-mSkill',
            mult: 12
        },
        {
            label: '도우미 스피드 s',
            bg: 'bg-sSkill',
            mult: 0.07
        },
        {
            label: '식재료 확률 업 s',
            bg: 'bg-sSkill',
            mult: 0.18
        },
        {
            label: '스킬 확률 업 s',
            bg: 'bg-sSkill',
            mult: 0.18
        },
        {
            label: '최대 소지 수 업 s',
            bg: 'bg-sSkill',
            mult: 6
        }
    ]
    // 도우미 보너스 적용 수치
    const hbMult = 0.05
    // 기력 회복 보너스 적용 수치
    const erbMult = 0.14
    // 최대 적용 가능한 도우미 증가
    const maxHS = 0.35
    // 현존하는 모든 메인 스킬 개수
    const totalMainSkill = 14
    // 상승 성격
    const upNatureList = [
        '영향 없음 --',
        '도우미 스피드 ▲▲',
        '기력 회복량 ▲▲',
        '식재료 도우미 확률 ▲▲',
        '메인 스킬 발동률 ▲▲',
        'EXP 획득량 ▲▲'
    ]
    // 하락 성격
    const downNatureList = [
        '영향 없음 --',
        '도우미 스피드 ▽▽',
        '기력 회복량 ▽▽',
        '식재료 도우미 확률 ▽▽',
        '메인 스킬 발동률 ▽▽',
        'EXP 획득량 ▽▽'
    ]
    // 상승 보정치
    const upMult = {
        '영향 없음 --': 1.0,
        '도우미 스피드 ▲▲': 0.9,
        '기력 회복량 ▲▲': 1.2,
        '식재료 도우미 확률 ▲▲': 1.2,
        '메인 스킬 발동률 ▲▲': 1.2,
        'EXP 획득량 ▲▲': 1.18
    }
    // 하락 보정치
    const downMult = {
        '영향 없음 --': 1.0,
        '도우미 스피드 ▽▽': 1.1,
        '기력 회복량 ▽▽': 0.88,
        '식재료 도우미 확률 ▽▽': 0.8,
        '메인 스킬 발동률 ▽▽': 0.8,
        'EXP 획득량 ▽▽': 0.82
    }
    // 100% 회복 수면 시간
    const timeForFull = 8.5
    const maxE = 150
    // 기력과 도우미 속도 보정 (초과)
    const speedEnerMultList = [
        {
            'e': 80,
            'm': 0.45
        },
        {
            'e': 60,
            'm': 0.52
        },
        {
            'e': 40,
            'm': 0.62
        },
        {
            'e': 20,
            'm': 0.71
        },
        {
            'e': 0,
            'm': 1.0
        }
    ]
    // 식사로 기력 회복량 (이상)
    const mealRecovery = [
        {
            'e': 100,
            'm': 0
        },
        {
            'e': 80,
            'm': 1
        },
        {
            'e': 60,
            'm': 2
        },
        {
            'e': 40,
            'm': 3
        },
        {
            'e': 20,
            'm': 4
        },
        {
            'e': 0,
            'm': 5
        }
    ]
    // 1시간 당 기력 감소량
    const enerPerHour = 6
    // 포켓몬 한글명 (포슬립에 존재하는)
    const korPkmName = []    
    // index 맞춘 영어명
    const enPkmName = []
    // index 맞춘 도감번호
    const pkmDexNum = []

    // 현재 접속한 사용자가 불러온 포켓몬 데이터 모음 (중복 api request 방지용)
    const lazyPkmData = []
    // 영어 이름만 따로 모은 것
    const lazyPkmName = []

    // 포켓몬 데이터 불러오기 https://api.sleepapi.net/api/pokemon/{이름}
    async function fetchPkmData(enName){
        if(lazyPkmName.includes(enName)){
            return
        }
        else{
            try {
                const response = await fetch(`https://api.sleepapi.net/api/pokemon/${enName}`);
                const json = await response.json();
                lazyPkmData.push(json);
                lazyPkmName.push(json.name);
            } catch (error) {
                console.error('fetch error:', error);
            }
        }
    }

    // 포켓몬 한글명 목록 불러오기(페이지 로드시)
    function loadKorPkmName(){
        fullDex.data.forEach(item => {
            if (sleepDex.includes(item.en)) {
                korPkmName.push(item.kor);
                enPkmName.push(item.en);
                pkmDexNum.push(item.Ndex)
            }
        });
    }

    // 저장한 포슬립 포켓몬 데이터에서 원하는 값 찾기
    function searchPkmData(key, value){
        return lazyPkmData.find(obj => obj[key] === value);
        // return object
    }

    // 한글명으로 영어명 찾기
    function convertKorEn(p){
        return enPkmName[korPkmName.indexOf(p)]
    }
    // 한글명으로 도감번호 찾기
    function findDexNum(p){
        return pkmDexNum[korPkmName.indexOf(p)]
    }
    // 선택한 포켓몬의 식재료 이름 찾기 (포켓몬 이름, 몇번째 식재료인지, 아이콘 용인가 이름 저장용인가)
    function bringIng(name, place, purpose = 'icon'){
        let findIng = ''
        function allIngList(n){
            return searchPkmData('name', convertKorEn(name))[`ingredient${n}`]
        }
        switch(place){
            case 0:
                findIng= allIngList(0)['ingredient']['longName'];
                break;
            case 1:
                findIng= allIngList(30).find(obj => obj['ingredient']['longName'] !== allIngList(0)['ingredient']['longName'])['ingredient']['longName'];
                break;
            case 2:
                if(allIngList(60).length < 3){
                    findIng= allIngList(30).find(obj => obj['ingredient']['longName'] !== allIngList(0)['ingredient']['longName'])['ingredient']['longName'];
                }
                else{
                    findIng= allIngList(60).find(obj =>
                        obj['ingredient']['longName'] !== allIngList(0)['ingredient']['longName'] &&
                        obj['ingredient']['longName'] !== allIngList(30).find(obj => 
                            obj['ingredient']['longName'] !== allIngList(0)['ingredient']['longName'])['ingredient']['longName'])['ingredient']['longName']
                }
                break;
            default:
                return
        }
        return purpose === "store" ? findIng : findIng.replace(/\s/g, "").toLowerCase()
    }

    return {
        subSkillList,
        hbMult,
        erbMult,
        maxHS,
        upNatureList,
        downNatureList,
        upMult,
        downMult,
        timeForFull,
        maxE,
        speedEnerMultList,
        mealRecovery,
        enerPerHour,
        korPkmName,
        enPkmName,
        pkmDexNum,
        lazyPkmData,
        totalMainSkill,
        fetchPkmData,
        loadKorPkmName,
        searchPkmData,
        convertKorEn,
        findDexNum,
        bringIng
    }
})
