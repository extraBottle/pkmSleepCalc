import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProdCalcStore = defineStore('production-calc', ()=> {
    // 성격, 레벨, 서브 적용한 기본 도우미 속도 (기력 제외)
    const onlyBaseSpeed = ref(0)
    const onlyBaseSpeedH = ref(0)
    // 시간에 따른 기력량 모음
    const energyAxis = ref([])
    // 최종 식재료 확률
    const finalIngProc = ref(0)
    const finalIngProcH = ref(0)
    // 최종 스킬 발동 확률
    const finalSkillProc = ref(0)
    const finalSkillProcH = ref(0)
    // 최종 도우미 횟수!!
    const finalSpeedCount = ref(0)
    // 상위 레벨 식재료가 하위 레벨이랑 동일하면 하나로 묶어서 계산한다. 동일한지 확인용
    const checkSecondDisplay = ref(false)
    const checkThirdDisplay = ref(false)
    // 식재료 메인 스킬 보유했는지
    const checkIngSkillDisplay = ref(false)
    // 종류별 식재료량 계산
    const totalIngCalc = ref({})
    // 각 구간별 머무르는 시간 { '0.45' : 500 } 꼴 (sec)
    const timeStaying = ref({})
    // 로딩 화면 관리
    const calcLoading = ref(true)
    // 시간 단위 쪼개기 범위 (지금은 30분 단위) -> 이걸 해당 시간에 곱하면 자동 변환
    const convertH = 2
    const convertM = 1 / 30
    const convertS = 1 / (60 * 30)
    // 시뮬레이션 횟수
    const simulationCount = 10000

    // 식재 확률 계산 return
    function calcIngProc(allData={}, upNature, downNature, upMult, downMult, mySub = []){
        
        const baseProc = allData.ingredientPercentage
         // 보정 성격 확인
         let ingNature = 1.0 
         if(upNature === '식재료 도우미 확률 ▲▲'){
            ingNature = upMult
         }
         else if(downNature === '식재료 도우미 확률 ▽▽'){
            ingNature = downMult
         }
         // 식재료 관련 서브 스킬 갖고 있는지
        let ingSub = 1.0
        for(let i = 0; i < mySub.length; i++){
            if(mySub[i].label === '식재료 확률 업 M' || mySub[i].label === '식재료 확률 업 s'){
                ingSub += mySub[i].mult
            }
        }
        return (baseProc * ingNature * ingSub / 100)
    }
    // 스킬 확률 계산 return
    function calcSkillProc(allData={}, upNature, downNature, upMult, downMult, mySub = []){
        
        const baseProc = allData.skillPercentage
         // 보정 성격 확인
         const skillNature = (upNature === '메인 스킬 발동률 ▲▲' ? upMult : (downNature === '메인 스킬 발동률 ▽▽' ? downMult : 1.0))
         // 스킬 관련 서브 스킬 갖고 있는지
        let skillSub = 1.0
        for(let i = 0; i < mySub.length; i++){
            if(mySub[i].label === '스킬 확률 업 M' || mySub[i].label === '스킬 확률 업 s'){
                skillSub += mySub[i].mult
            }
        }
        return (baseProc * skillNature * skillSub / 100)
    }

    // 기본 스피드 계산 return
    function calcBaseSpeed(level, upNature, downNature, upMult, downMult, hBonus, hbMult, mySub = [], allData={}, maxHS, useGoodCamp){
        // enName = myPkmDBStore.convertKorEn(myInputStore.pkmName)
        // level = myInputStore.pkmLevel
        // upNature = myInputStore.upNature
        // upMult = myInputStore.upMult
        // hBonus = myInputStore.hbCount
        // mySub = myInputStore.subSkills
        // allData = myPkmDBStore.searchPkmData('name', myPkmDBStore.convertKorEn(myInputStore.pkmName))

        // 도우미 보정 성격 확인
        const speedNature = (upNature === '도우미 스피드 ▲▲' ? upMult : (downNature === '도우미 스피드 ▽▽' ? downMult : 1.0))
        // 총 도우미 보너스 개수 확인
        const totalHB = hBonus * hbMult
        // 도우미 관련 서브 스킬 갖고 있는지
        let speedSub = 0
        for(let i = 0; i < mySub.length; i++){
            if(mySub[i].label === '도우미 스피드 M' || mySub[i].label === '도우미 스피드 s'){
                speedSub += mySub[i].mult
            }
        }
        // 서브 스킬 총 합산은 35%까지만 적용
        speedSub = speedSub + totalHB >= maxHS ? maxHS : speedSub + totalHB

        // 포켓몬의 기본 도우미 속도 계산 (기력 제외)
        const multSpeed = (((501 - level) / 500) * speedNature  * (1 - speedSub))    
        const goodCampBoost = useGoodCamp ? 0.8 : 1.0
        return allData.frequency * multSpeed * convertS * goodCampBoost
    }

    function calcEnergyCurve(totalMainSkill, pkmLevel, evoCount, mySub, secondIng, thirdIng, selfSkillLevel, allData, mealRecovery, useGoodCamp, maxE, mainSkillLevel, sleepTime = '', calcVer, skillCount, timeForFull, upNature, downNature, upMult, downMult, erbCount, erbMult, enerPerHour, speedEnerMultList,
        allDataH, evoCountH = 0, mySubH = [], pkmLevelH = 0, secondIngH = '', thirdIngH = '', upNatureH = '', downNatureH = ''){
        // maxE = 150
        // mainSkillLevel = myHealerInputStore.mainSkillLevel
        // sleepTime = mySleepTimeInputStore.sleepTime
        // calcVer = myHealerInputStore.healerSetting
        // skillCount = myHealerInputStore.healSkillCount
        // timeForFull = 디비 스토어에서, 100% 기력 회복에 필요한 수면 시간 (h)
        // erbCount = myInputStore.erbCount
        let enerPerSkill = allDataH.skill.amount[mainSkillLevel - 1]
        let selfPerSkill = allData.skill.amount[selfSkillLevel - 1]
        let splitSleep = sleepTime.split(':')
        const sleepH = parseInt(splitSleep[0], 10)
        const sleepM = parseInt(splitSleep[1], 10)
        // 활동 시간 (30분 단위)
        const activeTime = 24 * convertH - sleepH * convertH - sleepM * convertM 
        // 식사 기력은 점심 - 6시간, 저녁 - a, 취침 - 30분 이렇게 3번 분배한다
        const dinnerX = activeTime - 1
        const lunchX = dinnerX - Math.floor((activeTime - 7 * convertH) / 2)
        const breakfastX = lunchX - 6 * convertH
        function calcMeal(ee){
            for(const ele of mealRecovery){
                if(ee >= ele.e){
                    return ele.m
                }
            }
        }
        // 기력 회복량 구하기
        let recoverNature = 1.0
        if(upNature === '기력 회복량 ▲▲'){
            recoverNature = upMult
            enerPerSkill = Math.floor(enerPerSkill * upMult)
            selfPerSkill = Math.floor(selfPerSkill * upMult)
        }
        else if(downNature === '기력 회복량 ▽▽'){
            recoverNature = downMult
            enerPerSkill = Math.floor(enerPerSkill * downMult)
            selfPerSkill = Math.floor(selfPerSkill * downMult)
        }
        const recoverSub = (erbCount * erbMult) + 1
        let morningEner = (100 / (timeForFull / convertH)) * (sleepH * convertH + sleepM * convertM) * recoverNature * recoverSub
        morningEner = morningEner > 100 ? 100 : Math.floor(morningEner)
        // 자힐몬인지 여부
        let hasSelfHeal = false
        // 순수 자힐 아닌 확률적 자힐은 그만큼 감점
        let strangeHeal = 1
        if(allData.skill.name.includes('Charge Energy')){
            hasSelfHeal = true
            strangeHeal = 1
        }
        else if(allData.skill.name.includes('Energizing Cheer')){
            hasSelfHeal = true
            strangeHeal = 5
        }
        else if(allData.skill.name.includes('Metronome')){
            hasSelfHeal = true
            strangeHeal = (totalMainSkill - 1) / (6/5)
        }
        function limitE(ee){
            // 최대 기력 제한
            return ee > maxE ? maxE : ee
        }
        // 라이트 버전은 일반 기력 감소 그래프에 같은 간격만큼 힐을 추가하는 단순한 방식. 단, 첫 힐은 무조건 기상 직후
        // 힐러 없음도 여기서 계산
        if(calcVer !== 'proVer'){
            // 기상 직후 스킬 발동 전 기력량
            energyAxis.value.push({
                x: 0,
                y: morningEner
            })            
            // 스킬 간 간격 (일정한 간격으로 발동. 기상 직후 스킬 발동 확정)
            const timePerAct = Math.floor(activeTime / skillCount)
            // 자힐 사용 횟수
            let selfHealCount = 1         
            if(hasSelfHeal){
                selfHealCount = Math.round(skillCount * (allData.skillPercentage / allDataH.skillPercentage) * (allDataH.frequency / allData.frequency) / strangeHeal)
            }
            const timePerSelf = Math.floor(activeTime / selfHealCount)
            function energyCurve(z, s = 1, eSkill = enerPerSkill){
                let energyValue = 0;                
                if(calcVer !== 'lightVer'){
                    // 힐러 없음
                    eSkill = 0
                }
                if(z === 0){
                    // 처음엔 직전 기력이 없으므로 = 기상 직후
                    energyValue = morningEner + eSkill;
                }
                else{
                    if(energyAxis.value[energyAxis.value.length - 1].y <= 0){
                        // 직전 시간대의 기력이 0이 아닌지
                        energyValue = eSkill * s;
                    }
                    else{
                        energyValue = energyAxis.value[energyAxis.value.length - 1].y + eSkill * s - Math.floor((enerPerHour / convertH));
                    }
                }
                switch(energyValue){
                    case energyValue > maxE:
                        return maxE;
                    case energyValue < 0:
                        return 0;
                    default:
                        return energyValue;
                }
            }
            let skillLeft = skillCount
            for(let i = 0; i < activeTime + 1; i++){
                // 스킬 발동하지 않은 현재 기력   
                let beforeE = energyCurve(i, 0)  
                energyAxis.value.push({
                    'x': i,
                    'y': beforeE
                })
                if(i === 0){
                    skillLeft -= 1
                }                
                if(i === breakfastX || i === lunchX || i === dinnerX){
                    // 식사 기력 회복                                                                           
                    energyAxis.value.push({
                        'x': i,
                        'y': limitE(beforeE + calcMeal(beforeE))
                    })                    
                }     
                if(calcVer === 'lightVer' && i > 0){
                    if(hasSelfHeal && i % timePerSelf === 0 && selfHealCount > 0){
                        // 자힐 발동 후 현재 기력
                        let currentE = energyCurve(i, 1, selfPerSkill)                                 
                        energyAxis.value.push({
                            'x': i,
                            'y': limitE(currentE)
                        })
                        selfHealCount -= 1
                    }
                    if(i % timePerAct === 0 && skillLeft > 0){
                        // 스킬 발동 후 현재 기력
                        let currentE = energyCurve(i)                                 
                        energyAxis.value.push({
                            'x': i,
                            'y': limitE(currentE)
                        })
                        skillLeft -= 1
                    }
                }
            }
        }
        else if(calcVer === 'proVer'){
            // 혹시 몰라서 좌표값 초기화
            energyAxis.value = []
            // timeStaying.value = {}

            // 힐러 본인의 기력 회복량 구하기
            let enerPerSkillH = allDataH.skill.amount[mainSkillLevel - 1]
            let recoverNatureH = 1.0
            if(upNatureH === '기력 회복량 ▲▲'){
                recoverNatureH = upMult
                enerPerSkillH = Math.floor(enerPerSkillH * upMult)
            }
            else if(downNatureH === '기력 회복량 ▽▽'){
                recoverNatureH = downMult
                enerPerSkillH = Math.floor(enerPerSkillH * downMult)
            }
            // 힐러 본인의 기상 직후 기력
            let morningEnerH = (100 / (timeForFull / convertH)) * (sleepH * convertH + sleepM * convertM) * recoverNatureH * recoverSub
            morningEnerH = morningEnerH > 100 ? 100 : morningEnerH            
            // 힐러의 1 시간대 전 기력 상태 추적
            let healerEnerAxis = morningEnerH
            // monte carlo simulation            
            // 기상 직후 스킬 발동 확률. 시뮬 돌릴수록 값이 변한다. 우선 80%로 시작
            let morningProc = 0.8
            let morningProcS = 0.4
            // 시뮬 결과 매초 y값(기력). 계산이 끝나면 기댓값을 구한다.
            function calcExpect(z, sec, newE){
                let limitMaxE = newE > maxE ? maxE : newE
                if(z > 0){                    
                    // energyAxis.value[sec].x = sec
                    energyAxis.value[sec].y = (energyAxis.value[sec].y * z + limitMaxE) / (z + 1)
                }else{
                    energyAxis.value.push({
                        'x': sec,
                        'y': limitMaxE
                    })
                }
            }
            function energyCurve(sec){
                // 스킬 안쓴 현재 기력 구하기
                let energyValue = 0;
                
                // 힐러 기력 구하기
                if(healerEnerAxis > 0){
                    // 자연 감소 기력
                    healerEnerAxis = (healerEnerAxis - (1 * (enerPerHour / convertH)));
                    if(healerEnerAxis > maxE){
                        // 기력 100보다 크면 100. 근데 이론상 불가능함
                        healerEnerAxis = maxE
                    }
                }
                if(healerEnerAxis <= 0){
                    // 기력 0보다 작으면 0
                    healerEnerAxis = 0
                }
            
                if(energyAxis.value[sec - 1].y > 0){
                    energyValue = (energyAxis.value[sec - 1].y - (1 * (enerPerHour / convertH)));
                    if(energyValue > maxE){
                        energyValue = maxE
                    }
                }
                if(energyValue < 0){
                    return 0
                }                
                return energyValue;
            }
        
            for(let z = 0; z < simulationCount; z++){
                // 기상 직후 스킬 발동 했는지 여부
                if(Math.random() < morningProc){
                    healerEnerAxis += enerPerSkillH
                    if(Math.random() < morningProcS){
                        calcExpect(z, 0, limitE(morningEner + selfPerSkill + enerPerSkill))
                    }   
                    else{
                        calcExpect(z, 0, limitE(morningEner + enerPerSkill))
                    }
                }   
                else{
                    if(Math.random() < morningProcS){
                        calcExpect(z, 0, limitE(morningEner + selfPerSkill))
                    }   
                    else{
                        calcExpect(z, 0, limitE(morningEner))
                    }
                }
                // 1 도우미 사이클 계산용
                let manageBaseSpeed = onlyBaseSpeedH.value
                let manageBaseSpeedS = onlyBaseSpeed.value                

                for(let sec = 1; sec < activeTime + 1; sec++){
                    // 우선 정해진 공식대로 기력 감소 (1시간에 6%)
                    // 도우미 1회 쿨타임 돌았는지 계산한다
                    // 1 시간대 도우미량은 시작 지점의 기력을 따른다
                    // 해당 시간대의 기력에서 도우미 보정치를 곱해서 도우미 쿨을 감소시킨다
                    // 스킬 발동하면 기력을 증가한 값을 저장한다
                     
                    // 직전 시간대의 힐러 기력량
                    const beforeHealerE = healerEnerAxis
                    // 스킬 발동 없을 때 현재 기력량. 힐러도 기력량 업데이트 됨
                    let trySkillE = energyCurve(sec)
                    let enrBoundary = 0
                    // 현재 기력에 따른 속도 배율
                    function speedPerEner(e){
                        for(let z = 0; z < speedEnerMultList.length; z++){
                            if(e > speedEnerMultList[z].e){
                                enrBoundary = speedEnerMultList[z].e
                                return speedEnerMultList[z].m
                            }                            
                        }
                        // 아무데도 걸리는데 없으면 제일 낮은 보정치
                        return speedEnerMultList[speedEnerMultList.length - 1].m
                    }   
                    // 주어진 에너지 구간의 경계선에 있는 시간대 x값 찾기
                    function findTimeStamp(start, startE, targetE){
                        return (startE - targetE) / (enerPerHour / convertH) + start
                    } 
                    // 힐러의 1 시간대 어치 도우미 쿨타임 감소분을 계산한다
                    const endMult = speedPerEner(healerEnerAxis)
                    const startMult = speedPerEner(beforeHealerE)   
                    
                    // 30분 안에 발생한 도우미 횟수
                    let helpActiveCount = 0
                    
                    // 한 시간대 안에서 도우미 보정 구간은 최대 2개까지만 존재한다고 가정
                    if(endMult !== startMult){
                        let startRange = findTimeStamp(sec - 1, beforeHealerE, enrBoundary) - (sec - 1)
                        manageBaseSpeed = manageBaseSpeed - (startRange / startMult + (1 - startRange) / endMult) % onlyBaseSpeedH.value
                        helpActiveCount = Math.floor((startRange / startMult + (1 - startRange) / endMult) / onlyBaseSpeedH.value)
                    }
                    else{
                        manageBaseSpeed = manageBaseSpeed - (1 / startMult) % onlyBaseSpeedH.value
                        helpActiveCount = Math.floor((1 / startMult) / onlyBaseSpeedH.value)
                    }     
                    if(manageBaseSpeed <= 0){
                        // 위에선 한방에 도우미 여러번 발동하는 횟수고, 여기선 천천히 모아서 도우미 발동시켰을때
                        helpActiveCount += 1
                        manageBaseSpeed += onlyBaseSpeedH.value
                    } 
                    if(hasSelfHeal){
                        // 자힐몬 스킬 발동 계산
                        let helpActiveCountS = 0
                        const endMultS = speedPerEner(trySkillE)
                        const startMultS = speedPerEner(energyAxis.value[sec - 1].y)   
                        if(endMultS !== startMultS){
                            let startRange = (findTimeStamp(sec - 1, energyAxis.value[sec - 1].y, enrBoundary)) - (sec - 1)
                            manageBaseSpeedS = manageBaseSpeedS - (startRange / startMultS + (1 - startRange) / endMultS) % onlyBaseSpeed.value
                            helpActiveCountS = Math.floor((startRange / startMultS + (1 - startRange) / endMultS) / onlyBaseSpeed.value)
                        }
                        else{
                            manageBaseSpeedS = manageBaseSpeedS - (1 / startMult) % onlyBaseSpeedH.value
                            helpActiveCountS = Math.floor((1 / startMult) / onlyBaseSpeedH.value)
                        }  
                        if(manageBaseSpeedS <= 0){
                            // 위에선 한방에 도우미 여러번 발동하는 횟수고, 여기선 천천히 모아서 도우미 발동시켰을때
                            helpActiveCountS += 1
                            manageBaseSpeedS += onlyBaseSpeed.value
                        }
                        // 근데 30분보다 짧은 도우미속도면 30분 안에 도우미 여러번 발동 가능!                                    
                        const selfProc = (1 - Math.pow((1 - finalSkillProc.value / strangeHeal), helpActiveCountS))
                        if(helpActiveCountS > 0){
                            // 1 도우미 발동
                            if(Math.random() < selfProc){
                                // 스킬 발동 적용한 기력량
                                trySkillE += selfPerSkill                                
                            }                           
                        }     
                    }             
                                    
                    // 근데 30분보다 짧은 도우미속도면 30분 안에 도우미 여러번 발동 가능!                                    
                    const healerProc = 1 - Math.pow((1 - finalSkillProcH.value), helpActiveCount)
                    if(sec === breakfastX || sec === lunchX || sec === dinnerX){
                        // 식사 기력 회복                                                       
                        trySkillE += calcMeal(trySkillE)
                        healerEnerAxis += calcMeal(healerEnerAxis)
                    }  
                    if(helpActiveCount > 0){
                        // 1 도우미 발동
                        if(Math.random() < healerProc){
                            // 스킬 발동 적용한 기력량
                            trySkillE += enerPerSkill
                            healerEnerAxis += enerPerSkillH
                        }                           
                    } 
                    // 현재 기력량을 같은 타임라인의 기댓값에 추가                 
                    calcExpect(z, sec, limitE(trySkillE))                    

                    // 수면하기 직전 상태 계산
                    if(sec === activeTime){
                        let beforeSleepH = healerEnerAxis
                        // 수면 기력 회복 적용 안된 기상 직후 기력
                        let consumeE = 0
                        if(trySkillE - Math.ceil((enerPerHour / convertH) * (sleepH * convertH + sleepM * convertM)) < 0){
                            consumeE = 0
                        }
                        else{
                            consumeE = trySkillE - Math.ceil((enerPerHour / convertH) * (sleepH * convertH + sleepM * convertM))
                        }                        
                        if(healerEnerAxis - Math.ceil((enerPerHour / convertH) * (sleepH * convertH + sleepM * convertM)) < 0){
                            healerEnerAxis = 0
                        }
                        else{
                            healerEnerAxis = healerEnerAxis - Math.ceil((enerPerHour / convertH) * (sleepH * convertH + sleepM * convertM))
                        }
                        // 기상 기력 (수면 기력 회복 적용)
                        morningEner = consumeE + morningEner > 100 ? 100 : consumeE + morningEner
                        healerEnerAxis = healerEnerAxis + morningEnerH > 100 ? 100 : healerEnerAxis + morningEnerH
                        if(hasSelfHeal){
                            // 자힐 수면 중 전체 도우미
                            const totalCountHelpS = calcSleepSpeedCount(sleepTime, trySkillE,
                                speedEnerMultList, allData, evoCount, mySub, pkmLevel, secondIng, thirdIng, enerPerHour, useGoodCamp)
                            // 기상 직후 스킬 발동률 업데이트
                            morningProcS = 1 - Math.pow((1 - finalSkillProc.value / strangeHeal), totalCountHelpS)
                        }                        
                        // 힐러 수면 중 전체 도우미 횟수 기댓값
                        const totalCountHelpH = calcSleepSpeedCount(sleepTime, beforeSleepH,
                            speedEnerMultList, allDataH, evoCountH,
                            mySubH, pkmLevelH, secondIngH, thirdIngH, enerPerHour, 'healer', useGoodCamp)
                        // 기상 직후 스킬 발동률 업데이트
                        morningProc = 1 - Math.pow((1 - finalSkillProcH.value), totalCountHelpH)
                        
                    }  
                }                
            }            
        }        
    }
    // 기력을 도우미 속도에 대입해서 총 도우미 횟수 계산
    function calcSpeedWithEner(speedEnerMultList = [], calcVer="target", enerPerHour){
        // speedEnerMultList = pkmDbStore 에서 [ {'e': 80, 'm': 0.45} ] 꼴

        // (각 구간별 머무르는 시간 / 그 시간대의 배율)의 합을 기본 도우미 속도로 나누면 끝
        
    
        timeStaying.value = {}
        speedEnerMultList.forEach(ele => {
            timeStaying.value[ele.m] = 0
        })

        let enrOverThis = 0  
        // 현재 기력에 따른 속도 배율
        function speedPerEner(ee){
            for(let z = 0; z < speedEnerMultList.length; z++){
                if(ee > speedEnerMultList[z].e){
                    enrOverThis = speedEnerMultList[z].e
                    return speedEnerMultList[z].m
                }
            }
            enrOverThis = speedEnerMultList[speedEnerMultList.length - 1].e
            return speedEnerMultList[speedEnerMultList.length - 1].m
        }

        // 주어진 에너지 구간의 경계선에 있는 시간대 x값 찾기
        function findTimeStamp(start, end, targetE){
            return (targetE - energyAxis.value[start].y) / ((energyAxis.value[start].y - energyAxis.value[end].y) / (energyAxis.value[start].x - energyAxis.value[end].x)) + energyAxis.value[start].x
        }        
        // 에너지 그래프를 구간별로 쪼개서 머무르는 시간 계산
        for(let i = 0; i < energyAxis.value.length - 1; i++){
            // 양끝점이 같은 에너지 구간에 있는지 확인하고
            // 그러면 굳이 더 쪼갤필요없이 통채로 계산
            // 양끝점이 다른 구간에 있으면 그때 경계선 찾기
            // 경계선의 x축, 즉 시간대를 찾아

            // x값이 같은 구간, 즉 미분 불가능 점은 스킵한다
            if(energyAxis.value[i].x !== energyAxis.value[i + 1].x){
                let endMult = speedPerEner(energyAxis.value[i + 1].y)                
                let startTime = energyAxis.value[i].x
                let notAllDivided = true
                let boundary = energyAxis.value[i + 1].x
                
                if(calcVer === 'proVer' && energyAxis.value[i].y <= energyAxis.value[i + 1].y){
                    // pro ver에선 기력 증가의 미분 불가능점이 없다. 따라서 직전보다 기력이 상승햇을 경우가 미분 불가능 점
                    endMult = speedPerEner(energyAxis.value[i].y - (enerPerHour / convertH) * (energyAxis.value[i + 1].x - energyAxis.value[i].x))
                }
                let startMult = speedPerEner(energyAxis.value[i].y)
                while(notAllDivided){                                        
                    if(startMult === endMult){
                        // 양끝점이 같은 기력 구간
                        timeStaying.value[startMult] += energyAxis.value[i + 1].x - startTime
                        notAllDivided = false
                    }                    
                    else{
                        // 보정 구간 바뀌는 그 지점 x 값 찾기
                        boundary = findTimeStamp(i, i + 1, enrOverThis)
                        timeStaying.value[startMult] += boundary - startTime
                        startMult = speedPerEner(enrOverThis)
                        startTime = boundary
                        // timeStaying.value[endMult] += energyAxis.value[i + 1].x - boundary
                    }
                }
                
                
            }
        }
        

        // 모든 구간 별 시간 더하기
        let addAllTime = 0.0
        for(let key in timeStaying.value){
            addAllTime += timeStaying.value[key] / parseFloat(key)
        }
        finalSpeedCount.value = Math.floor(addAllTime / onlyBaseSpeed.value)
        calcLoading.value = false        
    }
    // 식재료 종류별 생산량 계산
    function calcLeveLIng(totalMainSkill, inSleep = false, allData = {}, level, firstIng, secondIng, thirdIng, sleepTime, enerPerHour, speedEnerMultList, evoCount, mySub, useGoodCamp, mainSkillLevel){
        
        // 수면 중에 물어오는 식재료 구하기용 수면 도우미 횟수 (최대 소지 수 안에서)
        const helpCountSleep = calcSleepSpeedCount(sleepTime, energyAxis.value[energyAxis.value.length - 1].y, speedEnerMultList, allData, evoCount, mySub, level, secondIng, thirdIng, enerPerHour, useGoodCamp)        
        // 특정 레벨 식재량 찾기 30렙 이상만
        function findAmount(n, l){
            let levAmount= 0
            if(l < 30){
                levAmount = allData[`ingredient${l}`].amount
            }
            else{
                levAmount = allData[`ingredient${l}`].find(obj => obj.ingredient.longName === n).amount
            }            
            if(inSleep){
                return (helpCountSleep * finalIngProc.value * levAmount)
            }
            else{
                return ((finalSpeedCount.value + helpCountSleep) * finalIngProc.value * levAmount)
            }
        }
        
        // 30렙 미만 일때 식재량
        totalIngCalc.value[firstIng] = findAmount(firstIng, 0)
        if(level >= 30){
            if(secondIng === firstIng){
                // 30렙 이상인데 1 = 2
                totalIngCalc.value[firstIng] = ((totalIngCalc.value[firstIng] + findAmount(secondIng, 30)) / 2)
                checkSecondDisplay.value = false
                
            }   
            else{
                // 30렙 이상인데 1, 2
                totalIngCalc.value[firstIng] = (totalIngCalc.value[firstIng] / 2)
                totalIngCalc.value[secondIng] = (findAmount(secondIng, 30) / 2)
                checkSecondDisplay.value = true
                
            }
            if(level >= 60){
                totalIngCalc.value[firstIng] = (totalIngCalc.value[firstIng] * 2 / 3)
                if(firstIng === secondIng){
                    if(thirdIng !== secondIng){
                        // 60렙 이상인데 1 = 2, 3
                        totalIngCalc.value[thirdIng] = (findAmount(thirdIng, 60) / 3)
                        checkThirdDisplay.value = true
                    }
                    else{
                        // 60렙 이상, 1 = 2 = 3
                        totalIngCalc.value[firstIng] = (totalIngCalc.value[firstIng] + findAmount(thirdIng, 60) / 3)
                        checkThirdDisplay.value = false
                    }
                }
                else{
                    totalIngCalc.value[secondIng] = (totalIngCalc.value[secondIng] * 2 / 3)
                    if(thirdIng === firstIng){
                        // 60렙, 1 = 3, 2
                        totalIngCalc.value[firstIng] = (totalIngCalc.value[firstIng] + findAmount(thirdIng, 60) / 3)
                        checkThirdDisplay.value = false
                    }
                    else if(thirdIng === secondIng){
                        // 60렙, 1, 2 = 3
                        totalIngCalc.value[secondIng] = (totalIngCalc.value[secondIng] + findAmount(thirdIng, 60) / 3)
                        checkThirdDisplay.value = false
                    }
                    else{
                        // 60lev, 1, 2, 3
                        totalIngCalc.value[thirdIng] = (findAmount(thirdIng, 60) / 3)
                        checkThirdDisplay.value = true
                    }
                }
            }
        }
        // 메인 스킬 식재 스킬일 경우 식재량에 추가
        if(allData.skill.unit === 'ingredients' || allData.skill.name === "Metronome"){
            // 총 식재료 종류
            (async()=>{
                try{
                    const response = await fetch('https://api.sleepapi.net/api/ingredient')
                    const json = await response.json() 
                    const divideExpect = allData.skill.name === "Metronome" ? (totalMainSkill - 1) : 1
                    // 스킬 한번당 가져오는 종류당 식재료량                  
                    const ingPerSkill = Math.ceil(allData.skill.amount[mainSkillLevel - 1] / 3)
                    // 특정 식재료가 스킬 한번에 나올 확률
                    const expectOne = 1 - (1 - 1/json.length) * (1 - 1/(json.length - 1)) * (1 - 1/(json.length - 2))
                    const addIngSkill = (finalSpeedCount.value + helpCountSleep) * finalSkillProc.value * ingPerSkill * expectOne / divideExpect            
                    checkIngSkillDisplay.value = true
                    // 식재 메인 스킬 발동만큼 식재량 증가                    
                    totalIngCalc.value[firstIng] += addIngSkill
                    if(totalIngCalc.value.hasOwnProperty(secondIng)){
                        totalIngCalc.value[secondIng] += addIngSkill
                    }
                    if(totalIngCalc.value.hasOwnProperty(thirdIng)){
                        totalIngCalc.value[thirdIng] += addIngSkill
                    }
                    totalIngCalc.value['all'] = addIngSkill                  
                }
                catch(err){
                    console.log('ing Fetch problem: ' + err.message)
                }
            })()
        }        
    }
    // 잘때 도우미 횟수 return (단, 소지수 초과한 열매 only 도우미는 계산 X)
    function calcSleepSpeedCount(sleepTime, energyBeforeSleep, speedEnerMultList, allData, evoCount, mySub, pkmLevel, secondIng, thirdIng, enerPerHour, target='target', useGoodCamp){
        let splitSleep = sleepTime.split(':')
        const sleepH = parseInt(splitSleep[0], 10)
        const sleepM = parseInt(splitSleep[1], 10)
        // 수면 중 도우미 보정 머무르는 시간
        let mini = {}
        speedEnerMultList.forEach(ele => {
            mini[ele.m] = 0
        })
        // 직전 기력의 보정 구간대
        let enrOverThis = 0  
        // 현재 기력에 따른 속도 배율
        function speedPerEner(e){
            for(let z = 0; z < speedEnerMultList.length; z++){
                if(e > speedEnerMultList[z].e){
                    enrOverThis = speedEnerMultList[z].e
                    return speedEnerMultList[z].m
                }
            }
            // 기력이 0이면 보정 없음
            enrOverThis = 0
            return speedEnerMultList[speedEnerMultList.length - 1].m
        }
        let currentMult = speedPerEner(energyBeforeSleep)
        // 수면 직후가 시간 0
        let startX = 0
        // 직전 기력 보정 구간이 끝나는 경계선 시간
        let endX = (energyBeforeSleep - enrOverThis) / ((enerPerHour / convertH))
        // 기력이 0이 되기전까지 계속 머무르는 시간 계산
        while(currentMult !== speedEnerMultList[speedEnerMultList.length - 1].m){
            mini[currentMult] += endX - startX
            // 특정 기력 구간 머무르는 시간 계산하면, 그 아래 기력 구간으로 넘어가서 계산 반복
            currentMult = speedPerEner(enrOverThis)
            startX = endX
            endX = (energyBeforeSleep - enrOverThis) / ((enerPerHour / convertH))
        }
        // 한번 기력 0에 도달하면 기상까지 전부 0
        endX = sleepH * convertH + sleepM * convertM
        mini[currentMult] += endX - startX
        // 모든 구간 별 시간 더하기
        let addAllTime = 0.0
        for(let key in mini){
            addAllTime += mini[key] / parseFloat(key)
        }
        let miniSpeedCount = 0
        // 수면 중 도우미 횟수 (힐러 & 목표 포켓몬 선택)
        if(target === 'target'){
             miniSpeedCount = Math.floor(addAllTime / onlyBaseSpeed.value)
        }
        else{
            miniSpeedCount = Math.floor(addAllTime / onlyBaseSpeedH.value)
        }
        //나무열매수 서브 보유 여부
        let hasBerry = false

        const goodCampBoost = useGoodCamp ? 1.2 : 1.0
        // 최대 소지 수 계산        
        let inventorySize = (allData['carrySize'] + evoCount * 5) * goodCampBoost
        for(let r = 0; r < mySub.length; r++){
            if(mySub[r].label === '최대 소지 수 업 L' || mySub[r].label === '최대 소지 수 업 M' || mySub[r].label === '최대 소지 수 업 s'){
                inventorySize += mySub[r].mult
            }
            else if(mySub[r].label === '나무열매 수 s'){
                hasBerry = true
            }
        }                
        // 식재료 기댓값 만큼을 빼야함, 나무열매수 서브 있으면 또 반토막
        // 식재료 별 개수랑 나무열매수 있는지 부터
        // 특정 레벨 식재량 찾기 30렙 이상만
        function findAmount(n, l){
            let levAmount= allData[`ingredient${l}`].find(obj => obj.ingredient.longName === n).amount
            return levAmount
        }
        // 레벨 별 식재료 개수 / 비율
        let firstIngRatio = 0
        let secondIngRatio = 0
        let thirdIngRatio = 0
        let levelCut = 1
        switch(true){
            case pkmLevel >= 60:
                levelCut = 3;
                // 1 도우미 당 가져오는 식재료 기댓값
                firstIngRatio = (allData['ingredient0'].amount * finalIngProc.value / levelCut)
                secondIngRatio = (findAmount(secondIng, 30) * finalIngProc.value / levelCut)
                thirdIngRatio = (findAmount(thirdIng, 60) * finalIngProc.value / levelCut)
                break;
            case pkmLevel >= 30:
                levelCut = 2;      
                firstIngRatio = (allData['ingredient0'].amount * finalIngProc.value / levelCut)
                secondIngRatio = (findAmount(secondIng, 30) * finalIngProc.value / levelCut)
                break;          
            default:
                levelCut = 1;
                firstIngRatio = (allData['ingredient0'].amount * finalIngProc.value / levelCut)
        }
        // 식재료 기댓값 -> 식재 확률 * 한번에 가져오는 개수 / 레벨대 경쟁자
        // 문제는 이게 힐러라는거지
        // 그말인 즉슨 힐러도 식재료를 골라야한다
        let berryCount = 1
        if(allData["specialty"] === 'berry'){
            // 열매 특화
            berryCount += 1
        }
        if(hasBerry){
            // 나무열매수 서브
            berryCount += 1
        }
        // 1 도우미 당 가져오는 나무열매 기댓값
        const berryRatio = (berryCount * (1 - finalIngProc.value))
        // 잠잘 동안 스킬 발동의 가능성이 있는 횟수 기댓값
        if(Math.ceil(inventorySize / (berryRatio + firstIngRatio + secondIngRatio + thirdIngRatio)) > miniSpeedCount){
            return miniSpeedCount
        }
        else{            
            return  Math.ceil(inventorySize / (berryRatio + firstIngRatio + secondIngRatio + thirdIngRatio))
        }
    }

    function clearCalc(){
        onlyBaseSpeed.value = 0
        onlyBaseSpeedH.value = 0
        energyAxis.value = []
        finalSpeedCount.value = 0
        finalIngProc.value = 0
        finalIngProcH.value = 0
        finalSkillProc.value = 0
        finalSkillProcH.value = 0        
        checkSecondDisplay.value = false
        checkThirdDisplay.value = false
        checkIngSkillDisplay.value = false
        calcLoading.value = true
        totalIngCalc.value = {}
        timeStaying.value = {}
    }

    return {
        onlyBaseSpeed,
        onlyBaseSpeedH,
        energyAxis,
        finalSpeedCount,
        finalIngProc,
        finalIngProcH,
        finalSkillProc,
        finalSkillProcH,
        checkSecondDisplay,
        checkThirdDisplay,
        checkIngSkillDisplay,
        totalIngCalc,
        timeStaying,
        calcLoading,
        convertH,
        convertM,
        convertS,
        simulationCount,
        calcIngProc,
        calcBaseSpeed,
        calcEnergyCurve,
        calcSpeedWithEner,
        clearCalc,
        calcSleepSpeedCount,
        calcLeveLIng,
        calcSkillProc
    }
})