import { defineStore } from 'pinia';
import fullDex from 'src/pkmJson/data.json'
import sleepDex from 'src/pkmJson/sleepPkm/data.json'

// 인게임 포켓몬 정보 관리
export const usePkmDBStore = defineStore('pokemon-DB', ()=> {
    // 굿나잇리본 레벨별 성능
    const ribbonList = [
        {
            level: 1,
            inventory: 1,
            speed: [0, 0, 0]
        },
        {
            level: 2,
            inventory: 3,
            speed: [0, 5, 11]
        },
        {
            level: 3,
            inventory: 6,
            speed: [0, 5, 11]
        },
        {
            level: 4,
            inventory: 8,
            speed: [0, 12, 25]
        }
    ]
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
    // 서브 스킬 목록 (전체)
    const allSubSkillList = [
        {
            label: '도우미 보너스',
            bg: 'bg-goldSkill',
            mult: 0.05
        },
        {
            label: '나무열매 수 s',
            bg: 'bg-goldSkill',
            mult: 1 // 이건 곱셈 아님! 덧셈임
        },
        {
            label: '수면 EXP 보너스',
            bg: 'bg-goldSkill',
            mult: 0.14
        },
        {
            label: '리서치 EXP 보너스',
            bg: 'bg-goldSkill',
            mult: 0.06
        },
        {
            label: '기력 회복 보너스',
            bg: 'bg-goldSkill',
            mult: 0.14
        },
        {
            label: '꿈의조각 보너스',
            bg: 'bg-goldSkill',
            mult: 0.06
        },
        {
            label: '스킬 레벨 업 M',
            bg: 'bg-goldSkill',
            mult: 2
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
            label: '스킬 레벨 업 s',
            bg: 'bg-mSkill',
            mult: 1
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
    // 팀 보너스 서브
    const teamSubSkillList = [
        '도우미 보너스',
        '수면 EXP 보너스',
        '리서치 EXP 보너스',
        '기력 회복 보너스',
        '꿈의조각 보너스'         
    ]
    // 기력 회복 보너스 보유 포켓몬의 최대 회복 기력
    const erbMaxEnergy = 105
    // 도우미 보너스 적용 수치
    const hbMult = 0.05
    // 기력 회복 보너스 적용 수치
    const erbMult = 0.14
    // 최대 적용 가능한 도우미 증가
    const maxHS = 0.35
    // 스킬형의 최대 축적 가능 스킬 횟수
    const collectSkillCount = {
        "skill": 2,
        "else": 1
    }
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
        '도우미 스피드 ▽▽': 1.075,
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
            'm': 0.58
        },
        {
            'e': 1,
            'm': 0.66
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
            'm': 1
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

    // api url
    const apiUrl = "https://rxgqybcxgapiftblwttl.supabase.co/rest/v1/pokedex?"

    // 포켓몬 한글명 (포슬립에 존재하는 모든)
    const korPkmName = []
    // index 맞춘 도감번호
    const pkmDexNum = []  

    // 삭제== index 맞춘 영어명
    const enPkmName = []

    // 현재 접속한 사용자가 불러온 포켓몬 데이터 모음 (중복 api request 방지용)
    const lazyPkmData = []
    // 사용자가 불러온 포켓몬 이름만 따로 모은 것
    const lazyPkmName = []

    // 포켓몬 데이터 불러오기
    async function fetchPkmData(korName){
        if(lazyPkmName.includes(korName)){
            return
        }
        else{
            try {
                const response = await fetch(`${apiUrl}select=*,main_skills(*),berries(name)&kor_name=eq.${korName}`, {
                    headers: {                        
                        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
                        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`
                    }
                });
                const json = await response.json();                                
                lazyPkmData.push(json[0]);
                lazyPkmName.push(json[0].kor_name);                              
            } catch(e) {
                console.error('pkm DB fetch error: ', e.message);
            }
        }
    }

    // 포켓몬 한글명 목록 & 도감번호 불러오기 (페이지 로드시)
    async function loadKorPkmName(){
        if(korPkmName.length === 0){
            try {
                const response = await fetch(`${apiUrl}select=kor_name,pokedex_number`, {
                    headers: {
                        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
                        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`
                    }
                });
                const json = await response.json();
                json.forEach(ele => {
                    korPkmName.push(ele.kor_name)
                    pkmDexNum.push(ele.pokedex_number)
                });
                // korPkmName = json.map(row => row.kor_name);
                // pkmDexNum = json.map(row => row.pokedex_number);          
            } catch(e) {
                console.error('pkm DB load error', e.message);
            }
            // fullDex.data.forEach(item => {
            //     if (sleepDex.includes(item.en)) {
            //         korPkmName.push(item.kor);
            //         enPkmName.push(item.en);
            //         pkmDexNum.push(item.Ndex)
            //     }
            // });
        }        
    }

    // 저장된 포슬립 포켓몬 데이터에서 원하는 값 찾기
    function searchPkmData(key, value){        
        return lazyPkmData.find(obj => obj[key] == value);
        // return object
    }

    // 한글명으로 도감번호 찾기
    async function findDexNum(p){  
        return pkmDexNum[korPkmName.indexOf(p)]    
    }
    // 선택한 포켓몬의 식재료 이름 찾기 (포켓몬 이름, 몇번째 식재료인지)
    function bringIng(name, place){
        let findIng = ''
        function allIngList(n){
            // array
            return searchPkmData('kor_name', name)[`ingredient${n}`]
        }        
        switch(place){
            case 1:
                findIng= allIngList(0)[0]['name'];
                break;
            case 2:
                if(allIngList(30).length == 1){
                    findIng= allIngList(0)[0]['name'];
                }
                else{
                    findIng= allIngList(30).find(obj => obj['name'] !== allIngList(0)[0]['name'])['name'];
                }
                break;
            case 3:
                if(allIngList(60).length == 1){
                    findIng= allIngList(0)[0]['name'];
                }
                else if(allIngList(60).length == 2){
                    findIng= allIngList(30).find(obj => obj['name'] !== allIngList(0)[0]['name'])['name'];
                }
                else{
                    findIng= allIngList(60).find(obj =>
                        obj['name'] !== allIngList(0)[0]['name'] &&
                        obj['name'] !== allIngList(30).find(obj => 
                            obj['name'] !== allIngList(0)[0]['name'])['name'])['name']
                }
                break;
            default:
                return
        }
        return findIng
    }

    return {
        subSkillList,
        allSubSkillList,
        erbMaxEnergy,
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
        lazyPkmName,        
        teamSubSkillList,
        ribbonList,
        collectSkillCount,
        fetchPkmData,
        loadKorPkmName,
        searchPkmData,        
        findDexNum,
        bringIng,
        apiUrl        
    }
})
