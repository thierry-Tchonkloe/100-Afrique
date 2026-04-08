"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/update-colors.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🎨 Mise à jour des couleurs des catégories...\n');
    const updates = [
        { slug: 'actualites', color: '#E74C3C', name: 'Actualités' },
        { slug: 'reportages-salons', color: '#3498DB', name: 'Reportages Salons' },
        { slug: 'interviews', color: '#2ECC71', name: 'Interviews' },
        { slug: 'destinations', color: '#E67E22', name: 'Destinations' },
        { slug: 'analyses', color: '#9B59B6', name: 'Analyses' },
        { slug: 'magazine', color: '#F39C12', name: 'Magazine' },
    ];
    for (const { slug, color, name } of updates) {
        const result = await prisma.category.updateMany({
            where: { slug },
            data: { color }
        });
        if (result.count > 0) {
            console.log(`✅ ${name.padEnd(25)} → ${color}`);
        }
        else {
            console.log(`⚠️  ${name.padEnd(25)} → Catégorie non trouvée`);
        }
    }
    console.log('\n🎉 Couleurs mises à jour avec succès !');
}
main()
    .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=update-colors.js.map