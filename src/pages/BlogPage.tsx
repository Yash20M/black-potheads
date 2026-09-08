import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { blogApi } from '@/lib/api';
import { toast } from 'sonner';

const BlogPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadBlogs = async (p = 1) => {
    setLoading(true);
    try {
      const data: any = await blogApi.getAll(p, 9);
      setBlogs(prev => p === 1 ? data.blogs : [...prev, ...data.blogs]);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBlogs(1); }, []);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <SEO
        title="Blog — Psychedelic Culture, Streetwear & Spirituality | BLACK POTHEADS"
        description="Explore the world of psychedelic culture, spirituality, and street fashion through the Black Potheads blog. Stories, guides and art."
        keywords="psychedelic culture blog, streetwear india blog, shiva fashion, trippy art, blackpotheads blog"
        url="https://blackpotheads.com/blogs"
      />

      {/* Header */}
      <section className="py-12 bg-black border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3 block">
              Stories & Culture
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-white mb-4">THE BLOG</h1>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              Psychedelic culture, spirituality, streetwear and the stories behind the designs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          {loading && blogs.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-[16/9] mb-4" />
                  <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">No blogs yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/blogs/${blog.slug}`} className="group block">
                      {/* Cover Image */}
                      <div className="aspect-[16/9] bg-muted overflow-hidden mb-4 border border-border">
                        {blog.coverImage?.url ? (
                          <img
                            src={blog.coverImage.url}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <span className="text-muted-foreground text-xs uppercase tracking-widest">BLACK POTHEADS</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {blog.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-yellow-500 border border-yellow-500/30 px-2 py-0.5">
                              <Tag size={8} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {blog.readTime} min read
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-primary group-hover:gap-2 transition-all">
                          Read <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Load More */}
              {page < totalPages && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => loadBlogs(page + 1)}
                    disabled={loading}
                    className="border-2 border-white text-white px-8 py-3 text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
