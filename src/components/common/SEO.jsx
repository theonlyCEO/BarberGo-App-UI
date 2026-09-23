import React from 'react'
import { Helmet } from 'react-helmet-async'

const SEO = ({ 
  title, 
  description, 
  keywords = [],
  image = '/og-image.jpg',
  url = '',
  type = 'website',
  siteName = 'BarberGo'
}) => {
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const fullUrl = url ? `https://barbergo.com${url}` : 'https://barbergo.com'
  const fullImage = image.startsWith('http') ? image : `https://barbergo.com${image}`

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <html lang="en" />
    </Helmet>
  )
}

export default SEO