import { NextResponse } from "next/server";
import { db } from "@/db";  // drizzle db connection
import { interview, interviewQuestion } from "@/db/schema"  // ✅ correct schema path
import { auth } from "@/lib/auth"; // Better Auth server instance
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: Request) => {
  try {
    // ✅ 1. Get logged-in user from Better Auth
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { formData, questions } = await req.json();

    // ✅ 2. Create a new interview record
    const newInterviewId = uuidv4();

    await db.insert(interview).values({
      id: newInterviewId,
      userId,
      jobPosition: formData.jobPosition,
      jobDescription: formData.jobDescription,
      interviewDuration: formData.interviewDuration,
      interviewType: Array.isArray(formData.interviewType)
        ? formData.interviewType.join(",")
        : formData.interviewType,
    });

    // ✅ 3. Insert all related interview questions
    if (Array.isArray(questions) && questions.length > 0) {
      const questionData = questions.map((q: any) => ({
        id: uuidv4(),
        interviewId: newInterviewId,
        question: q.question,
        type: q.type,
      }));

      await db.insert(interviewQuestion).values(questionData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error saving interview:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
