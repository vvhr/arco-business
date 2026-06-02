import type { HighlighterCore, LanguageRegistration } from 'shiki/core'

type HighlightOptions = {
  lang?: string
  theme?: 'github-light' | 'github-dark'
}

const supportedLanguages = new Set<string>([
  'vue',
  'typescript',
  'ts',
  'javascript',
  'js',
  'tsx',
  'jsx',
  'html',
  'css',
  'less',
  'json',
  'bash',
  'shell',
  'markdown'
])

let highlighterPromise: Promise<HighlighterCore> | null = null

function normalizeLang(lang?: string) {
  const nextLang = lang || 'vue'
  return supportedLanguages.has(nextLang) ? nextLang : 'vue'
}

async function loadLanguages() {
  const [
    vue,
    typescript,
    javascript,
    tsx,
    jsx,
    html,
    css,
    less,
    json,
    shell,
    markdown
  ] = await Promise.all([
    import('shiki/langs/vue.mjs'),
    import('shiki/langs/typescript.mjs'),
    import('shiki/langs/javascript.mjs'),
    import('shiki/langs/tsx.mjs'),
    import('shiki/langs/jsx.mjs'),
    import('shiki/langs/html.mjs'),
    import('shiki/langs/css.mjs'),
    import('shiki/langs/less.mjs'),
    import('shiki/langs/json.mjs'),
    import('shiki/langs/shell.mjs'),
    import('shiki/langs/markdown.mjs')
  ])

  return [
    ...vue.default,
    ...typescript.default,
    ...javascript.default,
    ...tsx.default,
    ...jsx.default,
    ...html.default,
    ...css.default,
    ...less.default,
    ...json.default,
    ...shell.default,
    ...markdown.default
  ] satisfies LanguageRegistration[]
}

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
      import('shiki/themes/github-light.mjs'),
      import('shiki/themes/github-dark.mjs'),
      loadLanguages()
    ]).then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }, lightTheme, darkTheme, langs]) =>
      createHighlighterCore({
        engine: createJavaScriptRegexEngine(),
        themes: [lightTheme.default, darkTheme.default],
        langs
      })
    )
  }
  return highlighterPromise
}

export async function highlightCode(code: string, options: HighlightOptions = {}) {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code, {
    lang: normalizeLang(options.lang),
    theme: options.theme || 'github-light'
  })
}
