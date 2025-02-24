import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta name='robots' content='noindex, nofollow' />

          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />

          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
          />
          <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' />
          <link rel='apple-touch-icon' sizes='180x180' href='/images/default-logo.jpg' />

          {process.env.NODE_ENV === 'production' && (
            <script defer src='https://www.googletagmanager.com/gtag/js?id=G-JNC979VFER'></script>
          )}

          {process.env.NODE_ENV === 'production' && (
            <script
              defer
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-JNC979VFER');
              `
              }}
            />
          )}

          {process.env.NODE_ENV === 'production' && (
            <script
              defer
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
              `
              }}
            />
          )}
        </Head>

        <body>
          <Main />
          <NextScript />

          <script defer src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'></script>
        </body>
      </Html>
    )
  }
}

export default CustomDocument
