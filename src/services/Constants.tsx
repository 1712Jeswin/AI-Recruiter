import { Calendar, LayoutDashboardIcon, List, Settings, Wallet } from "lucide-react";

export const SidebarOptions = [
    {
        name: "Dashboard",
        icon: LayoutDashboardIcon,
        path: '/dashboard'
    },
    {
        name: "Scheduled Interview",
        icon: Calendar,
        path: '/scheduled-interview'
    },
    {
        name: "All Interview",
        icon: List,
        path: '/all-interview'
    },
    {
        name: "Billing",
        icon: Wallet,
        path: '/billing'
    },
    {
        name: "Settings",
        icon: Settings,
        path: '/settings'
    },
]