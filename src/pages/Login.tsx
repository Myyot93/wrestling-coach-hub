
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    toast({
      title: "Coming Soon",
      description: "Login functionality will be implemented in the next phase.",
    });
  };

  return (
    <div className="min-h-screen bg-wrestling-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-wrestling-dark text-center mb-6">
            Coach Login
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-wrestling-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="coach@school.edu"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-wrestling-muted" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-wrestling-accent text-wrestling-dark hover:bg-wrestling-dark hover:text-wrestling-accent border-2 border-wrestling-accent transition-all"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-wrestling-muted hover:text-wrestling-dark transition-colors">
              Forgot your password?
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
