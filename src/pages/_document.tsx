// ** Next Import
import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {

  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta name="robots" content="noindex, nofollow" />

          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />

          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
          />
          <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' />
          <link rel='apple-touch-icon' sizes='180x180' href='/images/default-logo.jpg' />


          {/* Google Analytics */}
          {process.env.NODE_ENV === 'production' ? <script async src="https://www.googletagmanager.com/gtag/js?id=G-JNC979VFER"></script> : ''}
          {process.env.NODE_ENV === 'production' ? <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-JNC979VFER');
              `,
            }}
          /> : ''}

          {process.env.NODE_ENV === 'production' ? <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym(97896844, "init", {
                     clickmap:true,
                     trackLinks:true,
                     accurateTrackBounce:true
                });
              `,
            }}
          /> : ''}

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
