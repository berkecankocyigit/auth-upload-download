import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authenticate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [masterKey, setMasterKey] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await authenticate(masterKey);
      toast({
        title: "Success",
        description: "Authentication successful",
      });
      // Store the key in localStorage for future API calls
      localStorage.setItem('frontendMasterKey', masterKey);
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
          <p className="mt-2 text-gray-600">Please enter your frontend master key to continue</p>
        </div>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter frontend master key"
            value={masterKey}
            onChange={(e) => setMasterKey(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={isLoading || !masterKey}
          >
            {isLoading ? "Authenticating..." : "Authenticate"}
          </Button>
        </div>
      </div>
    </div>
  );
}