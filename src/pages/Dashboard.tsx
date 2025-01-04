import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileUp, Files } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Choose an option to proceed</p>
        </div>
        
        <div className="grid gap-4">
          <Button
            className="w-full h-16 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => navigate('/upload')}
          >
            <FileUp className="mr-2 h-6 w-6" />
            Upload Files
          </Button>
          
          <Button
            className="w-full h-16 text-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => navigate('/files')}
          >
            <Files className="mr-2 h-6 w-6" />
            Manage Files
          </Button>
        </div>
      </div>
    </div>
  );
}