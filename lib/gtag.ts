// Tell TypeScript that we attach gtag to the window object
declare global {
  interface Window {
    gtag: (
      name: 'event' | 'config',
      action: string,
      options: Record<string, unknown>
    ) => void
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageView(url: string) {
  window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
    page_path: url
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event({category, label, name, value}) {
  window.gtag('event', name, {
    event_category: category,
    event_label: label,
    non_interaction: true, // avoids affecting bounce rate
    value
  })
}
