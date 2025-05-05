import { useState } from "react";
import { Link } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import { Menu, X, Shield } from "lucide-react";

const Header = () => {
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
                <Shield className="h-8 w-8 text-trust-green" />
                <h1 className="ml-2 text-2xl font-bold font-roboto">WebTrust</h1>
            </Link>
          </div>
          
          {isMobile ? (
            <>
              <button
                type="button"
                className="text-gray-500 hover:text-text focus:outline-none"
                onClick={toggleMenu}
              >
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              
              {menuOpen && (
                <nav className="absolute top-16 left-0 right-0 bg-white shadow-md py-4 px-4 z-10">
                  <div className="flex flex-col space-y-4">
                    <Link href="/" className="text-text hover:text-trust-green font-medium">
                      Home
                    </Link>
                    <Link href="/blog" className="text-text hover:text-trust-green font-medium">
                      Blog
                    </Link>
                    <Link href="/about" className="text-text hover:text-trust-green font-medium">
                      About
                    </Link>
                  </div>
                </nav>
              )}
            </>
          ) : (
            <nav className="flex space-x-8">
              <Link href="/" className="text-text hover:text-trust-green font-medium">
                Home
              </Link>
              <Link href="/blog" className="text-text hover:text-trust-green font-medium">
                Blog
              </Link>
              <Link href="/about" className="text-text hover:text-trust-green font-medium">
                About
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
