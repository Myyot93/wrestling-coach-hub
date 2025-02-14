
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
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
          <div className="mb-6">
            <Link to="/login">
              <Button variant="ghost" className="pl-0 mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
            <h2 className="text-2xl font-bold text-wrestling-dark mb-2">Reset Password</h2>
            <p className="text-wrestling-muted">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>
          <ForgotPasswordForm />
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
