import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { listFiles, downloadFile, deleteFile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Files() {
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
      console.log(fileList);
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
      await downloadFile(fileName, files[fileName]);
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

  const handleDelete = async (fileName: string) => {
    try {
      await deleteFile(fileName, files[fileName]);
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      fetchFiles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">Files</h1>
        
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading files...</p>
        ) : Object.keys(files).length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No files available</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-white">File Name</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(files).map((fileName) => (
                <TableRow key={fileName}>
                  <TableCell className="text-gray-700 dark:text-gray-300">{fileName}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      onClick={() => handleDownload(fileName)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90 backdrop-blur-sm"
                    >
                      Download
                    </Button>
                    <Button
                      onClick={() => handleDelete(fileName)}
                      variant="destructive"
                      size="sm"
                      className="bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/90 hover:to-red-700/90 backdrop-blur-sm"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Button
          className="mt-8 w-full bg-gradient-to-r from-indigo-500/80 to-indigo-600/80 hover:from-indigo-600/90 hover:to-indigo-700/90 backdrop-blur-sm"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}