// components/NavbarWrapper.js
'use client';

import Navbar from './Babar';
import { usePathname } from 'next/navigation';

export default function NavbarWrapper() {
  const pathname = usePathname();
  // Masquer la navbar sur /login et /register uniquement
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register')
  ) {
    return null;
  }
  return <Navbar pathname={pathname} />;
}
