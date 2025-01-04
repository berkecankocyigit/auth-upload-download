import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileUp, Files } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Choose an option to proceed</p>
        </div>
        
        <div className="grid gap-4">
          <Button
            className="w-full h-16 text-lg bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/upload')}
          >
            <FileUp className="mr-2 h-6 w-6" />
            Upload Files
          </Button>
          
          <Button
            className="w-full h-16 text-lg bg-gradient-to-r from-indigo-500/80 to-indigo-600/80 hover:from-indigo-600/90 hover:to-indigo-700/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
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