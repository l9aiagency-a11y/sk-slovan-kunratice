import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/admin/' },
    ],
    sitemap: 'https://sk-slovan-kunratice.vercel.app/sitemap.xml',
  }
}
