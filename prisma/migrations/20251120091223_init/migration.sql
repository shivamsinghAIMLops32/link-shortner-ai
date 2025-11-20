-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "customAlias" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortCode_key" ON "Link"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Link_customAlias_key" ON "Link"("customAlias");

-- CreateIndex
CREATE INDEX "Link_shortCode_idx" ON "Link"("shortCode");

-- CreateIndex
CREATE INDEX "Link_userId_idx" ON "Link"("userId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
