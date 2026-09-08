import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

const AdminBlogForm = () => {
  const { id } = useParams(); // present = edit mode
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: [] as string[],
    published: false,
  });

  // Load existing blog in edit mode
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const data: any = await adminApi.blogs.getById(id!);
        const b = data.blog;
        setForm({
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt,
          content: b.content,
          tags: b.tags || [],
          published: b.published,
        });
        if (b.coverImage?.url) setCoverPreview(b.coverImage.url);
      } catch (err: any) {
        toast.error('Failed to load blog');
        navigate('/admin/bp-7x4');
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [id]);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setForm(prev => ({
      ...prev,
      title: val,
      slug: !isEdit
        ? val.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
        : prev.slug,
    }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.excerpt.trim()) { toast.error('Excerpt is required'); return; }
    if (!form.content.trim()) { toast.error('Content is required'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('slug', form.slug);
      formData.append('excerpt', form.excerpt);
      formData.append('content', form.content);
      formData.append('tags', JSON.stringify(form.tags));
      formData.append('published', String(form.published));
      if (coverFile) formData.append('file', coverFile);

      if (isEdit) {
        await adminApi.blogs.update(id!, formData);
        toast.success('Blog updated!');
      } else {
        await adminApi.blogs.create(formData);
        toast.success('Blog created!');
      }
      navigate('/admin/bp-7x4');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-8" />
        <div className="space-y-4">
          {Array(4).fill(null).map((_, i) => <div key={i} className="h-12 bg-muted rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/bp-7x4')} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-3xl">{isEdit ? 'EDIT BLOG' : 'NEW BLOG'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. The Sacred Art of Shiva in Modern Streetwear"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="auto-generated from title"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">blackpotheads.com/blogs/{form.slug || 'your-slug'}</p>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Excerpt * <span className="text-muted-foreground font-normal">(shown on blog list, max 300 chars)</span></Label>
              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                maxLength={300}
                rows={3}
                required
                placeholder="Short description of the blog..."
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring mt-1"
              />
              <p className="text-xs text-muted-foreground text-right">{form.excerpt.length}/300</p>
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">
                Content * <span className="text-muted-foreground font-normal">(HTML supported)</span>
              </Label>
              <textarea
                id="content"
                value={form.content}
                onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                required
                placeholder={`<h2>Introduction</h2>\n<p>Write your blog content here...</p>\n\n<h2>Section 2</h2>\n<p>More content...</p>`}
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-1 focus:ring-ring mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;&lt;li&gt;, &lt;a href=""&gt;, &lt;img src="" alt=""&gt;
              </p>
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="space-y-5">

            {/* Publish toggle */}
            <div className="border border-border p-4">
              <Label className="mb-3 block">Status</Label>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, published: !prev.published }))}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium uppercase tracking-wider border-2 transition-all ${
                  form.published
                    ? 'border-green-500 text-green-400 bg-green-500/5'
                    : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/5'
                }`}
              >
                {form.published ? <><Eye size={14} /> Published</> : <><EyeOff size={14} /> Draft</>}
              </button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {form.published ? 'Visible to public' : 'Only visible to admin'}
              </p>
            </div>

            {/* Cover Image */}
            <div className="border border-border p-4">
              <Label className="mb-3 block">Cover Image</Label>
              {coverPreview ? (
                <div className="relative mb-3">
                  <img src={coverPreview} alt="Cover" className="w-full aspect-[16/9] object-cover border border-border" />
                  <button
                    type="button"
                    onClick={() => { setCoverPreview(null); setCoverFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/70 flex items-center justify-center text-white hover:bg-black"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[16/9] border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors mb-3"
                >
                  <Upload size={20} className="text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground">Max 5MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1 border border-border"
              >
                {coverPreview ? 'Change Image' : 'Upload Image'}
              </button>
            </div>

            {/* Tags */}
            <div className="border border-border p-4">
              <Label className="mb-3 block">Tags</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="e.g. shiva"
                  className="text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs border border-border px-2 py-0.5">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-red-400 ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {form.tags.length === 0 && <p className="text-xs text-muted-foreground">No tags added</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="submit" variant="hero" disabled={loading} className="min-w-[140px]">
            <Save size={15} className="mr-2" />
            {loading ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/bp-7x4')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogForm;
