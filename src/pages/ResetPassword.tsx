
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const ResetPassword = () => {
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
            <h2 className="text-2xl font-bold text-wrestling-dark mb-2">Create New Password</h2>
            <p className="text-wrestling-muted">
              Please enter your new password below.
            </p>
          </div>
          <ResetPasswordForm />
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
