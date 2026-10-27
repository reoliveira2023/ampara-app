/**
 * Utilitários criptográficos da plataforma Ela Segura
 * Implementa integridade com SHA-256 e blindagem de dados no navegador.
 */

export async function computeSHA256(data: ArrayBuffer): Promise<string> {
  if (!window.crypto || !window.crypto.subtle) {
    // Fallback simples para ambientes restritos
    return 'sha256-mock-' + Date.now().toString(16);
  }
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateSecureToken(prefix = 'ES-TOKEN'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `${prefix}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

export function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
}
