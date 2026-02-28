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
  title = 'BLACK POTHEADS - Premium Printed T-Shirts | Streetwear India',
  description = 'Shop premium printed t-shirts online in India. Unique Shiva, psychedelic, gothic & streetwear designs. Free shipping, COD available. 7-day returns. Order now!',
  keywords = 'printed t-shirts india, streetwear india, graphic tees, shiva t-shirts, psychedelic clothing, gothic tees, premium cotton tshirts, online tshirt shopping india, blackpotheads',
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
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
