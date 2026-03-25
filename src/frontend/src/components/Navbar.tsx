import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Leaf, LogIn, LogOut, Settings } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const qc = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            Azolla Blog
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
            data-ocid="nav.link"
          >
            <Settings className="w-4 h-4" />
            Admin
          </Link>

          <Button
            variant={isAuthenticated ? "secondary" : "default"}
            size="sm"
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="flex items-center gap-1.5"
            data-ocid="nav.button"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="w-4 h-4" /> Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />{" "}
                {isLoggingIn ? "Signing in..." : "Login"}
              </>
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
}
