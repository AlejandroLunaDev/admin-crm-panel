/**
 * API para obtener todos los tickets de soporte
 * Implementa la consulta GET a la API de tickets
 */

import {
  API_URL,
  getAuthHeaders,
  mapTicketStatusToFrontend,
  handleResponseError
} from '../config';

/**
 * Obtiene la lista completa de tickets de soporte
 * @param {Object} options - Opciones de paginación y filtrado
 * @returns {Promise<Object>} - Tickets y metadatos de paginación
 */
export async function getTickets(options = {}) {
  try {
    // Configurar los parámetros por defecto
    const params = new URLSearchParams({
      take: options.limit || 500,
      page: options.page || 1
    });

    // Añadir filtros adicionales si existen
    if (options.status) {
      params.append('status', options.status);
    }

    if (options.priority) {
      params.append('priority', options.priority);
    }

    if (options.search) {
      params.append('search', options.search);
    }

    // Añadir parámetros de ordenación - solo usar los valores aceptados por la API
    // La API solo acepta: created_at, updated_at, priority, status, title
    if (options.sort_by) {
      params.append('sort_by', options.sort_by);
    }

    if (options.order) {
      params.append('order', options.order);
    }

    // Para debugging
    console.log('URL Params para tickets:', params.toString());

    // Usar API route local de Next.js para evitar CORS
    const url = `/api/tickets?${params.toString()}`;

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'getTickets.js:56',message:'Fetching tickets via Next.js API route',data:{url,isClient:typeof window!=='undefined',origin:typeof window!=='undefined'?window.location.origin:'server'},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    // Realizar la petición a la API route local (sin necesidad de headers de auth, las cookies se envían automáticamente)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      credentials: 'include'
    });

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'getTickets.js:60',message:'Fetch response received',data:{ok:response.ok,status:response.status,statusText:response.statusText,headers:Object.fromEntries(response.headers.entries())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      // #region agent log
      const errorText = await handleResponseError(response);
      fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'getTickets.js:62',message:'Fetch error occurred',data:{status:response.status,statusText:response.statusText,errorText,isCorsError:errorText.includes('CORS')||errorText.includes('Failed to fetch')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      throw new Error(errorText);
    }

    const data = await response.json();

    // Log para ver la estructura de la respuesta
    console.log('Respuesta API tickets:', {
      estructura: Object.keys(data),
      totalItems: data.data?.length || 0,
      primerItem: data.data?.[0] ? Object.keys(data.data[0]) : null
    });

    // No transformamos los datos aquí, devolvemos la respuesta tal cual para que el adaptador la procese
    return data;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'getTickets.js:88',message:'Exception caught',data:{errorMessage:error.message,errorName:error.name,isCorsError:error.message.includes('CORS')||error.message.includes('Failed to fetch')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.error('Error al obtener tickets:', error);
    throw new Error(`Error al obtener tickets: ${error.message}`);
  }
}
