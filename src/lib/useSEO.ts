import { useEffect } from 'react'

/**
 * SEO meta tag manager for SPA pages.
 * Updates document title, meta description, canonical URL,
 * and Open Graph / Twitter Card tags on route change.
 */
interface SEOProps {
  title: string
  description: string
  path?: string          // e.g. "/pricing" — for canonical & OG URL
  noindex?: boolean      // add robots noindex
  type?: string          // og:type — default "website"
  image?: string         // og:image absolute URL
}

const SITE_NAME = 'ResumeBuildIn'
const BASE_URL = 'https://resumebuildin.io'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSEO({ title, description, path = '/', noindex, type = 'website', image }: SEOProps) {
  useEffect(() => {
    // Title
    const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`
    document.title = fullTitle

    // Meta description
    setMeta('description', description)

    // Robots
    if (noindex) {
      setMeta('robots', 'noindex, nofollow')
    } else {
      const existing = document.querySelector('meta[name="robots"]')
      if (existing) existing.remove()
    }

    // Canonical
    const canonicalURL = `${BASE_URL}${path}`
    setLink('canonical', canonicalURL)

    // Open Graph
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', canonicalURL, 'property')
    setMeta('og:type', type, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('og:image', image || DEFAULT_IMAGE, 'property')
    setMeta('og:image:width', '1200', 'property')
    setMeta('og:image:height', '630', 'property')

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image || DEFAULT_IMAGE)
    // setMeta('twitter:site', '@resumebuildin')  // Uncomment when you have a Twitter handle

    return () => {
      // Cleanup is not needed since we overwrite on every route
    }
  }, [title, description, path, noindex, type, image])
}
