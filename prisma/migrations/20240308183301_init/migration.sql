-- CreateTable
CREATE TABLE "Bairro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Marking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "geojson" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ref" TEXT,
    "fillColor" TEXT NOT NULL,
    "fillOpacity" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "bairroId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Marking_bairroId_fkey" FOREIGN KEY ("bairroId") REFERENCES "Bairro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Marking_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Bairro_nome_key" ON "Bairro"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Marking_code_key" ON "Marking"("code");
