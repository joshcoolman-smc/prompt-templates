# Global Header Component

## Overview
Create a responsive global header/navigation component that adapts to various screen sizes while maintaining brand identity and providing intuitive navigation for users. This header will serve as the primary navigation element for your website.

## Requirements

### Component Requirements
- Responsive design that works on mobile, tablet, and desktop
- Brand logo/wordmark display
- Primary navigation with dropdown support
- Mobile navigation with hamburger menu
- Optional secondary navigation area (e.g., for user account, search)
- Accessibility compliance (keyboard navigation, ARIA attributes)
- Sticky positioning option with scroll behavior
### Implementation Steps

#### 1. Setup Component Structure

Create the following files:
- `src/components/Header/index.tsx` - Main component
- `src/components/Header/Header.tsx` - Component implementation
- `src/components/Header/MobileMenu.tsx` - Mobile navigation
- `src/components/Header/DesktopMenu.tsx` - Desktop navigation
- `src/components/Header/NavItem.tsx` - Navigation item with dropdown support
- `src/components/Header/Logo.tsx` - Logo component

#### 2. Define Types

Create `src/components/Header/types.ts`:

```typescript
export interface NavItemType {
  label: string;
  href: string;
  children?: NavItemType[];
  icon?: React.ReactNode;
}

export interface HeaderProps {
  /** Site logo/wordmark (component or image URL) */
  logo: React.ReactNode | string;
  
  /** Alt text for logo if it's an image */
  logoAlt?: string;
  
  /** Primary navigation items */
  navItems: NavItemType[];
  
  /** Whether header should stick to top when scrolling */
  sticky?: boolean;
  
  /** Show shadow when scrolled */
  scrollShadow?: boolean;
  
  /** Additional classes to apply to header */
  className?: string;
  
  /** Secondary navigation area content */
  secondaryNav?: React.ReactNode;
}
```
#### 3. Implement Logo Component

Create `src/components/Header/Logo.tsx`:

```tsx
import { Link } from 'react-router-dom';

interface LogoProps {
  logo: React.ReactNode | string;
  logoAlt?: string;
}

export function Logo({ logo, logoAlt = 'Logo' }: LogoProps) {
  return (
    <Link to="/" className="flex items-center">
      {typeof logo === 'string' ? (
        <img src={logo} alt={logoAlt} className="h-8 w-auto" />
      ) : (
        logo
      )}
    </Link>
  );
}
```

#### 4. Implement Navigation Item Component

Create `src/components/Header/NavItem.tsx`:

```tsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavItemType } from './types';

interface NavItemProps {
  item: NavItemType;
  isMobile?: boolean;
}

export function NavItem({ item, isMobile = false }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      setIsOpen(!isOpen);
    }
  };
  
  // If no children, render a simple link
  if (!item.children?.length) {
    return (
      <Link 
        to={item.href}
        className={`
          flex items-center px-3 py-2 rounded-md text-sm font-medium
          text-gray-700 hover:text-gray-900 hover:bg-gray-100
          focus:outline-none focus:ring-2 focus:ring-primary-500
          ${isMobile ? 'w-full' : ''}
        `}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}
        {item.label}
      </Link>
    );
  }
  
  // With children, render a dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`
          flex items-center px-3 py-2 rounded-md text-sm font-medium
          text-gray-700 hover:text-gray-900 hover:bg-gray-100
          focus:outline-none focus:ring-2 focus:ring-primary-500
          ${isMobile ? 'w-full justify-between' : ''}
        `}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center">
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </span>
        <svg
          className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            ${isMobile ? 'static w-full pl-4 mt-1' : 'absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'}
          `}
          role="menu"
          aria-orientation="vertical"
        >
          <div className={`py-1 ${isMobile ? 'border-l-2 border-gray-200' : ''}`} role="none">
            {item.children.map((child, idx) => (
              <Link
                key={idx}
                to={child.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center">
                  {child.icon && <span className="mr-2">{child.icon}</span>}
                  {child.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

#### 5. Implement Desktop Menu

Create `src/components/Header/DesktopMenu.tsx`:

```tsx
import { NavItem } from './NavItem';
import { NavItemType } from './types';
interface DesktopMenuProps {
  navItems: NavItemType[];
  secondaryNav?: React.ReactNode;
}

export function DesktopMenu({ navItems, secondaryNav }: DesktopMenuProps) {
  return (
    <div className="hidden md:flex md:justify-between md:flex-1">
      <div className="flex space-x-2">
        {navItems.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </div>
      
      {secondaryNav && (
        <div className="flex items-center">
          {secondaryNav}
        </div>
      )}
    </div>
  );
}
```

#### 6. Implement Mobile Menu

Create `src/components/Header/MobileMenu.tsx`:

```tsx
import { useState } from 'react';
import { NavItem } from './NavItem';
import { NavItemType } from './types';

interface MobileMenuProps {
  navItems: NavItemType[];
  secondaryNav?: React.ReactNode;
}

export function MobileMenu({ navItems, secondaryNav }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
        {/* Icon when menu is closed */}
        <svg
          className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {/* Icon when menu is open */}
        <svg
          className={`h-6 w-6 ${isOpen ? 'block' : 'hidden'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Mobile menu panel */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } absolute z-20 top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item, index) => (
            <div key={index} className="block">
              <NavItem item={item} isMobile />
            </div>
          ))}
        </div>
        
        {secondaryNav && (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              {secondaryNav}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```
#### 7. Implement Main Header Component

Create `src/components/Header/Header.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';
import { HeaderProps } from './types';

export function Header({
  logo,
  logoAlt = 'Site logo',
  navItems,
  sticky = false,
  scrollShadow = true,
  className = '',
  secondaryNav,
}: HeaderProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Track scroll position to add shadow
  useEffect(() => {
    if (!sticky && !scrollShadow) return;
    
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky, scrollShadow]);
  
  return (
    <header
      className={`
        bg-white w-full ${sticky ? 'sticky top-0 z-50' : ''}
        ${hasScrolled && scrollShadow ? 'shadow-md' : ''}
        transition-shadow duration-300 ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo logo={logo} logoAlt={logoAlt} />
          </div>
          
          {/* Desktop navigation */}
          <DesktopMenu navItems={navItems} secondaryNav={secondaryNav} />
          
          {/* Mobile navigation */}
          <MobileMenu navItems={navItems} secondaryNav={secondaryNav} />
        </div>
      </div>
    </header>
  );
}
```

#### 8. Create Barrel File for Easy Imports

Create `src/components/Header/index.tsx`:

```tsx
export { Header } from './Header';
export type { HeaderProps, NavItemType } from './types';
```

#### 9. Implement Header in Layout

Update your layout component to use the new Header:

```tsx
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';

export function RootLayout() {
  const navItems = [
    { 
      label: 'Home', 
      href: '/' 
    },
    { 
      label: 'About', 
      href: '/about' 
    },
    { 
      label: 'Services', 
      href: '/services',
      children: [
        { label: 'Web Development', href: '/services/web-development' },
        { label: 'Mobile Apps', href: '/services/mobile-apps' },
        { label: 'UI/UX Design', href: '/services/design' },
      ]
    },
    { 
      label: 'Portfolio', 
      href: '/portfolio' 
    },
    { 
      label: 'Contact', 
      href: '/contact' 
    },
  ];
  
  const secondaryNav = (
    <div className="flex items-center space-x-4">
      <a 
        href="/login" 
        className="text-sm font-medium text-primary-600 hover:text-primary-500"
      >
        Log in
      </a>
      <a 
        href="/signup" 
        className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-500"
      >
        Sign up
      </a>
    </div>
  );
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        logo="/logo.svg"
        logoAlt="Your Company"
        navItems={navItems}
        secondaryNav={secondaryNav}
        sticky
        scrollShadow
      />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
```

### Expected Output

A fully functional responsive Header component that:

- Displays your logo/brand
- Shows navigation links with dropdown support
- Collapses to a mobile-friendly menu on smaller screens
- Provides accessibility features (keyboard navigation, ARIA attributes)
- Optionally sticks to the top of the viewport
- Shows/hides shadow based on scroll position
- Allows for secondary navigation elements
### Component Usage

```tsx
import { Header } from '@/components/Header';

// In your layout or page
function MyPage() {
  const navItems = [
    { label: 'Home', href: '/' },
    { 
      label: 'Products', 
      href: '/products',
      children: [
        { label: 'Category A', href: '/products/category-a' },
        { label: 'Category B', href: '/products/category-b' },
      ]
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  
  return (
    <>
      <Header
        logo="/path/to/logo.svg"
        logoAlt="Company Name"
        navItems={navItems}
        sticky
        secondaryNav={<button>Login</button>}
      />
      
      {/* Rest of your page */}
    </>
  );
}
```

### Design Considerations

- **Consistency**: The header styling should align with your overall design system
- **Performance**: The sticky header should not cause layout shifts or performance issues
- **Accessibility**: Ensure keyboard navigation works correctly, ARIA attributes are properly set
- **Responsiveness**: Test the header on various screen sizes to ensure proper display
- **User Experience**: Dropdown menus should be intuitive and easy to navigate

### Next Steps

After implementing the header component, consider:

1. Adding animation to the mobile menu open/close
2. Implementing a search feature in the header
3. Adding a dark mode version
4. Creating a condensed version that appears on scroll for long pages
5. Adding user authentication states (logged in/out) to the secondary navigation