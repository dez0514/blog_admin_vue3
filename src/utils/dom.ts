import TWEEN from '@tweenjs/tween.js'
import ClipboardJS from 'clipboard'

// 获取滚动条高度
export function getScrollTop(container?: any): number {
  if (container) {
    return container.scrollTop
  }
  return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
}

// 获取滚动高度
export function getScrollHeight(container?: any) {
  if (container) {
    return container.scrollHeight
  }
  return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
}

// 设置滚动条高度
export type SetScrollTopOptions = {
  container?: any
  animate?: boolean
  duration?: number
  complete?: () => void
}
export function setScrollTop(scrollTop: number, options: SetScrollTopOptions = {}) {
  const container = options.container
  const animate = options.animate
  const set = (top: number) => {
    if (container) {
      container.scrollTop = top
    } else {
      document.documentElement.scrollTop = document.body.scrollTop = top
    }
  }
  if (!animate) {
    set(scrollTop)
  } else {
    const duration = options.duration || 500
    const complete = options.complete
    const top = getScrollTop(container)
    const coords = {
      scrollTop: top
    }
    const tween = new TWEEN.Tween(coords)
      .to({ scrollTop }, duration)
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
      .onUpdate(() => {
        set(coords.scrollTop)
      })

    const run = () => {
      const id = requestAnimationFrame(run)
      const res = tween.update()
      if (!res) {
        complete && complete()
        cancelAnimationFrame(id)
      }
    }
    run()
  }
}

// 获取元素距离文档顶部的高度
export function getOffsetTop(node: any) {
  let t = node.offsetTop
  while (node.offsetParent) {
    node = node.offsetParent
    t += node.offsetTop
  }
  return t
}

// 节点操作
export const $ = {
  hasClass(el: any, className: string) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(el.className)
  },
  addClass(el: any, className: string) {
    if (!el) {
      return
    }
    if (el.classList) {
      el.classList.add(className)
    } else if (!this.hasClass(el, className)) {
      el.className += '' + className
    }
  },
  removeClass(el: any, className: string) {
    if (!el) {
      return
    }
    if (el.classList) {
      el.classList.remove(className)
    } else if (this.hasClass(el, className)) {
      el.className = el.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '')
    }
  }
}

// 复制文本
export const copyTextByDom = (
  selector: string,
  {
    success,
    deep = false,
    error
  }: {
    success: (e: ClipboardJS.Event) => void
    deep?: boolean
    error?: (e: ClipboardJS.Event) => void
  }
) => {
  let clipboard
  if (deep) {
    clipboard = new ClipboardJS(`.${selector}`, {
      text: (el: any) => {
        let div = el.parentNode.cloneNode(true)
        div.style.display = 'none'
        div.style.opacity = 0
        div.style.whiteSpace = 'pre-wrap'
        Array.from(div.children).forEach((node: any) => {
          if (node.className === selector) {
            div.removeChild(node)
          }
        })
        const text = div.innerText
        div = null
        return text
      }
    })
  } else {
    clipboard = new ClipboardJS(`.${selector}`, {
      text: (el: any) => {
        return el.innerText
      }
    })
  }
  clipboard.on('success', success)
  clipboard.on('error', (e) => {
    error && error(e)
  })
}