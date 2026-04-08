-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "chatbot_settings" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'fr',
    "welcomeMessage" TEXT NOT NULL DEFAULT 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd''hui ?',
    "escalationKeywords" JSONB NOT NULL DEFAULT '[]',
    "contactFormUrl" TEXT NOT NULL DEFAULT '/contact/annonceurs',
    "contactFormEnabled" BOOLEAN NOT NULL DEFAULT true,
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
    "failureMessage" TEXT NOT NULL DEFAULT 'Je n''ai pas trouvé de réponse à votre question. Voulez-vous contacter notre équipe pour une assistance personnalisée ?',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chatbot_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chatbot_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chatbot_faqs_isActive_priority_order_idx" ON "chatbot_faqs"("isActive", "priority", "order");
