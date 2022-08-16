import highlightJs from 'highlight.js'
import { marked } from 'marked'
import { getOffsetTop } from './dom'
// 解析markdown
export const formartMd = (md: string) => {
  const renderer = new marked.Renderer()
  renderer.image = (href, title, text) => {
    return `<img class="preview-image" src="${href}" alt="${text}" ${title ? `title="${title}"` : ''}/>`
  }
  renderer.code = (code, lang) => {
    code = `${highlightJs.highlightAuto(code).value}<span class="copy-code-btn">${lang ? `${lang} ` : ''}复制代码</span>`
    return `<pre><code ${lang ? `class="${renderer.options.langPrefix}${lang}"` : ''}>${code}</code></pre>\n`
  }
  renderer.codespan = (text) => {
    return `<code class="code-span">${text}</code>`
  }
  marked.setOptions({
    renderer,
    gfm: true, // 允许 Git Hub标准的markdown.
    breaks: true, // 允许回车换行。该选项要求 gfm 为true。
    pedantic: false, // 尽可能地兼容 markdown.pl的晦涩部分。不纠正原始模型任何的不良行为和错误。
    smartLists: true, // 使用比原生markdown更时髦的列表。 旧的列表将可能被作为pedantic的处理内容过滤掉.
    smartypants: false // 使用更为时髦的标点，比如在引用语法中加入破折号。
  })
  const html = marked(md)
  return html
}

export const formatTagByHtml = (html: string) => {
  return html
    .replace(/<(h[1-2])(([\s\S])*?)<\/h[1-2]>/g, (el) => {
      return `
    <div class="banner-tag primary banner-tag__left">
      <div class="banner-tag__content">
        <div class="banner-tag__wrap">${el}</div>
      </div>
    </div>
    `
    })
    .replace(/<h3(([\s\S])*?)<\/h3>/g, (el) => {
      return `
    <div class="md-h3-container">
    ${el}
    </div>
    `
    })
}
export interface MdTitle {
  nodeName: string
  text: string
  id: string
  scrollTop: number
}
export const getMdTitleList = (container: Element, tags = 'h1, h2, h3'): MdTitle[] => {
  const nodeList = Array.from(container.querySelectorAll(tags))
  const headerH = (document.querySelector('.main-header')?.getBoundingClientRect().height || 0) + 15
  return nodeList.map((node: any) => ({
    nodeName: node.nodeName.toLocaleLowerCase(),
    text: node.innerText,
    id: node.id,
    scrollTop: getOffsetTop(document.getElementById(node.id) as Element) - headerH
  }))
}

// // sidebar hook
// export const useSidebar = (
//   list: MdTitle[],
//   fallback?: () => void
// ): [
//   {
//     id: string
//     title: string
//     isSub: boolean
//   }[],
//   number,
//   (item: SideTitleItem) => void
// ] => {
//   const state = useRef({
//     isAnimate: false
//   })
//   const [activeIndex, setActiveIndex] = useState(0)
//   const sideList = getSideList(list)
//   const onChange = (item: SideTitleItem) => {
//     const obj = list.find((v) => v.id === item.id) as MdTitle
//     fallback && fallback()
//     state.current.isAnimate = true
//     setScrollTop(obj.scrollTop, {
//       animate: true,
//       complete: () => {
//         state.current.isAnimate = false
//       }
//     })
//   }
//   useScroll((scrollTop) => {
//     if (state.current.isAnimate) {
//       return
//     }
//     const oldArr = list.map((item) => item.scrollTop)
//     const arr = [...oldArr].reverse()
//     const top = arr.find((top) => scrollTop > top)
//     let index = oldArr.findIndex((t) => top === t) + 1
//     index = index < 0 ? 0 : index
//     index = index > oldArr.length - 1 ? oldArr.length - 1 : index
//     setActiveIndex(index)
//   })
//   return [sideList, activeIndex, onChange]
// }
