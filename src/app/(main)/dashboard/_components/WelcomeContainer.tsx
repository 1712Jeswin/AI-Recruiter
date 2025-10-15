"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const WelcomeContainer = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (!isPending && !data?.user) {
      router.push("/sign-in");
    }
  }, [data, isPending, router]);

  return (
    <div className="bg-white p-3 rounded-xl flex justify-between items-center mx-20 mt-15">
      <div>
        <h2 className="text-lg font-medium">
          {isPending ? (
            <span className="inline-flex items-center gap-1 text-gray-400">
              <LoaderCircleIcon className="animate-spin size-4" /> Loading...
            </span>
          ) : (
            <>Welcome, {data?.user?.name ?? "Guest"}</>
          )}
        </h2>
        <h2 className="text-gray-500">
          AI-Driven Interviews, Hassle-Free Hiring
        </h2>
      </div>

      {!isPending && data?.user && (
        <>
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
        </>
      )}
    </div>
  );
};

export default WelcomeContainer;
