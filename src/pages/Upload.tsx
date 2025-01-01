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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-2xl font-bold text-center">Upload Files</h1>
        
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <p className="text-lg">Drag and drop your file here</p>
          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="mt-4" />
          )}
        </div>

        <Button
          className="w-full"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}