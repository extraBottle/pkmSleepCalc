import { defineStore } from 'pinia';

export const useRouteStore = defineStore('manage-route', ()=> {

    const linksList = [
        {
            title: 'exp 계산기',
            caption: '렙업에 필요한 사탕 & 꿈조량을 알아보세요',
            icon: 'images/handycandym.png',
            name: '포슬립 exp 계산기',
            help: '레벨업에 필요한 사탕과 꿈의 조각 개수를 계산합니다.'
        },
        {
            title: '이브이 최적 진화 찾기',
            caption: '이브이 진로상담 해드립니다',
            icon: 'images/eeveeLink.png',
            name: '이브이 최적 진화 찾기',
            help: '내 이브이에게 적합한 진화체를 추천해드립니다.'
        },
        {
            title: '식재료 생산량 계산기',
            caption: '내 포켓몬은 식재료를 얼마나 모아올까?',
            icon: 'images/fancyapple.png',
            name: '포슬립 생산량 계산기',
            help: '내 포켓몬의 하루/한끼 당 식재료 생산량을 계산합니다.'
        },
        {
            title: '개체값 측정기',     
            caption: '제 전투력은 53만입니다만?',                  
            icon: 'images/kingsrock.png',
            name: '포슬립 개체값 평가',
            help: '동일 개체 대비 내 포켓몬의 등수를 매기고 하루 총 생산량을 계산합니다.'
        },
        {
            title: '비밀 도감',     
            caption: '게임내 숨겨진 정보까지!',                  
            icon: 'images/pokebiscuit.png',
            name: '포슬립 비밀 도감',
            help: '포켓몬의 기본 정보는 물론, "스킬 발동 확률" 등 숨겨진 정보까지 열람합니다.'
        }
    ]
    return {
        linksList
    }
})