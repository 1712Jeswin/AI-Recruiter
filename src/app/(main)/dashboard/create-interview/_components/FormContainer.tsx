"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/services/Constants";
import { ArrowRight } from "lucide-react";

// ✅ Schema
const formSchema = z.object({
  jobPosition: z.string().min(1, { message: "Job Position is required" }),
  uploadResume: z
    .instanceof(File)
    .or(z.null())
    .refine((file) => file !== null, { message: "Resume is required" }),
  interviewDuration: z.string().min(1, { message: "Duration is required" }),
  interviewType: z.string().min(1, { message: "Interview Type is required" }),
});

const FormContainer = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPosition: "",
      uploadResume: null,
      interviewDuration: "",
      interviewType: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="p-5 bg-white mx-auto rounded-xl shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Position */}
          <FormField
            control={form.control}
            name="jobPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Position</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job position..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Resume Upload */}
          <FormField
            control={form.control}
            name="uploadResume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Resume</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0] || null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Interview Duration */}
          <FormField
            control={form.control}
            name="interviewDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Duration</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="15 min">15 min</SelectItem>
                    <SelectItem value="30 min">30 min</SelectItem>
                    <SelectItem value="45 min">45 min</SelectItem>
                    <SelectItem value="60 min">60 min</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Interview Type */}
          <FormField
            control={form.control}
            name="interviewType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Type</FormLabel>
                <FormControl>
                  <div className="flex gap-x-5 gap-y-3 flex-wrap">
                    {InterviewType.map((type, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() =>
                          field.onChange(
                            field.value === type.title ? null : type.title
                          )
                        }
                        className={`cursor-pointer flex items-center gap-2 p-1 px-3 rounded-2xl border transition
                ${
                  field.value === type.title
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span>{type.title}</span>
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-10 flex justify-end">
            <Button type="submit">
              Generate Interview <ArrowRight />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormContainer;
