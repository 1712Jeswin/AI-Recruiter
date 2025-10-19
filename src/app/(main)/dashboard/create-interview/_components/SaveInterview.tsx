"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

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
  const [formData, setFormData] = useState<FormData>({
    jobPosition: "",
    jobDescription: "",
    interviewDuration: "",
    interviewType: [],
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const interviewId = searchParams.get("id");

  /* ✅ Fetch existing interview if editing */
  useEffect(() => {
    if (interviewId) {
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
    }
  }, [interviewId]);

  /* ✅ Handle Save (Create / Update) */
  const handleSave = async () => {
    if (!formData.jobPosition || !formData.jobDescription) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const payload = { formData, questions };

      if (interviewId) {
        const res = await axios.put(`/api/save-interview?id=${interviewId}`, payload);
        toast.success("Interview updated!");
        router.push(`/dashboard/save-interview?id=${res.data.id}`);
      } else {
        const res = await axios.post("/api/save-interview", payload);
        toast.success("Interview saved!");
        router.push(`/dashboard/save-interview?id=${res.data.id}`);
      }
    } catch (err) {
      toast.error("Failed to save interview");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Handle Delete Interview */
  const handleDeleteInterview = async () => {
    if (!interviewId) return toast.error("No interview selected");
    if (!confirm("Are you sure you want to delete this interview?")) return;

    setLoading(true);
    try {
      await axios.delete(`/api/save-interview?id=${interviewId}`);
      toast.success("Interview deleted!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Failed to delete interview");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Handle Delete Single Question */
  const handleDeleteQuestion = async (questionId: string) => {
    if (!questionId) return;
    if (!confirm("Are you sure you want to delete this question?")) return;

    setLoading(true);
    try {
      await axios.delete(`/api/save-interview?id=${interviewId}&questionId=${questionId}`);
      setQuestions(questions.filter((q) => q.id !== questionId));
      toast.success("Question deleted!");
    } catch (err) {
      toast.error("Failed to delete question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">{interviewId ? "Edit Interview" : "Create Interview"}</h2>

      {/* Form Fields */}
      <div className="space-y-3">
        <input
          className="border p-2 w-full rounded"
          placeholder="Job Position"
          value={formData.jobPosition}
          onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
        />
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Job Description"
          value={formData.jobDescription}
          onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Interview Duration (e.g. 30 mins)"
          value={formData.interviewDuration}
          onChange={(e) => setFormData({ ...formData, interviewDuration: e.target.value })}
        />

        <div className="flex gap-3 mt-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "💾 Save Interview"}
          </Button>
          {interviewId && (
            <Button variant="destructive" onClick={handleDeleteInterview} disabled={loading}>
              🗑️ Delete Interview
            </Button>
          )}
        </div>
      </div>

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Questions</h3>
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
      )}
    </div>
  );
};

export default SaveInterviewPage;
