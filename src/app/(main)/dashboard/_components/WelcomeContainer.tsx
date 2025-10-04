"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { session } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const WelcomeContainer = () => {
  const { data, isPending } = authClient.useSession();

  if (isPending || !data?.user) {
    return (
      <div className="flex items-center justify-center">
        <LoaderCircleIcon className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-xl flex  justify-between items-center">
      <div>
        <h2 className="text-lg font-medium">Welcome, {data?.user.name}</h2>
        <h2 className="text-gray-500">
          AI-Driven Interviews, Hassle-Free Hiring
        </h2>
      </div>
      {data.user.image ? (
          <Avatar>
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="size-9 mr-3"
          />
        )}
    </div>
  );
};

export default WelcomeContainer;
