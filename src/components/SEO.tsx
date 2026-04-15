import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export const SEO = ({
  title = 'Blackpotheads - Psy Clothing | Premium Streetwear Brand',
  description = 'Buy psychedelic t-shirts & streetwear in India. Shop unique Shiva, gothic & trippy printed tees at Blackpotheads (Black Potheads). Premium quality. Free shipping, COD & easy returns.',
  keywords = 'blackpotheads, black potheads, psy clothing india, psychedelic t-shirts india, streetwear india, Trippy streetwear, Psychedelic streetwear, graphic tees india, shiva t-shirts, gothic clothing india, trippy t-shirts, premium streetwear brand india',
  image = 'https://blackpotheads.com/logo.png',
  url = 'https://blackpotheads.com',
  type = 'website',
  structuredData,
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Blackpotheads" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Extra SEO Boost */}
      <meta name="author" content="Blackpotheads" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};