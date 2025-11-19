'use client'

interface StructuredDataProps {
  type: 'person' | 'organization' | 'article' | 'website'
  data: Record<string, any>
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const schemas = {
    person: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name || 'Arslan Kemal Gündüz',
      url: data.url || 'https://arkegu.com.tr',
      image: data.image || 'https://arkegu.com.tr/images/arkegu-logo.png',
      jobTitle: data.jobTitle || 'Senior Software Developer',
      description: data.description || 'Senior Software Developer specializing in .NET, Cloud, FinTech, and modern web technologies.',
      sameAs: data.sameAs || [
        'https://github.com/arslankg',
        'https://linkedin.com/in/arslankg',
      ],
      email: data.email || 'contact@arkegu.com.tr',
      knowsAbout: data.knowsAbout || [
        'Software Development',
        '.NET',
        'React',
        'Next.js',
        'TypeScript',
        'Cloud Computing',
        'FinTech',
      ],
    },
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name || 'Arslan Kemal Gündüz',
      url: data.url || 'https://arkegu.com.tr',
      logo: data.logo || 'https://arkegu.com.tr/images/arkegu-logo.png',
      description: data.description || 'Senior Software Developer specializing in .NET, Cloud, FinTech, and modern web technologies.',
      sameAs: data.sameAs || [
        'https://github.com/arslankg',
        'https://linkedin.com/in/arslankg',
      ],
    },
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      image: data.image,
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      author: {
        '@type': 'Person',
        name: data.author || 'Arslan Kemal Gündüz',
        url: 'https://arkegu.com.tr',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Arslan Kemal Gündüz',
        logo: {
          '@type': 'ImageObject',
          url: 'https://arkegu.com.tr/images/arkegu-logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': data.url,
      },
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: data.name || 'Arslan Kemal Gündüz Portfolio',
      url: data.url || 'https://arkegu.com.tr',
      description: data.description || 'Senior Software Developer Portfolio',
      author: {
        '@type': 'Person',
        name: 'Arslan Kemal Gündüz',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://arkegu.com.tr/blog?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  }

  const schema = schemas[type]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

