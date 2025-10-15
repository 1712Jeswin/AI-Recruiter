"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

import Samp_logo from "@/assets/Samp_logo.png";
import Sample from "@/assets/Sample.png";
import Sample1 from "@/assets/Sample1.png";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarOptions } from "@/services/Constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {

    const path = usePathname()
    console.log("The Current path is : ",path)

  return (
    <Sidebar>
      <SidebarHeader className="flex justify-center items-center p-4">
        <Image
          src={Sample1}
          alt="logo"
          height={100}
          width={200}
          className="w-[180px]"
        />
        <Button className="w-full mt-5">
          <Plus className="size-4" />
          Create New Interview
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SidebarOptions.map((option, index) => (
                <SidebarMenuItem key={index} className="p-1">
                  <SidebarMenuButton asChild className={`p-5 ${option.path==path && 'bg-blue-100'}`}>
                    <Link href={option.path}>
                      <option.icon />
                      <span className={`text-[16px] ${path==option.path && 'text-primary'} font-medium`}>{option.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
