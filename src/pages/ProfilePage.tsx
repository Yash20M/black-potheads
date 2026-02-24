import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/lib/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view profile');
      navigate('/login');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const response: any = await userApi.getProfile();
      setProfileData(response.user || response);
      setFormData({
        name: response.user?.name || response.name || '',
        email: response.user?.email || response.email || '',
      });
    } catch (error: any) {
      toast.error('Failed to load profile');
      console.error('Load profile error:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response: any = await userApi.updateProfile(formData);
      if (response.user) {
        setProfileData(response.user);
        if (user) {
          const token = user.token || localStorage.getItem('token') || '';
          setUser({ ...user, ...response.user }, token);
        }
      }
      toast.success('Profile updated successfully');
      setEditing(false);
      await loadProfile(); // Reload profile data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl mb-8 sm:mb-12"
        >
          MY ACCOUNT
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2 sm:space-y-4"
          >
            <Link to="/profile">
              <div className="bg-card border border-primary p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <User size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">Profile</span>
              </div>
            </Link>

            <Link to="/orders">
              <div className="bg-card border border-border hover:border-primary transition-colors p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <Package size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">My Orders</span>
              </div>
            </Link>

            <Link to="/wishlist">
              <div className="bg-card border border-border hover:border-primary transition-colors p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <Heart size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">Wishlist</span>
              </div>
            </Link>

            <button
              onClick={logout}
              className="w-full bg-card border border-border hover:border-destructive transition-colors p-3 sm:p-4 flex items-center gap-2 sm:gap-3 text-left"
            >
              <Settings size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Logout</span>
            </button>
          </motion.div>

          {/* Profile Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {loadingProfile ? (
              <div className="bg-card border border-border p-4 sm:p-8 text-center">
                <p className="text-muted-foreground text-sm sm:text-base">Loading profile...</p>
              </div>
            ) : (
              <div className="bg-card border border-border p-4 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl">Profile Information</h2>
                  {!editing && (
                    <Button
                      variant="outline"
                      onClick={() => setEditing(true)}
                      className="w-full sm:w-auto text-sm"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button
                        type="submit"
                        variant="hero"
                        disabled={loading}
                        className="w-full sm:w-auto text-sm"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: profileData?.name || '',
                            email: profileData?.email || '',
                          });
                        }}
                        className="w-full sm:w-auto text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">Name</p>
                      <p className="text-base sm:text-lg break-words">{profileData?.name || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">Email</p>
                      <p className="text-base sm:text-lg break-all">{profileData?.email || 'N/A'}</p>
                    </div>

                    {profileData?.phone && (
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Phone</p>
                        <p className="text-base sm:text-lg">{profileData.phone}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">Member Since</p>
                      <p className="text-base sm:text-lg">
                        {profileData?.createdAt
                          ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : new Date().toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                            })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
