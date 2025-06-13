

const routes = [
  {
    // 시작 페이지
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 계산기 허브', component: () => import('pages/IndexPage.vue'),
        meta: { help: 'exp 계산부터 개체값 측정까지! 당신의 포켓몬을 완벽 분석해드립니다' }
       }
    ],
  },
  {
    // 이브이 진화 추천
    path: '/eeveelution',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '이브이 최적 진화 찾기', component: () => import('pages/EeveelutionPage.vue'),
        meta: {
          title: '이브이 최적 진화 찾기',
          caption: '이브이 진로상담 해드립니다',
          icon: 'images/eeveeLink.png',          
          help: '내 이브이에게 적합한 진화체를 추천해드립니다.',
          shortName: '이브이'
        }
       }      
    ],
  },
  {
    // exp 계산기
    path: '/expcalc',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 exp 계산기', component: () => import('pages/ExpCalcPage.vue'),
        meta: {
          title: 'exp 계산기',
          caption: '렙업에 필요한 사탕 & 꿈조량을 알아보세요',
          icon: 'images/handycandym.png',          
          help: '포켓몬의 레벨업에 필요한 사탕과 꿈의 조각 개수를 계산합니다.',
          shortName: 'exp'
        }
       }      
    ],
  },
  {
    // 개체값 평가
    path: '/rate',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 개체값 평가', component: () => import('pages/RatePage.vue'),
        meta: {
          title: '개체값 측정기',     
          caption: '제 전투력은 53만입니다만?',                  
          icon: 'images/kingsrock.png',          
          help: '동일 개체 대비 내 포켓몬의 등수를 매기고 하루 총 생산량을 계산합니다.',
          shortName: '개체값'
        }
       }
    ],
  },
  {
    // 식재료 생산량 계산기
    path: '/prodcalc',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 생산량 계산기', component: () => import('pages/ProdCalcPage.vue'),
        meta: {
          title: '식재료 생산량 계산기',
          caption: '내 포켓몬은 식재료를 얼마나 모아올까?',
          icon: 'images/fancyapple.png',          
          help: '내 포켓몬의 하루 & 한끼 당 식재료 생산량을 계산합니다.',
          shortName: '식재료'
        }
       },
      { path: 'result', name: '생산량 계산 결과', component: () => import('pages/ResultPage.vue') }      
    ],
  },
  {
    // 포슬립 도감
    path: '/dex',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 비밀 도감', component: () => import('pages/SleepDexPage.vue'),
        meta: {
          title: '비밀 도감',     
          caption: '게임내 숨겨진 정보까지!',                  
          icon: 'images/pokebiscuit.png',          
          help: '포켓몬의 기본 정보는 물론, "스킬 발동 확률" 등 숨겨진 정보까지 열람합니다.',
          shortName: '도감'
        }
       }
    ],
  },

  // 테스트용
  // {
  //   path: '/test',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', name: 'tttt', component: () => import('pages/TestPage.vue'),
  //       meta: { help: 'exp 계산부터 개체값 측정까지! 당신의 포켓몬을 완벽 분석해드립니다' }
  //      }
  //   ],
  // },

  // 점검용
  // {
  //   path: '/maintenance',
  //   name: 'maintenance',
  //   component: () => import('pages/MaintenancePage.vue'),
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'error',
    component: () => import('pages/ErrorNotFound.vue'),
  }
]

export default routes
