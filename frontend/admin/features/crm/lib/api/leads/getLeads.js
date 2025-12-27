/**
 * Servicio para obtener leads
 * Sigue el principio SRP al encargarse únicamente de obtener todos los leads
 */

import { API_URL, getAuthHeaders } from './config';

/**
 * Obtiene todos los leads
 * @returns {Promise<Array>} Lista de leads
 */
export async function getLeads() {
  try {
    // Usar API route local de Next.js para evitar CORS
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'getLeads.js:18',message:'Fetching leads via Next.js API route',data:{isClient:typeof window!=='undefined',origin:typeof window!=='undefined'?window.location.origin:'server'},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    const response = await fetch('/api/leads', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      credentials: 'include'
    });

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'getLeads.js:22',message:'Fetch response',data:{ok:response.ok,status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'getLeads.js:23',message:'Fetch error',data:{status:response.status,statusText:response.statusText,errorText,isCorsError:errorText.includes('CORS')||errorText.includes('Failed to fetch')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/99f471bd-c68c-4cd9-83d3-8b91e77dc4de',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'getLeads.js:30',message:'Exception caught',data:{errorMessage:error.message,errorName:error.name,isCorsError:error.message.includes('CORS')||error.message.includes('Failed to fetch')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    throw error;
  }
}
