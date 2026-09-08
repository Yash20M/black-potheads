import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data: any = await adminApi.blogs.getAll();
      setBlogs(data.blogs);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBlogs(); }, []);

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      const data: any = await adminApi.blogs.toggle(id);
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, published: data.published } : b));
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await adminApi.blogs.delete(id);
      setBlogs(prev => prev.filter(b => b._id !== id));
      toast.success('Blog deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">BLOGS</h1>
          <p className="text-muted-foreground text-sm mt-1">{blogs.length} total · {blogs.filter(b => b.published).length} published</p>
        </div>
        <Button variant="hero" onClick={() => navigate('/admin/bp-7x4/create')}>
          <Plus size={16} className="mr-2" /> New Blog
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No blogs yet</p>
          <Button onClick={() => navigate('/admin/bp-7x4/create')}>
            <Plus size={16} className="mr-2" /> Create First Blog
          </Button>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground">Blog</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Tags</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Date</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-right p-4 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, idx) => (
                <motion.tr
                  key={blog._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                >
                  {/* Blog Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {blog.coverImage?.url ? (
                        <img src={blog.coverImage.url} alt={blog.title} className="w-12 h-8 object-cover border border-border flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-8 bg-secondary border border-border flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate max-w-[200px]">{blog.title}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{blog.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Tags */}
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] border border-border px-1.5 py-0.5 text-muted-foreground">{tag}</span>
                      ))}
                      {blog.tags?.length > 2 && <span className="text-[10px] text-muted-foreground">+{blog.tags.length - 2}</span>}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="p-4 hidden sm:table-cell">
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p className="flex items-center gap-1"><Calendar size={10} />{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="flex items-center gap-1"><Clock size={10} />{blog.readTime} min read</p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={cn(
                      'text-xs px-2 py-1 border font-medium uppercase tracking-wider',
                      blog.published
                        ? 'border-green-500/40 text-green-400 bg-green-500/5'
                        : 'border-yellow-500/40 text-yellow-400 bg-yellow-500/5'
                    )}>
                      {blog.published ? 'Live' : 'Draft'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Toggle publish */}
                      <button
                        onClick={() => handleToggle(blog._id)}
                        disabled={togglingId === blog._id}
                        className="p-2 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
                        title={blog.published ? 'Unpublish' : 'Publish'}
                      >
                        {blog.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/admin/bp-7x4/edit/${blog._id}`)}
                        className="p-2 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>

                      {/* View Live */}
                      {blog.published && (
                        <Link
                          to={`/blogs/${blog.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-primary"
                          title="View Live"
                        >
                          <Eye size={15} />
                        </Link>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                        className="p-2 hover:bg-red-500/10 rounded transition-colors text-muted-foreground hover:text-red-400 disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
