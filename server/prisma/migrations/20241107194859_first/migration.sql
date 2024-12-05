-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Dispatched', 'Delivered');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'User');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParcelDetails" (
    "id" TEXT NOT NULL,
    "parcelName" TEXT NOT NULL,
    "parcelPrice" TEXT NOT NULL,
    "parcelDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL,
    "parcelTrackingNumber" TEXT NOT NULL,
    "parcelWeight" DOUBLE PRECISION NOT NULL,
    "senderFirstName" TEXT NOT NULL,
    "senderLastName" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "senderPhoneNumber" TEXT NOT NULL,
    "senderAddress" TEXT NOT NULL,
    "receiverFirstName" TEXT NOT NULL,
    "receiverLastName" TEXT NOT NULL,
    "receiverEmail" TEXT NOT NULL,
    "receiverPhoneNumber" TEXT NOT NULL,
    "receiverAddress" TEXT NOT NULL,

    CONSTRAINT "ParcelDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
