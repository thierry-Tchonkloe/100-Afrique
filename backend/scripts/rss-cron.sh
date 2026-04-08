#!/bin/bash
 
# Script d'automatisation RSS pour iTourisme Nomade
# Exécute l'importation RSS toutes les 6 heures
 
# Configuration
BACKEND_URL="http://localhost:5000"
LOG_FILE="/var/log/itourisme-rss-cron.log"
 
# Fonction de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}
 
# Fonction d'importation RSS
import_rss() {
    log "🚀 Début de l'importation RSS"
    
    # Appel à l'API d'importation RSS
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        "$BACKEND_URL/api/admin/scraper/import")
    
    # Séparer le corps de la réponse et le code HTTP
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        log "✅ Importation RSS réussie"
        log "Réponse: $response_body"
    else
        log "❌ Erreur lors de l'importation RSS (HTTP $http_code)"
        log "Réponse: $response_body"
    fi
    
    log "🏁 Fin de l'importation RSS"
}
 
# Vérifier que le backend est accessible
check_backend() {
    response=$(curl -s -w "%{http_code}" "$BACKEND_URL/api/health" 2>/dev/null)
    if [ "$response" = "200" ]; then
        log "✅ Backend accessible"
        return 0
    else
        log "❌ Backend inaccessible (HTTP $response)"
        return 1
    fi
}
 
# Exécution principale
main() {
    log "🔄 Exécution du cron RSS iTourisme Nomade"
    
    if check_backend; then
        import_rss
    else
        log "❌ Backend non accessible, importation annulée"
        exit 1
    fi
    
    log "✨ Cron RSS terminé"
}
 
# Exécuter la fonction principale
main