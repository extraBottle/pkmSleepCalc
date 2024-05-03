

const routes = [
  {
    // 시작 페이지
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 계산기 허브', component: () => import('pages/IndexPage.vue') }
    ],
  },
  {
    // 이브이 진화 추천
    path: '/eeveelution',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '이브이 최적 진화 찾기', component: () => import('pages/EeveelutionPage.vue') }      
    ],
  },
  {
    // exp 계산기
    path: '/expcalc',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 exp 계산기', component: () => import('pages/ExpCalcPage.vue') }      
    ],
  },
  {
    // 식재료 생산량 계산기
    path: '/prodcalc',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 생산량 계산기', component: () => import('pages/ProdCalcPage.vue') },
      { path: 'result', name: '생산량 계산 결과', component: () => import('pages/ResultPage.vue') }      
    ],
  },
  {
    // 개체값 평가
    path: '/rate',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 개체값 평가', component: () => import('pages/RatePage.vue') }
    ],
  },
  {
    // 포슬립 도감
    path: '/dex',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '포슬립 비밀 도감', component: () => import('pages/SleepDexPage.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'error',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
