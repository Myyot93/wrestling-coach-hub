
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-wrestling-dark text-wrestling-light py-4 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-wrestling-accent hover:opacity-90 transition-opacity">
            Coal Region Wrestling
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-wrestling-accent transition-colors">
              Home
            </Link>
            <Link to="/login" className="hover:text-wrestling-accent transition-colors">
              Coach Login
            </Link>
            <Button 
              variant="outline"
              className="bg-wrestling-accent text-wrestling-dark hover:bg-wrestling-dark hover:text-wrestling-accent border-2 border-wrestling-accent transition-all"
            >
              Join League
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-wrestling-light hover:text-wrestling-accent transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 animate-slideUp">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-wrestling-light hover:text-wrestling-accent transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-wrestling-light hover:text-wrestling-accent transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Coach Login
              </Link>
              <Button 
                variant="outline"
                className="bg-wrestling-accent text-wrestling-dark hover:bg-wrestling-dark hover:text-wrestling-accent border-2 border-wrestling-accent transition-all w-full"
              >
                Join League
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
