import Script from "next/script"

export function Analytics() {
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true"
  const id = process.env.NEXT_PUBLIC_GA4_ID
  if (!enabled || !id) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="purity-ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true,send_page_view:true});`}
      </Script>
    </>
  )
}
