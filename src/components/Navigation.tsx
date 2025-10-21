import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Upload, 
  Settings, 
  BarChart3,
  HelpCircle,
  LogOut,
  Shield,
  Users,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser, useAuthActions } from '@/hooks/useAuth';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const { signOut } = useAuthActions();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/library', label: 'Library', icon: BookOpen },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const adminNavigationItems = [
    { path: '/admin', label: 'Admin Dashboard', icon: Shield },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/customers', label: 'Customers', icon: Building2 },
  ];

  const isAdmin = user?.role === 'admin';
  const currentNavigationItems = isAdmin ? [...navigationItems, ...adminNavigationItems] : navigationItems;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className={`bg-card border-b border-border ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Winbro Training</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/admin' && location.pathname.startsWith('/admin'));
              const isAdminItem = adminNavigationItems.includes(item);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isAdminItem
                      ? 'text-secondary hover:text-secondary-foreground hover:bg-secondary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Help Link */}
            <Link
              to="/help"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </Link>

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors duration-200 hover:scale-105"
                title="User Profile"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url} alt={user?.full_name || user?.email} />
                  <AvatarFallback className="text-xs">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-foreground">
                    {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role?.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </Link>

              {/* Sign Out Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;