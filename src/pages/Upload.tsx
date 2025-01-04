import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      try {
        await uploadFile(files[0]);
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
        navigate('/dashboard');
      } catch (error) {
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
        // Only set dragging to false if we're leaving the main container
        if (e.currentTarget === e.target) {
          setIsDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
      <div className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}>
        <p className="text-lg mb-4">Drag and drop your file anywhere on this page</p>
        {uploadProgress > 0 && (
          <Progress value={uploadProgress} className="w-1/2 mx-auto" />
        )}
        <Button
          className="mt-4"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}