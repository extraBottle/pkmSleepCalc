import { Loading, QSpinnerHourglass } from 'quasar'

function loadingCalc(msg='') {
  
  Loading.show({
    spinner: QSpinnerHourglass,
    // spinnerColor: 'primary',
    message: msg
  })
}
function stopLoading() {
  
  Loading.hide()
}

export { loadingCalc, stopLoading };