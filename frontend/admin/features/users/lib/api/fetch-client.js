/**
 * Cliente Fetch para solicitudes API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin-crm-panel-back.onrender.com/api';

/**
 * Obtiene el token de autenticación de las cookies
 * @returns {string|null} - Token de autenticación o null si no existe
 */
function getAuthToken() {
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
 * Cliente Fetch con configuración base
 */
const fetchClient = {
  /**
   * Método GET
   * @param {string} endpoint - Endpoint a consultar
   * @returns {Promise<any>} - Promesa con los datos de respuesta
   */
  async get(endpoint) {
    try {
      // Usar API route local de Next.js para evitar CORS
      // Mapear endpoints del backend a rutas locales de Next.js
      let localEndpoint = endpoint;
      if (endpoint === '/users') {
        localEndpoint = '/api/users';
      } else if (endpoint.startsWith('/users/')) {
        // Para endpoints específicos de usuarios, mantener la estructura pero usar API route
        localEndpoint = `/api${endpoint}`;
      } else {
        // Para otros endpoints, usar directamente (pueden ser rutas internas)
        localEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
      }

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fetch-client.js:39',message:'Fetching via Next.js API route',data:{endpoint,localEndpoint,isClient:typeof window!=='undefined',origin:typeof window!=='undefined'?window.location.origin:'server'},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      const response = await fetch(localEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        credentials: 'include'
      });

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fetch-client.js:48',message:'Fetch response',data:{ok:response.ok,status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        // Parse el cuerpo de la respuesta para obtener el mensaje de error
        const errorData = await response.json().catch(() => ({}));

        // Crear un objeto de error mejorado
        const error = new Error(
          errorData.message || `Error: ${response.status}`
        );
        error.statusCode = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fetch-client.js:70',message:'Exception caught in get method',data:{errorMessage:error.message,errorName:error.name,isCorsError:error.message.includes('CORS')||error.message.includes('Failed to fetch')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // Si ya es un error estructurado, lo propagamos
      if (error.statusCode) {
        throw error;
      }

      // De lo contrario, creamos un error genérico
      console.error('Fetch Error:', error);
      throw error;
    }
  },

  /**
   * Método POST
   * @param {string} endpoint - Endpoint a consultar
   * @param {object} data - Datos a enviar
   * @returns {Promise<any>} - Promesa con los datos de respuesta
   */
  async post(endpoint, data) {
    try {
      console.log(`Enviando POST a ${API_URL}${endpoint} con datos:`, data);

      // Obtener token de autenticación
      const authToken = getAuthToken();

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : ''
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      console.log(`Respuesta de ${endpoint}:`, responseData);

      // Si la respuesta no es ok (código 4xx o 5xx)
      if (!response.ok) {
        // Extraer mensaje de error del cuerpo de la respuesta
        let errorMessage = 'Error de servidor';

        // Buscar el mensaje en varias posibles ubicaciones
        if (responseData.response && responseData.response.message) {
          errorMessage = responseData.response.message;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }

        const error = new Error(errorMessage);
        error.statusCode = response.status;
        error.data = responseData;
        throw error;
      }

      // Verificar si hay un mensaje de error en la respuesta aunque el código sea 200
      if (
        responseData.error ||
        (responseData.message &&
          typeof responseData.message === 'string' &&
          (responseData.message.toLowerCase().includes('error') ||
            responseData.message.includes('ya registrado')))
      ) {
        let errorMessage =
          responseData.message || responseData.error || 'Error en la respuesta';

        const error = new Error(errorMessage);
        error.statusCode = response.status;
        error.data = responseData;
        throw error;
      }

      return responseData;
    } catch (error) {
      // Si ya es un error estructurado, lo propagamos
      if (error.statusCode) {
        throw error;
      }

      // De lo contrario, creamos un error genérico
      console.error('Fetch Error:', error);
      throw error;
    }
  },

  /**
   * Método PUT
   * @param {string} endpoint - Endpoint a consultar
   * @param {object} data - Datos a enviar
   * @returns {Promise<any>} - Promesa con los datos de respuesta
   */
  async put(endpoint, data) {
    try {
      // Obtener token de autenticación
      const authToken = getAuthToken();

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : ''
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        // Parse el cuerpo de la respuesta para obtener el mensaje de error
        const errorData = await response.json().catch(() => ({}));

        // Crear un objeto de error mejorado
        const error = new Error(
          errorData.message || `Error: ${response.status}`
        );
        error.statusCode = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Si ya es un error estructurado, lo propagamos
      if (error.statusCode) {
        throw error;
      }

      // De lo contrario, creamos un error genérico
      console.error('Fetch Error:', error);
      throw error;
    }
  },

  /**
   * Método DELETE
   * @param {string} endpoint - Endpoint a consultar
   * @returns {Promise<any>} - Promesa con los datos de respuesta
   */
  async delete(endpoint) {
    try {
      // Obtener token de autenticación
      const authToken = getAuthToken();

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : ''
        },
        credentials: 'include'
      });

      if (!response.ok) {
        // Parse el cuerpo de la respuesta para obtener el mensaje de error
        const errorData = await response.json().catch(() => ({}));

        // Crear un objeto de error mejorado
        const error = new Error(
          errorData.message || `Error: ${response.status}`
        );
        error.statusCode = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Si ya es un error estructurado, lo propagamos
      if (error.statusCode) {
        throw error;
      }

      // De lo contrario, creamos un error genérico
      console.error('Fetch Error:', error);
      throw error;
    }
  }
};

export default fetchClient;
