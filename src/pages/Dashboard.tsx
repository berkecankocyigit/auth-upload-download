import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        <div className="grid gap-4">
          <Button
            className="w-full"
            onClick={() => navigate('/upload')}
          >
            Upload Files
          </Button>
          <Button
            className="w-full"
            onClick={() => navigate('/download')}
          >
            Download Files
          </Button>
        </div>
      </div>
    </div>
  );
}