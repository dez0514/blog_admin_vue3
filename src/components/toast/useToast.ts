import { ToastCreator, ToastOptions } from './toastCreator'
const toast = new ToastCreator()
function showToast(opts: ToastOptions) {
  toast.present({...opts})
}
function hideToast() {
  toast.dismiss()
}

export default {
  showToast,
  hideToast
}