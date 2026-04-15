import { Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logout } from '../../../features/auth/slices/authSlice';

export default function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center flex-1">
          <button className="p-2 -ml-2 text-gray-400 lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Search */}
          <div className="hidden ml-4 md:block">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tickets, docs..."
                className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
