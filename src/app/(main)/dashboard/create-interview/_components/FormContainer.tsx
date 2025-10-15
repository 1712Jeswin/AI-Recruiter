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
import { Textarea } from "@/components/ui/textarea";
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

// ✅ Validation Schema
const formSchema = z.object({
  jobPosition: z.string().min(1, { message: "Job Position is required" }),
  jobDescription: z.string().min(1, { message: "Job Description is required" }),
  interviewDuration: z.string().min(1, { message: "Duration is required" }),
  interviewType: z.array(z.string()).min(1, { message: "Select at least one interview type" }),
});

interface Props {
  GoToNext: (data: z.infer<typeof formSchema>) => void;
}

const FormContainer = ({ GoToNext }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPosition: "",
      jobDescription: "",
      interviewDuration: "",
      interviewType: [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("✅ Form Submitted:", values);
    GoToNext(values); // ✅ Pass form data to parent (CreateInterview)
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

          {/* Job Description */}
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter job description..."
                    className="min-h-[120px]"
                    {...field}
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

          {/* ✅ Multiple Interview Types */}
          <FormField
            control={form.control}
            name="interviewType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Types</FormLabel>
                <FormControl>
                  <div className="flex gap-x-5 gap-y-3 flex-wrap">
                    {InterviewType.map((type, index) => {
                      const isSelected = field.value?.includes(type.title);
                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() => {
                            let newValue = [...(field.value || [])];
                            if (isSelected) {
                              newValue = newValue.filter(
                                (t) => t !== type.title
                              );
                            } else {
                              newValue.push(type.title);
                            }
                            field.onChange(newValue);
                          }}
                          className={`cursor-pointer flex items-center gap-2 p-1 px-3 rounded-2xl border transition
                            ${
                              isSelected
                                ? "bg-primary text-white border-primary"
                                : "bg-white border-gray-300 text-gray-700"
                            }`}
                        >
                          <type.icon className="w-4 h-4" />
                          <span>{type.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
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
