import React from 'react';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';

/**
 * Componente que maneja la visualización del título en el sidebar
 * Muestra "Admin Panel" para uso en portfolio
 */
export function SidebarLogo({ expanded, className }) {
  return (
    <Link href='/' className={cn('flex items-center', className)}>
      {expanded ? (
        // Título completo para sidebar expandido
        <h1 className='text-xl font-bold text-white'>
          Admin Panel
        </h1>
      ) : (
        // Título reducido para sidebar colapsado
        <h1 className='text-lg font-bold text-white'>
          AP
        </h1>
      )}
    </Link>
  );
}

export default SidebarLogo;
