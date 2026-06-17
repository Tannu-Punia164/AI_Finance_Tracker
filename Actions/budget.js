"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateBudget(amount) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await db.budget.upsert({
      where: {
        userId: user.id, // userId must be UNIQUE in Prisma schema
      },
      update: {
        amount,
      },
      create: {
        userId: user.id,
        amount,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        ...budget,
        amount: budget.amount.toNumber(),
      },
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
}