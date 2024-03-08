-- CreateTable
CREATE TABLE "Utente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nome" TEXT NOT NULL,
    "bi" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "nascimento" DATETIME,
    "morada" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "Terreno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "estado" TEXT DEFAULT 'Pendente',
    "proprietarioId" INTEGER NOT NULL,
    "markingId" INTEGER NOT NULL,
    CONSTRAINT "Terreno_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Terreno_markingId_fkey" FOREIGN KEY ("markingId") REFERENCES "Marking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Licenca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "descricao" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "terrenoId" INTEGER NOT NULL,
    CONSTRAINT "Licenca_terrenoId_fkey" FOREIGN KEY ("terrenoId") REFERENCES "Terreno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Utente_bi_key" ON "Utente"("bi");

-- CreateIndex
CREATE UNIQUE INDEX "Utente_telefone_key" ON "Utente"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Utente_email_key" ON "Utente"("email");
