"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface Question {
  id: string;
  question: string;
  type: string;
}

interface FormData {
  jobPosition: string;
  jobDescription: string;
  interviewDuration: string;
  interviewType: string[];
}

const SaveInterviewPage = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const interviewId = searchParams.get("id");

  /* ✅ Fetch interview data */
  useEffect(() => {
    if (!interviewId) return;

    setLoading(true);
    axios
      .get(`/api/save-interview?id=${interviewId}`)
      .then((res) => {
        setFormData({
          jobPosition: res.data.jobPosition,
          jobDescription: res.data.jobDescription,
          interviewDuration: res.data.interviewDuration,
          interviewType: res.data.interviewType,
        });
        setQuestions(res.data.questions || []);
      })
      .catch(() => toast.error("Failed to load interview"))
      .finally(() => setLoading(false));
  }, [interviewId]);

  /* ✅ Delete Interview */
  const handleDeleteInterview = async () => {
    if (!interviewId) return toast.error("No interview selected");
    if (!confirm("Are you sure you want to delete this interview?")) return;

    setLoading(true);
    try {
      await axios.delete(`/api/save-interview?id=${interviewId}`);
      toast.success("Interview deleted!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to delete interview");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Delete Question */
  const handleDeleteQuestion = async (questionId: string) => {
    if (!questionId) return;
    if (!confirm("Are you sure you want to delete this question?")) return;

    setLoading(true);
    try {
      await axios.delete(`/api/save-interview?id=${interviewId}&questionId=${questionId}`);
      setQuestions(questions.filter((q) => q.id !== questionId));
      toast.success("Question deleted!");
    } catch {
      toast.error("Failed to delete question");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Interview Details</h2>

      <div className="space-y-2">
        <p>
          <span className="font-medium">Job Position:</span> {formData.jobPosition}
        </p>
        <p>
          <span className="font-medium">Job Description:</span> {formData.jobDescription}
        </p>
        <p>
          <span className="font-medium">Interview Duration:</span> {formData.interviewDuration}
        </p>
        <p>
          <span className="font-medium">Interview Type:</span> {formData.interviewType.join(", ")}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">Questions</h3>
        {questions.length === 0 && <p className="text-gray-500">No questions available.</p>}
        {questions.map((q) => (
          <Card key={q.id} className="relative">
            <CardHeader>
              <CardTitle className="text-gray-800 font-medium">{q.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 italic">Type: {q.type}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="destructive"
                size="sm" 
                onClick={() => handleDeleteQuestion(q.id)}
                disabled={loading}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {interviewId && (
        <div className="mt-6">
          <Button variant="destructive" onClick={handleDeleteInterview} disabled={loading}>
            🗑️ Delete Interview
          </Button>
        </div>
      )}
    </div>
  );
};

export default SaveInterviewPage;
