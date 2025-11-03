// components/ui/Header.tsx
'use client';

import { 
  UserButton, 
  useUser,
  SignInButton,
  SignedIn,
  SignedOut 
} from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  FileText,
  User,
  CreditCard
} from 'lucide-react';

export default function Header() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'Assessments', href: '/assessments', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">JobPrep Pro</span>
          </Link>

          {/* Navigation - Only show when signed in */}
          <SignedIn>
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </SignedIn>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <SignedIn>
              {/* Show loading state while user data is loading */}
              {!isLoaded ? (
                <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <>
                  {/* Credits Display */}
                  <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      {/* Credits will be managed in our database */}
                      10 credits
                    </span>
                  </div>

                  {/* User Button */}
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                      },
                    }}
                  />
                </>
              )}
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* Mobile Navigation */}
        <SignedIn>
          <nav className="md:hidden flex space-x-4 mt-4 overflow-x-auto pb-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </SignedIn>
      </div>
    </header>
  );
}