import {
  BriefcaseBusinessIcon,
  Calendar,
  Code2Icon,
  LayoutDashboardIcon,
  List,
  Presentation,
  Puzzle,
  Settings,
  User2Icon,
  Wallet,
} from "lucide-react";

export const SidebarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboardIcon,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: Wallet,
    path: "/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavorial",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    title: "Leadership",
    icon: Presentation,
  },
];

export const QUESTION_PROMPT = `You are an expert technical interviewer.  
Based on the following inputs, generate a well-structured list of high-quality interview questions:  

Job Title: {{jobTitle}}  
Job Description: {{jobDescription}}  
Interview Duration: {{duration}}  
Interview Type: {{type}}  

🍞 Your task:  
Analyze the job description to identify key responsibilities, required skills, and expected experience.  
Generate a list of interview questions depending on interview duration.  
Adjust the number and depth of questions to match the interview duration.  
Ensure the questions match the tone and structure of a real-life {{type}} interview.  

🌿 Format your response in JSON format with an array list of questions.  
Format:  
interviewQuestions = [  
  {  
    question: "",  
    type: "Technical/Behavioral/Experience/Problem Solving/Leadership"  
  },  
  {  
    ...  
  }  
]  

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`;
