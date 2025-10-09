"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CreateOptions = () => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card
        className="p-4 gap-2 cursor-pointer"
        onClick={() => router.push("dashboard/create-interview")}
      >
        <Video className="p-2 text-primary bg-blue-50 rounded-lg h-10 w-10" />
        <CardTitle className="p-0 m-0">Create new Interview</CardTitle>
        <CardDescription className="text-gray-500 p-0 mt-0">
          Create AI Interviews and Schedule them for Candidates
        </CardDescription>
      </Card>
      <Card className="p-4 gap-2">
        <Phone className="p-2 text-primary bg-blue-50 rounded-lg h-10 w-10" />
        <CardTitle className="p-0 m-0">Create new Interview</CardTitle>
        <CardDescription className="text-gray-500 p-0 mt-0">
          Schedule phone screening call with Candidates
        </CardDescription>
      </Card>
    </div>
  );
};

export default CreateOptions;
