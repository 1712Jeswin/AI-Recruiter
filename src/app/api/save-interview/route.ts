import { NextResponse } from "next/server";
import { db } from "@/db";
import { interview, interviewQuestion } from "@/db/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

/* ===========================================================
   ✅ GET — Fetch Single Interview (with questions)
=========================================================== */
export const GET = async (req: Request) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get("id");

    if (!interviewId)
      return NextResponse.json({ error: "Interview ID missing" }, { status: 400 });

    const interviewData = await db.query.interview.findFirst({
      where: (interview, { eq }) => eq(interview.id, interviewId),
    });

    if (!interviewData)
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });

    const questions = await db.query.interviewQuestion.findMany({
      where: (q, { eq }) => eq(q.interviewId, interviewId),
    });

    return NextResponse.json({
      ...interviewData,
      interviewType: interviewData.interviewType?.split(",") || [],
      questions,
    });
  } catch (error) {
    console.error("❌ Error fetching interview:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

/* ===========================================================
   ✅ POST — Create New Interview
=========================================================== */
export const POST = async (req: Request) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const { formData, questions } = await req.json();
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

    if (Array.isArray(questions) && questions.length > 0) {
      const questionData = questions.map((q: any) => ({
        id: uuidv4(),
        interviewId: newInterviewId,
        question: q.question,
        type: q.type,
      }));
      await db.insert(interviewQuestion).values(questionData);
    }

    return NextResponse.json({
      success: true,
      id: newInterviewId, // ✅ return for redirect
    });
  } catch (error) {
    console.error("❌ Error saving interview:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

/* ===========================================================
   ✅ PUT — Update Existing Interview
=========================================================== */
export const PUT = async (req: Request) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get("id");
    if (!interviewId)
      return NextResponse.json({ error: "Interview ID missing" }, { status: 400 });

    const { formData, questions } = await req.json();

    await db
      .update(interview)
      .set({
        jobPosition: formData.jobPosition,
        jobDescription: formData.jobDescription,
        interviewDuration: formData.interviewDuration,
        interviewType: Array.isArray(formData.interviewType)
          ? formData.interviewType.join(",")
          : formData.interviewType,
      })
      .where(eq(interview.id, interviewId));

    await db.delete(interviewQuestion).where(eq(interviewQuestion.interviewId, interviewId));

    if (Array.isArray(questions) && questions.length > 0) {
      const newQuestions = questions.map((q: any) => ({
        id: uuidv4(),
        interviewId,
        question: q.question,
        type: q.type,
      }));
      await db.insert(interviewQuestion).values(newQuestions);
    }

    return NextResponse.json({ success: true, id: interviewId });
  } catch (error) {
    console.error("❌ Error updating interview:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

/* ===========================================================
   ✅ DELETE — Delete Interview (and its Questions)
=========================================================== */
export const DELETE = async (req: Request) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get("id");
    const questionId = searchParams.get("questionId"); // ✅ new param

    if (questionId) {
      await db.delete(interviewQuestion).where(eq(interviewQuestion.id, questionId));
      return NextResponse.json({ success: true, message: "Question deleted" });
    }

    if (!interviewId)
      return NextResponse.json({ error: "Interview ID missing" }, { status: 400 });

    await db.delete(interviewQuestion).where(eq(interviewQuestion.interviewId, interviewId));
    await db.delete(interview).where(eq(interview.id, interviewId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting interview/question:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

