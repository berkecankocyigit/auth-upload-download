import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, ArrowLeft } from 'lucide-react';

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      await uploadFile(file, (progress: number) => {
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
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
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
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 text-white hover:bg-white/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className={`w-full h-full flex flex-col items-center justify-center rounded-2xl backdrop-blur-xl ${
        isDragging ? 'bg-primary/20' : 'bg-white/10'
      } border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300`}>
        <p className="text-lg mb-4 text-white">
          {isUploading ? 'Uploading...' : 'Drag and drop your file anywhere or click to choose'}
        </p>
        {isUploading && (
          <div className="w-1/2 space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center text-white">{Math.round(uploadProgress)}%</p>
          </div>
        )}
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            className="bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90 backdrop-blur-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Choose File
          </Button>
        </div>
      </div>
    </div>
  );
}