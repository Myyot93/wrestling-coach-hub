
import { motion } from "framer-motion";
import { ArrowRight, Award, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Calendar className="h-12 w-12 text-wrestling-accent" />,
      title: "Match Scheduling",
      description: "Easy access to upcoming matches and tournament schedules",
    },
    {
      icon: <Users className="h-12 w-12 text-wrestling-accent" />,
      title: "Team Management",
      description: "Comprehensive tools for managing your wrestling team",
    },
    {
      icon: <Award className="h-12 w-12 text-wrestling-accent" />,
      title: "Statistics Tracking",
      description: "Detailed statistics and performance analytics",
    },
  ];

  return (
    <div className="min-h-screen bg-wrestling-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-wrestling-light mb-6"
          >
            Coal Region Wrestling
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-wrestling-muted text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            The premier platform for high school wrestling coaches to manage teams, track statistics, and coordinate matches across the Coal Region.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/login">
              <Button className="bg-wrestling-accent text-wrestling-dark hover:bg-wrestling-dark hover:text-wrestling-accent border-2 border-wrestling-accent transition-all px-8 py-6 text-lg">
                Coach Login
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-wrestling-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-wrestling-dark text-center mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-wrestling-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-wrestling-muted">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wrestling-dark text-wrestling-light py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-wrestling-muted">
            © {new Date().getFullYear()} Coal Region Wrestling. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
