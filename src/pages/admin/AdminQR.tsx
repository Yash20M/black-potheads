import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { adminApi, qrApi } from '@/lib/api';
import { toast } from 'sonner';

const AdminQR = () => {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQR();
  }, []);

  const loadQR = async () => {
    try {
      const data: any = await qrApi.get();
      if (data.qrImage?.url) {
        setQrImage(data.qrImage.url);
      }
    } catch (error) {
      // QR might not exist yet
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!formData.get('qr')) {
      toast.error('Please select an image');
      return;
    }

    setUploading(true);
    try {
      await adminApi.qr.upload(formData);
      toast.success('QR code uploaded successfully');
      loadQR();
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2">QR Code</h1>
        <p className="text-muted-foreground">Manage payment QR code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-6"
        >
          <h2 className="font-display text-2xl mb-4">Upload QR Code</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="qr">QR Code Image</Label>
              <Input
                id="qr"
                name="qr"
                type="file"
                accept="image/*"
                required
              />
              <p className="text-sm text-muted-foreground mt-2">
                Upload a QR code image for payment
              </p>
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full"
              disabled={uploading}
            >
              <Upload size={18} className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload QR Code'}
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-6"
        >
          <h2 className="font-display text-2xl mb-4">Current QR Code</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : qrImage ? (
            <div className="space-y-4">
              <img
                src={qrImage}
                alt="Payment QR Code"
                className="w-full max-w-md mx-auto border border-border"
              />
              <p className="text-sm text-muted-foreground text-center">
                This QR code is displayed to customers during checkout
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <ImageIcon size={48} className="mb-4" />
              <p>No QR code uploaded yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminQR;
