-- CreateTable
CREATE TABLE "public"."payable" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "emission_date" TIMESTAMP(3) NOT NULL,
    "assignor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "payable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assignor" (
    "id" TEXT NOT NULL,
    "document" VARCHAR(30) NOT NULL,
    "email" VARCHAR(140) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "name" VARCHAR(140) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "assignor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assignor_email_key" ON "public"."assignor"("email");

-- AddForeignKey
ALTER TABLE "public"."payable" ADD CONSTRAINT "payable_assignor_id_fkey" FOREIGN KEY ("assignor_id") REFERENCES "public"."assignor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
