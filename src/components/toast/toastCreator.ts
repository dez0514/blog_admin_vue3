import { h, render } from "vue"
import Toast from "./toast.vue"
type POSITION = 'top' | 'middle' | 'bottom'
export interface ToastOptions {
  message: string;
  position?: POSITION;
  duration?: number;
  color?: string;
  bgColor?: string;
}
export class ToastCreator {
  container: HTMLElement;
  constructor() {
    this.container = document.createElement('div')
    this.container.setAttribute('id', 'custom-toast-container')
  }
  present(opts: ToastOptions) {
    const myToast = h(h(Toast), { ...opts })
    render(myToast, this.container)
    document.body.insertBefore(this.container, document.body.firstChild)
    const dur = opts.duration || 2000
    const timer = setTimeout(() => {
      clearTimeout(timer)
      this.dismiss()
    }, dur)
  }
  dismiss() {
    document.body.removeChild(this.container)
    // this.container.classList.add('fade-anim')
    // const missTimer = setTimeout(() => {
    //   clearTimeout(missTimer)
    //   document.body.removeChild(this.container)
    // }, 500)
  }
}
