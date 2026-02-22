import { useState, useEffect } from 'react';
import { offersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

const TestOffersPage = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const loadOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing offers API...');
      const data: any = await offersApi.getActive();
      console.log('API Response:', data);
      setResponse(data);
      
      if (data.success && data.offers) {
        setOffers(data.offers);
      } else {
        setError('No offers found or API returned unsuccessful response');
      }
    } catch (err: any) {
      console.error('Error loading offers:', err);
      setError(err.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-display text-4xl mb-8">Test Offers API</h1>

        <div className="space-y-6">
          <Button onClick={loadOffers} disabled={loading}>
            {loading ? 'Loading...' : 'Reload Offers'}
          </Button>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="bg-card border border-border p-6 rounded">
            <h2 className="font-display text-2xl mb-4">Raw API Response:</h2>
            <pre className="bg-secondary p-4 rounded overflow-auto text-xs">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>

          {offers.length > 0 ? (
            <div>
              <h2 className="font-display text-2xl mb-4">
                Found {offers.length} Active Offers:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer) => (
                  <div key={offer._id} className="bg-card border border-border p-6 rounded">
                    {offer.image?.url && (
                      <img
                        src={offer.image.url}
                        alt={offer.name}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                    )}
                    <h3 className="font-display text-xl mb-2">{offer.name}</h3>
                    <p className="text-muted-foreground mb-2">{offer.description}</p>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{offer.originalPrice}
                      </span>
                      <span className="font-display text-2xl text-primary">
                        ₹{offer.discountedPrice}
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                        {offer.discountPercentage}% OFF
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Category: {offer.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Status: {offer.isActive ? '✓ Active' : '✗ Inactive'} | 
                      {offer.isValid ? ' ✓ Valid' : ' ✗ Expired'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !loading && !error && (
              <div className="bg-card border border-border p-12 text-center">
                <p className="text-muted-foreground">No active offers found</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TestOffersPage;
