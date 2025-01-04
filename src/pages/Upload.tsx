import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsUploading(true);
    setUploadProgress(0);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      try {
        await uploadFile(files[0], (progress: number) => {
          setUploadProgress(progress);
        });
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
        setIsUploading(false);
        navigate('/dashboard');
      } catch (error) {
        setIsUploading(false);
        toast({
          title: "Error",
          description: "Upload failed",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) {
          setIsDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
      <div className={`w-full h-full flex flex-col items-center justify-center rounded-2xl backdrop-blur-xl ${
        isDragging ? 'bg-primary/20' : 'bg-white/10'
      } border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300`}>
        <p className="text-lg mb-4 text-gray-900 dark:text-white">
          {isUploading ? 'Uploading...' : 'Drag and drop your file anywhere on this page'}
        </p>
        {isUploading && (
          <div className="w-1/2 space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center text-gray-900 dark:text-white">{Math.round(uploadProgress)}%</p>
          </div>
        )}
        <Button
          className="mt-4 bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90 backdrop-blur-sm"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}