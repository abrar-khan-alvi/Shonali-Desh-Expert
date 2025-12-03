import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, User, LogOut, Sprout } from 'lucide-react';
import { useExpert } from '../context/ExpertContext';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { expert, logout } = useExpert();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-background-light">
      {/* Sidebar */}
      <aside className="w-72 bg-primary-green text-white flex flex-col fixed h-full z-20 shadow-xl">
        <div className="p-8 border-b border-[#1e523a] flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <Sprout className="w-8 h-8 text-accent-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Shonali Desh</h1>
            <p className="text-xs text-green-100 opacity-80">Expert Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-4 rounded-lg transition-all ${isActive
                  ? 'bg-white text-primary-green font-semibold shadow-md'
                  : 'text-green-50 hover:bg-[#1e523a] hover:text-white'
                }`
              }
            >
              <item.icon className={`w-5 h-5 ${({ isActive }: { isActive: boolean }) => isActive ? 'text-primary-green' : 'text-green-200'}`} />
              <span className="text-lg">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-[#1e523a]">
          <div className="flex items-center space-x-3 mb-6 px-2">
            <img
              src={expert?.profilePhotoUrl || expert?.metadata?.photo || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-accent-gold object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-base font-medium text-white truncate">{expert?.metadata?.name || expert?.name || 'Expert'}</p>
              <p className="text-sm text-green-200 truncate">ID: {expert?.id || '...'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-[#1e523a] hover:bg-[#18422f] text-white py-3 rounded-lg transition-colors text-base font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;