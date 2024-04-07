import { Notify } from 'quasar'

function popupSuccess(msg) {
  //수정하기 버튼 누르고 업데이트가 완료되면 뜨는 팝업
  Notify.create({
    color: 'green-4',
    textColor: 'white',
    icon: 'task_alt',
    message: msg
  })
}

function popupFail(msg) {
  //수정하기 버튼 누르고 업데이트가 실패하면 뜨는 팝업
  Notify.create({
    color: 'red-4',
    textColor: 'white',
    icon: 'block',
    message: msg
  })
}

export { popupSuccess, popupFail };