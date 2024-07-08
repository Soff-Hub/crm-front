// ** React Import
import { Children } from 'react'

// ** Next Import
import Document, { Html, Head, Main, NextScript } from 'next/document'

// ** Emotion Imports
import createEmotionServer from '@emotion/server/create-instance'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'
import { store } from 'src/store'

class CustomDocument extends Document {
  render() {
    const state = store.getState()

    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
          />
          <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' />
          <link rel='apple-touch-icon' sizes='180x180' href='/images/default-logo.jpg' />
          
        </Head>
        <body>
          <Main />
          <NextScript />
          <script async src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js' defer ></script>
        </body>
      </Html>
    )
  }
}

// CustomDocument.getInitialProps = async ctx => {
//   const originalRenderPage = ctx.renderPage
//   const cache = createEmotionCache()
//   const { extractCriticalToChunks } = createEmotionServer(cache)

//   ctx.renderPage = () =>
//     originalRenderPage({
//       enhanceApp: App => props =>
//       (
//         <App
//           {...props} // @ts-ignore
//           emotionCache={cache}
//         />
//       )
//     })

//   const initialProps = await Document.getInitialProps(ctx)
//   const emotionStyles = extractCriticalToChunks(initialProps.html)
//   const emotionStyleTags = emotionStyles.styles.map(style => {
//     return (
//       <style
//         key={style.key}
//         dangerouslySetInnerHTML={{ __html: style.css }}
//         data-emotion={`${style.key} ${style.ids.join(' ')}`}
//       />
//     )
//   })

//   return {
//     ...initialProps,
//     styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
//   }
// }

export default CustomDocument
