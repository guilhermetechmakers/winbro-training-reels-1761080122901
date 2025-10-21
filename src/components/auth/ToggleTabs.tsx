import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ToggleTabsProps {
  activeTab: 'login' | 'signup';
  onTabChange: (tab: 'login' | 'signup') => void;
  className?: string;
}

const ToggleTabs: React.FC<ToggleTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  className = "" 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'login' | 'signup')}>
      <TabsList className={`grid w-full grid-cols-2 ${className}`}>
        <TabsTrigger 
          value="login" 
          className="text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
        >
          Sign In
        </TabsTrigger>
        <TabsTrigger 
          value="signup" 
          className="text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
        >
          Create Account
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ToggleTabs;