"use client";

import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormContainer from "./_components/FormContainer";
import QuestionsList from "./_components/QuestionsList" 
import { toast } from "sonner";

const CreateInterview = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>(null);

  // ✅ Called when form is successfully submitted
  const onGoToNext = (data: any) => {
    // ✅ Basic field validation before moving to next step
    if (
      !data.jobPosition ||
      !data.jobDescription ||
      !data.interviewDuration ||
      !data.interviewType
    ) {
      toast.error("Please fill in all the required fields");
      return;
    }

    setFormData(data);
    setStep(2);
    toast.success("Form submitted successfully! Generating questions...");
  };

  return (
    <div className="px-15">
      {/* Header */}
      <div className="flex gap-5 items-center">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
        <h2 className="font-medium text-2xl">Create New Interview</h2>
      </div>

      {/* Progress Bar */}
      <Progress value={step * 33.33} className="my-5" />

      {/* Step 1: Form */}
      {step === 1 && <FormContainer GoToNext={onGoToNext} />}

      {/* Step 2: Questions List */}
      {step === 2 && <QuestionsList formData={formData} />}
    </div>
  );
};

export default CreateInterview;
