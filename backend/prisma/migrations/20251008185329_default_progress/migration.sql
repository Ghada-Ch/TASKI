/*
  Warnings:

  - You are about to drop the column `progress` on the `Task` table. All the data in the column will be lost.
  - Added the required column `Priority` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "progress" SET DEFAULT 'In Progress',
ALTER COLUMN "status" SET DEFAULT 'On Track';

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "progress",
ADD COLUMN     "Priority" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Not Started';
