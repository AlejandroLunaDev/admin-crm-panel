/**
 * Configuración centralizada para las APIs
 * Sigue el principio SRP al contener sólo configuraciones
 */

// URL base para todas las llamadas a la API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin-crm-panel-back.onrender.com';

/**
 * Obtiene el token de autenticación de las cookies
 * @returns {string|null} - Token de autenticación o null si no existe
 */
export function getAuthToken() {
  if (typeof document === 'undefined') return null;

  const authCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='));

  if (authCookie) {
    return decodeURIComponent(authCookie.split('=')[1]);
  }

  return null;
}

/**
 * Obtiene los headers comunes con autenticación
 * @returns {Object} - Headers con Content-Type, Accept y Authorization si hay token
 */
export function getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// Headers comunes para todas las peticiones (mantener para compatibilidad)
export const commonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

/**
 * Mapea el tipo de usuario al servicio que espera el backend
 * @param {string} userType - Tipo de usuario en el frontend
 * @returns {string} - Servicio en formato para el backend
 */
export function mapUserTypeToService(userType) {
  const serviceMap = {
    persona: 'Persona individual',
    profesional: 'Profesional',
    empresa: 'Empresa'
  };
  return serviceMap[userType] || 'Persona individual';
}

/**
 * Mapea el origen a los valores exactos que espera el backend
 * @param {string} source - Origen en el frontend
 * @returns {string} - Origen en formato para el backend
 */
export function mapSourceToBackend(source) {
  const sourceMap = {
    'Sitio web': 'Sitio web',
    'Formulario Landing': 'Sitio web',
    WhatsApp: 'Whatsapp',
    'Redes sociales': 'Redes sociales',
    Recomendación: 'Referencia',
    Otro: 'Otro',
    LinkedIn: 'LinkedIn'
  };
  return sourceMap[source] || 'Sitio web';
}

/**
 * Maneja errores de respuesta HTTP
 * @param {Response} response - Respuesta del fetch
 * @returns {Promise<string>} - Mensaje de error formateado
 */
export async function handleResponseError(response) {
  let errorText = '';
  try {
    const errorResponse = await response.json();
    errorText = JSON.stringify(errorResponse);
  } catch (parseError) {
    try {
      errorText = await response.text();
    } catch (textError) {
      errorText = 'No se pudo leer la respuesta de error';
    }
  }
  return `Error ${response.status}: ${errorText}`;
}
