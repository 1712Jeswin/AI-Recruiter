"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2Icon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface QuestionsListProps {
  formData: {
    jobPosition: string;
    jobDescription: string;
    interviewDuration: string; // e.g. "15", "30", "45", "60"
    interviewType: string[];
  };
}

const QuestionsList = ({ formData }: QuestionsListProps) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const router = useRouter()

  // Run once formData is ready
  useEffect(() => {
    if (formData && formData.jobPosition) {
      generateQuestionList();
    }
  }, [formData]);

  const getQuestionCount = (duration: string): number => {
    const d = parseInt(duration);
    if (d <= 15) return 7;
    if (d <= 30) return 15;
    if (d <= 45) return 25;
    return 25; // default max
  };

  const generateQuestionList = async () => {
    setLoading(true);
    try {
      const numQuestions = getQuestionCount(formData.interviewDuration);

      const promptPayload = {
        ...formData,
        questionCount: numQuestions,
        promptHint: `Generate around ${numQuestions} interview questions suitable for a ${formData.interviewDuration}-minute interview for the role of ${formData.jobPosition}. Include a mix of technical, situational, and behavioral questions.`,
      };

      const result = await axios.post("/api/ai-model", promptPayload);

      console.log("🧠 AI Raw Response:", result.data.message);

      let rawQuestions: any[] = [];

      if (typeof result.data.message === "string") {
        const jsonMatch = result.data.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            rawQuestions = parsed.interviewQuestions || [];
          } catch (err) {
            toast("Invalid AI response format");
          }
        } else {
          toast("AI response missing valid JSON");
        }
      }

      setQuestions(rawQuestions);
    } catch (error) {
      console.error(error);
      toast("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
  try {
    const res = await axios.post("/api/save-interview", {
      formData,
      questions,
    });

    if (res.data?.success) {
      toast.success("Interview saved successfully!");
      router.push("/dashboard/save-interview");
    } else {
      toast.error("Failed to save interview");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to save interview");
  }
};


  return (
    <div>
      {/* Loading UI */}
      {loading && (
        <div className="p-5 bg-blue-50 border-gray-300 rounded-xl border flex gap-5 items-center">
          <Loader2Icon className="animate-spin" size={32} />
          <div>
            <h2 className="font-medium text-2xl">
              Generating Interview Questions
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              Our AI is crafting {getQuestionCount(formData.interviewDuration)}{" "}
              questions based on the interview duration and job description.
            </p>
          </div>
        </div>
      )}

      {/* Question list */}
      {!loading && questions.length > 0 && (
        <div className="mt-5 p-5 border border-gray-300 rounded-xl">
          <h2 className="font-semibold text-lg mb-5">
            Generated Interview Questions
          </h2>
          <div className="space-y-3">
            {questions.map((item, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-xl"
              >
                <h2 className="font-medium">{item.question}</h2>
                <p className="text-sm text-gray-500">Type: {item.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-10">
        <Button
          variant="outline"
          onClick={generateQuestionList}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Generate New Questions
        </Button>
        <Button onClick={onFinish} disabled={loading || questions.length === 0}>
          Finish
        </Button>
      </div>
    </div>
  );
};

export default QuestionsList;
