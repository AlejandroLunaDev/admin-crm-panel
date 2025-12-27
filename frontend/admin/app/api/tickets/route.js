import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://admin-crm-panel-back.onrender.com/api';

/**
 * API route proxy para tickets de soporte
 * Evita problemas de CORS haciendo las peticiones desde el servidor
 */
export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);

    const backendUrl = `${BACKEND_API_URL}/support-tickets?${params.toString()}`;

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({
        message: 'Error al obtener tickets'
      }));
      return NextResponse.json(
        { error: errorData.message || 'Error al obtener tickets' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error en API de tickets:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

