import highlightJs from 'highlight.js'
import { marked } from 'marked'
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