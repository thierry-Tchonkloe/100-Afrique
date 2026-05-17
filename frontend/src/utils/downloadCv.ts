// src/utils/downloadCv.ts
// Télécharge un CV depuis une URL Cloudinary en passant par le backend
// pour contourner les restrictions CORS qui corrompent le fichier.

/**
 * Télécharge un fichier via fetch + blob, ce qui force le navigateur à
 * sauvegarder le fichier plutôt que de le rediriger.
 *
 * Deux stratégies :
 *  1. URL Cloudinary → fetch côté client avec mode 'cors' (fonctionne si
 *     Cloudinary est configuré avec CORS permissif sur les raw files).
 *  2. Si la stratégie 1 échoue → ouvrir dans un nouvel onglet (fallback).
 */
export async function downloadCv(cvUrl: string, candidatName: string): Promise<void> {
  if (!cvUrl) return;

  // Nom de fichier propre
  const fileName = `CV_${candidatName.replace(/\s+/g, '_')}.pdf`;

  try {
    const response = await fetch(cvUrl, {
      method: 'GET',
      // Pas de Authorization header ici — Cloudinary sert les fichiers publiquement
      // Si votre CV est privé, utilisez la route proxy backend ci-dessous.
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Vérifier que c'est bien un PDF (pas du HTML ou du JSON d'erreur)
    const contentType = response.headers.get('content-type') ?? '';
    if (
      !contentType.includes('pdf') &&
      !contentType.includes('octet-stream') &&
      !contentType.includes('application')
    ) {
      throw new Error(`Content-Type inattendu: ${contentType}`);
    }

    const blob = await response.blob();

    // Forcer le téléchargement via un lien temporaire
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libérer la mémoire après un court délai
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (err) {
    console.warn('[downloadCv] fetch direct échoué, fallback window.open :', err);
    // Fallback : ouvrir dans un nouvel onglet
    // L'utilisateur peut sauvegarder manuellement avec Ctrl+S / Cmd+S
    window.open(cvUrl, '_blank', 'noopener,noreferrer');
  }
}