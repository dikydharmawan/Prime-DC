-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Admin',
    "login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" DATETIME
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama_property" TEXT NOT NULL,
    "group" TEXT,
    "lebar" REAL NOT NULL,
    "panjang" REAL NOT NULL,
    "hadap" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "tingkat" REAL NOT NULL,
    "price" REAL NOT NULL,
    "carport" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "siap" TEXT NOT NULL,
    "maps_link" TEXT,
    "kawasan" TEXT NOT NULL,
    "unit" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Property_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
