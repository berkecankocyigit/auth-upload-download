import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { listFiles, downloadFile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Download() {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const fileList = await listFiles();
      setFiles(fileList);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      await downloadFile(fileName);
      toast({
        title: "Success",
        description: "Download started",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Download failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Available Files</h1>
      
      {isLoading ? (
        <p className="text-center">Loading files...</p>
      ) : Object.keys(files).length === 0 ? (
        <p className="text-center">No files available</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(files).map((fileName) => (
              <TableRow key={fileName}>
                <TableCell>{fileName}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDownload(fileName)}
                    size="sm"
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Button
        className="mt-8 w-full"
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}