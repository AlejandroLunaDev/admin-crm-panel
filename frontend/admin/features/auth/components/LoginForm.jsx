'use client';

import { useState } from 'react';
import { useLogin } from '../hooks';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import AccessDeniedModal from './AccessDeniedModal';
import Link from 'next/link';

/**
 * Componente de formulario de login
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.redirectUrl] - URL a la que redirigir después del login
 * @returns {JSX.Element} Componente de React
 */
export default function LoginForm({ redirectUrl = '/dashboard' }) {
  const [credentials, setCredentials] = useState({
    email: 'admin@admin.com',
    password: '123456'
  });
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin(redirectUrl);

  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await login.mutate(credentials);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* Mensaje de demo */}
      <div className='mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg'>
        <div className='flex items-center mb-2'>
          <div className='w-2 h-2 bg-purple-600 rounded-full mr-2'></div>
          <h3 className='text-sm font-semibold text-purple-800'>Demo del Portfolio</h3>
        </div>
        <p className='text-xs text-purple-700 leading-relaxed'>
          Este es un proyecto de demostración. Las credenciales ya están configuradas.
          <br />
          <strong>Solo haz clic en "Iniciar Sesión"</strong> para explorar el panel administrativo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Campos comentados para demo - descomenta si necesitas los inputs */}
        {/*
        <div>
          <Label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Correo electrónico
          </Label>
          <Input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            required
            placeholder='admin@admin.com'
            value={credentials.email}
            onChange={handleChange}
            disabled
            className='w-full h-10 rounded shadow-sm border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed'
          />
        </div>

        <div>
          <div className='flex items-center justify-between mb-1'>
            <Label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Contraseña
            </Label>
            <div className='text-xs'>
              <span className='text-gray-400 cursor-not-allowed'>
                ¿Olvidaste tu contraseña?
              </span>
            </div>
          </div>
          <div className='relative'>
            <Input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              required
              placeholder='123456'
              value={credentials.password}
              onChange={handleChange}
              disabled
              className='w-full h-10 rounded shadow-sm border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed pr-10'
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400'
              onClick={togglePasswordVisibility}
              disabled
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>
        */}

        {login.isError && (
          <Alert variant='destructive' className='py-2'>
            <AlertDescription>
              {login.error?.message || 'Error al iniciar sesión'}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type='submit'
          disabled={login.isPending}
          className='w-full h-10 bg-purple-800 hover:bg-purple-900 text-white rounded'
        >
          {login.isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </form>

      {/* Modal de acceso denegado */}
      <AccessDeniedModal
        isOpen={login.showAccessDenied}
        onClose={login.closeAccessDenied}
      />
    </>
  );
}
