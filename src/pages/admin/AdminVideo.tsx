import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { videoApi } from '@/lib/api';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  isActive: boolean;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  video?: T;
}

export const AdminVideo = () => {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideo();
  }, []);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const data = await videoApi.admin.get() as ApiResponse<Video>;
      if (data.success && data.video) {
        setVideo(data.video);
        setTitle(data.video.title || '');
        setDescription(data.video.description || '');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/mkv'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid video file (MP4, AVI, MOV, WMV, FLV, MKV)",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video file smaller than 50MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a video file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', title);
      formData.append('description', description);

      const data = await videoApi.admin.upload(formData) as ApiResponse<Video>;
      if (data.success) {
        toast({
          title: "Success",
          description: "Video uploaded successfully"
        });
        setSelectedFile(null);
        fetchVideo();
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleVideoStatus = async () => {
    try {
      const data = await videoApi.admin.toggleStatus() as ApiResponse;
      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Video status updated"
        });
        fetchVideo();
      } else {
        throw new Error(data.message || 'Failed to toggle status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle video status",
        variant: "destructive"
      });
    }
  };

  const deleteVideo = async () => {
    if (!confirm('Are you sure you want to delete the featured video? This action cannot be undone.')) {
      return;
    }

    try {
      const data = await videoApi.admin.delete() as ApiResponse;
      if (data.success) {
        toast({
          title: "Success",
          description: "Video deleted successfully"
        });
        setVideo(null);
        setTitle('');
        setDescription('');
      } else {
        throw new Error(data.message || 'Failed to delete video');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete video",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Featured Video Management</h1>
          <p className="text-muted-foreground">Upload and manage the featured video for your homepage</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Uploading a new video will replace the existing one. Supported formats: MP4, AVI, MOV, WMV, FLV, MKV (Max: 50MB)
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video File</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Video Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Current Featured Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : video ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{video.title || 'Untitled Video'}</h3>
                      <Badge variant={video.isActive ? 'default' : 'secondary'}>
                        {video.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    {video.description && (
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    )}
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Uploaded by: {video.uploadedBy.name}</p>
                      <p>Created: {new Date(video.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(video.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={toggleVideoStatus}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {video.isActive ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={deleteVideo}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No featured video uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminVideo;