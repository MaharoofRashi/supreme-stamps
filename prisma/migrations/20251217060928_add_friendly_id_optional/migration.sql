-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "friendlyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT NOT NULL,
    "deliveryMethod" TEXT NOT NULL DEFAULT 'DELIVERY',
    "address" TEXT,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "paymentId" TEXT,
    "paymentStatus" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "companyName" TEXT,
    "companyNameAr" TEXT,
    "licenseNumber" TEXT,
    "emirate" TEXT,
    "hasLogo" BOOLEAN NOT NULL,
    "tradeLicenseUrl" TEXT,
    "logoUrl" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_friendlyId_key" ON "Order"("friendlyId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
