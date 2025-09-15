import { Helmet } from 'react-helmet-async';
export default function SEO({ title = 'AgriPortal', description = 'AgriPortal' }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description}/>
    </Helmet>
  );
}
