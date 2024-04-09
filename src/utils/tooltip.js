import { useQuasar } from 'quasar'

function tooltipMobile(){
  // 모바일에선 툴팁 클릭 시 1초간 사라지지 않는다
  const $q = useQuasar()
  return $q.platform.is.mobile ? 1000 : 0
}

export { tooltipMobile };