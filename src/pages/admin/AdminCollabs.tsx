import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Trash2, RefreshCw, Mail, Phone, Instagram, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api';

interface CollabSubmission {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  instagram: string;
  vision: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const AdminCollabs = () => {
  const [submissions, setSubmissions] = useState<CollabSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<CollabSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data: any = await adminApi.collabs.getAll({ 
        status: statusFilter !== 'all' ? statusFilter : undefined 
      });
      
      console.log('Admin collabs response:', data); // Debug log
      
      // Backend returns { success: true, collabs: [...], totalPages, currentPage, totalCollabs, counts, filters }
      setSubmissions(data.collabs || []);
    } catch (error: any) {
      console.error('Load submissions error:', error);
      toast.error(error.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await adminApi.collabs.delete(id);
      toast.success('Submission deleted');
      loadSubmissions();
    } catch (error: any) {
      toast.error('Failed to delete submission');
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'reviewed' | 'contacted' | 'rejected') => {
    try {
      await adminApi.collabs.updateStatus(id, newStatus);
      toast.success('Status updated');
      loadSubmissions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'reviewed': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'contacted': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Collaboration Submissions</h1>
          <p className="text-muted-foreground">Manage artist collaboration requests</p>
        </div>
        <Button onClick={loadSubmissions} variant="outline" size="sm">
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === 'reviewed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('reviewed')}
        >
          Reviewed
        </Button>
        <Button
          variant={statusFilter === 'contacted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('contacted')}
        >
          Contacted
        </Button>
        <Button
          variant={statusFilter === 'rejected' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('rejected')}
        >
          Rejected
        </Button>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <MessageSquare size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Submissions Yet</h3>
          <p className="text-muted-foreground">
            Collaboration requests will appear here
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <motion.div
              key={submission._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{submission.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(submission.status)}`}>
                      {submission.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {new Date(submission.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <Eye size={16} className="mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(submission._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{submission.mobile || 'N/A'}</span>
                </div>
                {submission.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>{submission.email}</span>
                  </div>
                )}
                {submission.instagram && (
                  <div className="flex items-center gap-2 text-sm">
                    <Instagram size={16} className="text-muted-foreground" />
                    <a
                      href={`https://instagram.com/${submission.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {submission.instagram}
                    </a>
                  </div>
                )}
              </div>

              {/* Vision Preview */}
              {submission.vision && (
                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-semibold mb-2">Vision:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {submission.vision}
                  </p>
                </div>
              )}

              {/* Status Actions */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(submission._id, 'reviewed')}
                  disabled={submission.status === 'reviewed'}
                >
                  Mark as Reviewed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(submission._id, 'contacted')}
                  disabled={submission.status === 'contacted'}
                >
                  Mark as Contacted
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(submission._id, 'rejected')}
                  disabled={submission.status === 'rejected'}
                >
                  Reject
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSubmission(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card border-2 border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Submission Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
                <p className="text-lg mt-1">{selectedSubmission.name || 'N/A'}</p>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Mobile</label>
                  <p className="text-lg mt-1">{selectedSubmission.mobile || 'N/A'}</p>
                </div>
                {selectedSubmission.email && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                    <p className="text-lg mt-1">{selectedSubmission.email}</p>
                  </div>
                )}
              </div>

              {/* Instagram */}
              {selectedSubmission.instagram && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Instagram</label>
                  <p className="text-lg mt-1">
                    <a
                      href={`https://instagram.com/${selectedSubmission.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedSubmission.instagram}
                    </a>
                  </p>
                </div>
              )}

              {/* Vision */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Vision</label>
                <div className="bg-muted/50 p-4 rounded-lg mt-2">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedSubmission.vision || 'No vision provided'}
                  </p>
                </div>
                {selectedSubmission.vision && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedSubmission.vision.trim().split(/\s+/).filter(w => w.length > 0).length} words
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Button
                    variant={selectedSubmission.status === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleStatusUpdate(selectedSubmission._id, 'pending');
                      setSelectedSubmission({ ...selectedSubmission, status: 'pending' });
                    }}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={selectedSubmission.status === 'reviewed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleStatusUpdate(selectedSubmission._id, 'reviewed');
                      setSelectedSubmission({ ...selectedSubmission, status: 'reviewed' });
                    }}
                  >
                    Reviewed
                  </Button>
                  <Button
                    variant={selectedSubmission.status === 'contacted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleStatusUpdate(selectedSubmission._id, 'contacted');
                      setSelectedSubmission({ ...selectedSubmission, status: 'contacted' });
                    }}
                  >
                    Contacted
                  </Button>
                  <Button
                    variant={selectedSubmission.status === 'rejected' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleStatusUpdate(selectedSubmission._id, 'rejected');
                      setSelectedSubmission({ ...selectedSubmission, status: 'rejected' });
                    }}
                  >
                    Rejected
                  </Button>
                </div>
              </div>

              {/* Submitted Date */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Submitted On</label>
                <p className="text-lg mt-1">
                  {selectedSubmission.createdAt ? new Date(selectedSubmission.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCollabs;
