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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Welcome</h1>
          <p className="mt-2 text-white/80">Please enter your frontend master key to continue</p>
        </div>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter frontend master key"
            value={masterKey}
            onChange={(e) => setMasterKey(e.target.value)}
            className="bg-white/5 border-[#1A1F2C] dark:border-[#403E43] backdrop-blur-sm focus:border-primary/50 focus:ring-primary/50"
          />
          <Button
            className="w-full bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90 backdrop-blur-sm"
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