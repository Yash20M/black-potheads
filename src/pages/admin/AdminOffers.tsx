import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/loader';

const AdminOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOffers();
  }, [page, categoryFilter, statusFilter]);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data: any = await adminApi.offers.getAll({
        page,
        limit: 10,
        category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
        isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
      });
      setOffers(data.offers || []);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (offerId: string) => {
    try {
      await adminApi.offers.toggle(offerId);
      toast.success('Offer status updated');
      loadOffers();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      await adminApi.offers.delete(offerId);
      toast.success('Offer deleted');
      loadOffers();
    } catch (error: any) {
      toast.error('Failed to delete offer');
    }
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const categories = ['Shiva', 'Shrooms', 'LSD', 'Chakras', 'Dark', 'Rick n Morty'];

  return (
    <div>
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Offers & Promotions</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage promotional offers</p>
        </div>
        <Button onClick={() => navigate('/admin/offers/create')} variant="hero">
          <Plus size={18} className="mr-2" />
          Create Offer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <TableSkeleton rows={10} cols={7} />
      ) : (
        <>
          <div className="bg-card border border-border overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-medium">Image</th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Discount</th>
                  <th className="text-left p-4 font-medium">Valid Until</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer._id} className="border-t border-border">
                    <td className="p-4">
                      <img
                        src={offer.image?.url}
                        alt={offer.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{offer.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {offer.description}
                      </p>
                    </td>
                    <td className="p-4">{offer.category}</td>
                    <td className="p-4">
                      <span className="font-display text-lg">{offer.discountPercentage}%</span>
                      <p className="text-xs text-muted-foreground">
                        ₹{offer.originalPrice} → ₹{offer.discountedPrice}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className={isExpired(offer.validUntil) ? 'text-red-500' : ''}>
                        {new Date(offer.validUntil).toLocaleDateString()}
                      </p>
                      {isExpired(offer.validUntil) && (
                        <span className="text-xs text-red-500">Expired</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            offer.isActive
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-gray-500/10 text-gray-500'
                          }`}
                        >
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {offer.isValid && (
                          <span className="text-xs text-green-500">✓ Valid</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggle(offer._id)}
                          title={offer.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Power size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/offers/edit/${offer._id}`)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(offer._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {offers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No offers found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOffers;
