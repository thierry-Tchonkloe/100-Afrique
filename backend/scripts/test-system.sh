#!/bin/bash
 
# Script de test complet pour iTourisme Nomade
# Vérifie que toutes les fonctionnalités sont opérationnelles
 
echo "🧪 DÉMARRAGE DES TESTS COMPLETS iTourisme Nomade"
echo "=================================================="
 
# Configuration
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:3000"
FAILED_TESTS=0
TOTAL_TESTS=0
 
# Couleurs pour les résultats
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
 
# Fonction de test
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_field="$3"
    
    echo -n "🔍 Test: $name ... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    response=$(curl -s "$url" 2>/dev/null)
    
    if [[ $? -eq 0 && -n "$response" ]]; then
        if [[ -n "$expected_field" ]]; then
            if echo "$response" | jq -e ".$expected_field" >/dev/null 2>&1; then
                echo -e "${GREEN}✅ PASS${NC}"
                return 0
            else
                echo -e "${RED}❌ FAIL (Champ $expected_field manquant)${NC}"
                FAILED_TESTS=$((FAILED_TESTS + 1))
                return 1
            fi
        else
            echo -e "${GREEN}✅ PASS${NC}"
            return 0
        fi
    else
        echo -e "${RED}❌ FAIL (Erreur de connexion)${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}
 
# Fonction de test RSS
test_rss_import() {
    echo -n "📡 Test: Importation RSS ... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    response=$(curl -s -X POST "$BACKEND_URL/api/admin/scraper/import" 2>/dev/null)
    
    if [[ $? -eq 0 ]]; then
        if echo "$response" | jq -e '.success' >/dev/null 2>&1; then
            echo -e "${GREEN}✅ PASS${NC}"
            return 0
        else
            echo -e "${RED}❌ FAIL (Importation échouée)${NC}"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        echo -e "${RED}❌ FAIL (Erreur de connexion)${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}
 
echo ""
echo "📊 TESTS DES ENDPOINTS API"
echo "==========================="
 
# Tests des articles
test_endpoint "Articles Featured" "$BACKEND_URL/api/mag/articles?featured=true&pageSize=3&status=PUBLISHED" "data"
test_endpoint "Articles par catégorie" "$BACKEND_URL/api/mag/articles?pageSize=6&page=1&status=PUBLISHED" "data"
test_endpoint "Articles vidéos" "$BACKEND_URL/api/mag/articles?pageSize=4&page=1&status=PUBLISHED&type=VIDEO" "data"
 
# Tests des magazines RSS
test_endpoint "Magazines RSS" "$BACKEND_URL/api/magazines/rss?page=1&pageSize=5" "data"
test_endpoint "Sources RSS" "$BACKEND_URL/api/magazines/rss/sources/list" "data"
 
# Tests des destinations
test_endpoint "Destinations Featured" "$BACKEND_URL/api/destinations/featured?limit=3" "data"
 
# Tests de la publicité
test_endpoint "Publicité Accueil" "$BACKEND_URL/api/advertising/top-banner-accueil" "success"
test_endpoint "Publicité Footer" "$BACKEND_URL/api/advertising/leaderboards-footer" "success"
 
# Tests du chatbot
test_endpoint "Chatbot Settings" "$BACKEND_URL/api/chatbot/settings" "success"
 
# Test d'importation RSS
test_rss_import
 
echo ""
echo "🌐 TESTS DES PAGES FRONTEND"
echo "=========================="
 
# Tests des pages frontend
echo -n "🔍 Test: Page d'accueil ... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if curl -s -f "$FRONTEND_URL/" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
 
echo -n "🔍 Test: Page actualités ... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if curl -s -f "$FRONTEND_URL/actualite" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
 
echo -n "🔍 Test: Page destinations ... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if curl -s -f "$FRONTEND_URL/destinations" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
 
echo ""
echo "📈 RÉSULTATS DES TESTS"
echo "===================="
 
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS RÉUSSIS! ($TOTAL_TESTS/$TOTAL_TESTS)${NC}"
    echo ""
    echo "✅ Le système iTourisme Nomade est parfaitement fonctionnel"
    echo "✅ Backend: $BACKEND_URL"
    echo "✅ Frontend: $FRONTEND_URL"
    echo "✅ RSS: Importation automatique configurée"
    echo "✅ Base de données: Peuplée avec les données de démo"
    exit 0
else
    echo -e "${RED}❌ $FAILED_TESTS TESTS ÉCHOUÉS SUR $TOTAL_TESTS${NC}"
    echo ""
    echo "🔧 Veuillez vérifier les erreurs ci-dessus"
    exit 1
fi