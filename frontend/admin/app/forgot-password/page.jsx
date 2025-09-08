'use client';

import { ForgotPasswordForm } from '@/features/auth/components';
import { useSession } from '@/features/auth/hooks';
import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Página de recuperación de contraseña
 * @returns {JSX.Element} Componente de React
 */
export default function ForgotPasswordPage() {
  const { data: session, isLoading } = useSession();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!isLoading && session.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [session, router, isLoading]);

  return (
    <div
      className='min-h-screen flex items-center justify-center p-6'
      style={{
        backgroundImage: "url('/img/backgroundlogin.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className='w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-lg'>
        <div className='px-8 py-10'>
          <div className='text-center mb-8'>
            <div className='mb-4'>
              <h1 className='text-2xl font-bold text-purple-800 mb-2'>Admin CRM</h1>
              <p className='text-sm text-gray-600'>Panel de Administración</p>
            </div>
          </div>

          <Suspense
            fallback={
              <div className='text-center py-4'>Cargando formulario...</div>
            }
          >
            <ForgotPasswordForm />
          </Suspense>

          <div className='text-center mt-8 text-xs text-gray-500'>
            <p>
              © {new Date().getFullYear()} Admin CRM Panel. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
