"use server";
import { db } from "@/index";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  interviewDates,
  rushee,
  rusheeAvailabilities,
  userAvailabilities,
  interviewAssignments,
} from "@/db/schema";
import { user } from "@/db/auth-schema";
import { checkSession } from "@/lib/auth-server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

// Helper function to increment interview count for users
async function incrementInterviewCount(userIds: string[]) {
  const now = new Date();
  for (const userId of userIds) {
    await db
      .update(user)
      .set({
        interviewCount: sql`${user.interviewCount} + 1`,
        updatedAt: now,
      })
      .where(eq(user.id, userId));
  }
}

// Helper function to decrement interview count for users (with validation)
async function decrementInterviewCount(userIds: string[]) {
  const now = new Date();
  for (const userId of userIds) {
    // First check current count to prevent negative values
    const currentUser = await db
      .select({ interviewCount: user.interviewCount })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (currentUser.length > 0 && currentUser[0].interviewCount > 0) {
      await db
        .update(user)
        .set({
          interviewCount: sql`${user.interviewCount} - 1`,
          updatedAt: now,
        })
        .where(eq(user.id, userId));
    }
  }
}

// Fetch all data needed for the interview scheduler
export async function getInterviewSchedulerData() {
  try {
    await checkSession();

    // Fetch interview dates
    const interviewDatesData = await db
      .select()
      .from(interviewDates)
      .orderBy(desc(interviewDates.date));

    // Fetch all rushees
    const rusheesData = await db.select().from(rushee).orderBy(rushee.name);

    // Fetch rushee availabilities with rushee data
    const rusheeAvailabilitiesData = await db
      .select({
        id: rusheeAvailabilities.id,
        rusheeId: rusheeAvailabilities.rusheeId,
        interviewDateId: rusheeAvailabilities.interviewDateId,
        date: rusheeAvailabilities.date,
        startTime: rusheeAvailabilities.startTime,
        endTime: rusheeAvailabilities.endTime,
        createdAt: rusheeAvailabilities.createdAt,
        updatedAt: rusheeAvailabilities.updatedAt,
        rushee: {
          id: rushee.id,
          name: rushee.name,
          email: rushee.email,
          phoneNumber: rushee.phoneNumber,
          major: rushee.major,
          interviewScheduled: rushee.interviewScheduled,
          createdAt: rushee.createdAt,
          updatedAt: rushee.updatedAt,
        },
      })
      .from(rusheeAvailabilities)
      .leftJoin(rushee, eq(rusheeAvailabilities.rusheeId, rushee.id));

    // Fetch user availabilities with user data
    const userAvailabilitiesData = await db
      .select({
        id: userAvailabilities.id,
        userId: userAvailabilities.userId,
        interviewDateId: userAvailabilities.interviewDateId,
        date: userAvailabilities.date,
        startTime: userAvailabilities.startTime,
        endTime: userAvailabilities.endTime,
        createdAt: userAvailabilities.createdAt,
        updatedAt: userAvailabilities.updatedAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          interviewCount: user.interviewCount,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
      .from(userAvailabilities)
      .leftJoin(user, eq(userAvailabilities.userId, user.id));

    // Fetch existing interview assignments with related data
    const interviewAssignmentsData = await db
      .select({
        id: interviewAssignments.id,
        rusheeId: interviewAssignments.rusheeId,
        interviewDateId: interviewAssignments.interviewDateId,
        startTime: interviewAssignments.startTime,
        endTime: interviewAssignments.endTime,
        interviewer1Id: interviewAssignments.interviewer1Id,
        interviewer2Id: interviewAssignments.interviewer2Id,
        createdAt: interviewAssignments.createdAt,
        updatedAt: interviewAssignments.updatedAt,
        rushee: {
          id: rushee.id,
          name: rushee.name,
          email: rushee.email,
          phoneNumber: rushee.phoneNumber,
          major: rushee.major,
          interviewScheduled: rushee.interviewScheduled,
          createdAt: rushee.createdAt,
          updatedAt: rushee.updatedAt,
        },
        interviewer1: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          interviewCount: user.interviewCount,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
      .from(interviewAssignments)
      .leftJoin(rushee, eq(interviewAssignments.rusheeId, rushee.id))
      .leftJoin(user, eq(interviewAssignments.interviewer1Id, user.id));

    // Fetch interviewer2 data separately and merge
    const interviewer2Data = await db
      .select({
        assignmentId: interviewAssignments.id,
        interviewer2: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          interviewCount: user.interviewCount,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
      .from(interviewAssignments)
      .leftJoin(user, eq(interviewAssignments.interviewer2Id, user.id));

    // Merge interviewer2 data
    const mergedAssignments = interviewAssignmentsData.map((assignment) => {
      const interviewer2 = interviewer2Data.find(
        (i2) => i2.assignmentId === assignment.id
      );
      return {
        ...assignment,
        interviewer2: interviewer2?.interviewer2 || null,
      };
    });

    return {
      interviewDates: interviewDatesData,
      rushees: rusheesData,
      rusheeAvailabilities: rusheeAvailabilitiesData,
      userAvailabilities: userAvailabilitiesData,
      interviewAssignments: mergedAssignments,
    };
  } catch (error) {
    console.error("Error fetching interview scheduler data:", error);
    throw new Error("Failed to fetch interview scheduler data");
  }
}

// Create or update interview assignment
export async function createInterviewAssignment(formData: FormData) {
  try {
    await checkSession();

    const slot = formData.get("slot") as string;
    const rusheeId = formData.get("rusheeId") as string;
    const interviewDateId = formData.get("interviewDateId") as string;
    const selectedUsers = JSON.parse(
      formData.get("selectedUsers") as string
    ) as string[];

    if (
      !slot ||
      !rusheeId ||
      !interviewDateId ||
      !selectedUsers ||
      selectedUsers.length !== 2
    ) {
      throw new Error("Invalid form data");
    }

    const slotStart = new Date(slot);
    const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000); // 30 minutes later

    // Check if assignment already exists for this slot
    const existingAssignment = await db
      .select()
      .from(interviewAssignments)
      .where(
        and(
          eq(interviewAssignments.rusheeId, rusheeId),
          eq(interviewAssignments.interviewDateId, interviewDateId),
          eq(interviewAssignments.startTime, slotStart)
        )
      )
      .limit(1);

    const now = new Date();
    const assignmentId = uuidv4();

    if (existingAssignment.length > 0) {
      // Get the old interviewers to decrement their counts
      const oldInterviewers = [
        existingAssignment[0].interviewer1Id,
        existingAssignment[0].interviewer2Id,
      ];

      // Decrement count for old interviewers
      await decrementInterviewCount(oldInterviewers);

      // Update existing assignment
      await db
        .update(interviewAssignments)
        .set({
          interviewer1Id: selectedUsers[0],
          interviewer2Id: selectedUsers[1],
          updatedAt: now,
        })
        .where(eq(interviewAssignments.id, existingAssignment[0].id));

      // Increment count for new interviewers
      await incrementInterviewCount(selectedUsers);
    } else {
      // Create new assignment
      await db.insert(interviewAssignments).values({
        id: assignmentId,
        rusheeId,
        interviewDateId,
        startTime: slotStart,
        endTime: slotEnd,
        interviewer1Id: selectedUsers[0],
        interviewer2Id: selectedUsers[1],
        createdAt: now,
        updatedAt: now,
      });

      // Increment count for new interviewers
      await incrementInterviewCount(selectedUsers);
    }

    // Update rushee's interview_scheduled flag to true
    await db
      .update(rushee)
      .set({
        interviewScheduled: true,
        updatedAt: now,
      })
      .where(eq(rushee.id, rusheeId));

    revalidatePath("/admin/interview-scheduler");
    return {
      success: true,
      message: "Interview assignment created successfully",
    };
  } catch (error) {
    console.error("Error creating interview assignment:", error);
    return {
      success: false,
      message: "Failed to create interview assignment",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete interview assignment
export async function deleteInterviewAssignment(assignmentId: string) {
  try {
    await checkSession();

    // Get the assignment to find the rusheeId and interviewers before deleting
    const assignment = await db
      .select({
        rusheeId: interviewAssignments.rusheeId,
        interviewer1Id: interviewAssignments.interviewer1Id,
        interviewer2Id: interviewAssignments.interviewer2Id,
      })
      .from(interviewAssignments)
      .where(eq(interviewAssignments.id, assignmentId))
      .limit(1);

    if (assignment.length === 0) {
      throw new Error("Assignment not found");
    }

    const rusheeId = assignment[0].rusheeId;
    const interviewers = [
      assignment[0].interviewer1Id,
      assignment[0].interviewer2Id,
    ];

    // Decrement interview count for the interviewers
    await decrementInterviewCount(interviewers);

    // Delete the assignment
    await db
      .delete(interviewAssignments)
      .where(eq(interviewAssignments.id, assignmentId));

    // Check if the rushee has any other interview assignments
    const remainingAssignments = await db
      .select()
      .from(interviewAssignments)
      .where(eq(interviewAssignments.rusheeId, rusheeId))
      .limit(1);

    const now = new Date();

    // If no remaining assignments, set interview_scheduled to false
    if (remainingAssignments.length === 0) {
      await db
        .update(rushee)
        .set({
          interviewScheduled: false,
          updatedAt: now,
        })
        .where(eq(rushee.id, rusheeId));
    }

    revalidatePath("/admin/interview-scheduler");
    return {
      success: true,
      message: "Interview assignment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting interview assignment:", error);
    return {
      success: false,
      message: "Failed to delete interview assignment",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
