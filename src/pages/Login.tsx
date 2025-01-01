import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authenticate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await authenticate();
      toast({
        title: "Success",
        description: "Authentication successful",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="mt-2 text-gray-600">Please authenticate to continue</p>
        </div>
        <Button
          className="w-full"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Authenticating..." : "Authenticate"}
        </Button>
      </div>
    </div>
  );
}