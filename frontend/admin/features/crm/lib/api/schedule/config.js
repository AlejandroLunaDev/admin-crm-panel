/**
 * Configuración de la API de horarios (schedule)
 */

// URL base para la API de horarios
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://admin-crm-panel-back.onrender.com'}/schedule`;

// Headers comunes para todas las peticiones
export const commonHeaders = {
  'Content-Type': 'application/json'
};

/**
 * Obtiene el token de autenticación de las cookies
 * @returns {string|null} El token de autenticación o null si no existe
 */
export const getAuthToken = () => {
  try {
    if (typeof document === 'undefined') return null;

    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='));

    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }

    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='));

    if (token) {
      return token.split('=')[1];
    }

    console.warn('⚠️ No se encontró token en las cookies');
    return null;
  } catch (error) {
    console.error('Error al leer cookie de token:', error);
    return null;
  }
};

/**
 * Configura los headers de autenticación
 * @returns {Object} Headers con el token
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = { ...commonHeaders };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Token incluido en la petición');
  } else {
    console.warn('⚠️ Petición sin token de autenticación');
  }

  return headers;
};

/**
 * Maneja los errores de las peticiones
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<string>} Mensaje de error
 */
export const handleResponseError = async response => {
  try {
    const contentType = response.headers.get('content-type');

    // Si es JSON, intentar obtener el mensaje de error del cuerpo
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      return (
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    // Si no es JSON, devolver el texto
    const errorText = await response.text();
    return errorText || `Error ${response.status}: ${response.statusText}`;
  } catch (error) {
    // Si no podemos leer la respuesta
    return `Error ${response.status}: ${response.statusText}`;
  }
};

/**
 * Procesa la respuesta del servidor
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<Object>} Datos de la respuesta
 */
export const handleResponse = async response => {
  // Verificar si la respuesta es exitosa
  if (!response.ok) {
    const errorMessage = await handleResponseError(response);
    throw new Error(errorMessage);
  }

  // Obtener los datos de la respuesta
  const contentType = response.headers.get('content-type');

  // Si es JSON, devolver el objeto
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  // Si no es JSON, devolver el texto
  return await response.text();
};
