import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { blogApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      try {
        const data: any = await blogApi.getBySlug(slug);
        setBlog(data.blog);
      } catch {
        toast.error('Blog not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-muted rounded w-40 mx-auto" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center text-center">
        <div>
          <h1 className="font-display text-4xl mb-4">Blog Not Found</h1>
          <Button asChild><Link to="/blogs">Back to Blogs</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <SEO
        title={`${blog.title} | BLACK POTHEADS Blog`}
        description={blog.excerpt}
        keywords={blog.tags?.join(', ')}
        image={blog.coverImage?.url}
        url={`https://blackpotheads.com/blogs/${blog.slug}`}
        type="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": blog.title,
          "description": blog.excerpt,
          "image": blog.coverImage?.url || 'https://blackpotheads.com/logo.png',
          "datePublished": blog.createdAt,
          "dateModified": blog.updatedAt,
          "author": { "@type": "Organization", "name": "BLACK POTHEADS" },
          "publisher": {
            "@type": "Organization",
            "name": "BLACK POTHEADS",
            "logo": { "@type": "ImageObject", "url": "https://blackpotheads.com/logo.png" }
          },
          "mainEntityOfPage": { "@type": "WebPage", "@id": `https://blackpotheads.com/blogs/${blog.slug}` }
        }}
      />

      {/* Back Nav */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm uppercase tracking-widest">
            <ArrowLeft size={15} /> Back to Blog
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-yellow-500 border border-yellow-500/30 px-2 py-1">
                <Tag size={9} />{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-foreground mb-4 leading-tight"
        >
          {blog.title}
        </motion.h1>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 text-xs text-muted-foreground mb-8 pb-8 border-b border-border"
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {blog.readTime} min read
          </span>
        </motion.div>

        {/* Cover Image */}
        {blog.coverImage?.url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10 border border-border overflow-hidden"
          >
            <img
              src={blog.coverImage.url}
              alt={blog.title}
              className="w-full object-cover max-h-[480px]"
            />
          </motion.div>
        )}

        {/* Excerpt */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground italic mb-8 leading-relaxed border-l-2 border-primary pl-4"
        >
          {blog.excerpt}
        </motion.p>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="prose prose-invert prose-sm sm:prose-base max-w-none
            prose-headings:font-display prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-ul:text-muted-foreground prose-ol:text-muted-foreground
            prose-li:marker:text-primary
            prose-blockquote:border-primary prose-blockquote:text-muted-foreground
            prose-hr:border-border prose-img:border prose-img:border-border"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer CTA */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm mb-4">Explore the collection</p>
          <Button asChild variant="hero" size="lg">
            <Link to="/shop">Shop Now <ArrowRight size={16} className="ml-2" /></Link>
          </Button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;
