"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  UserCircleIcon, // アバター用のアイコンを追加
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "ダッシュボード", href: "/", icon: HomeIcon },
  { name: "患者一覧", href: "/patient", icon: UserGroupIcon },
  { name: "医師一覧", href: "/doctor", icon: UserIcon },
  { name: "予約管理", href: "/appointments", icon: CalendarIcon },
  { name: "統計", href: "/statistics", icon: ChartBarIcon },
  { name: "設定", href: "/settings", icon: CogIcon },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className={`bg-gray-800 text-white ${isOpen ? "w-64" : "w-20"} min-h-screen flex flex-col transition-all duration-300 fixed top-0 left-0 z-10`}>
      <div className="flex items-center justify-between p-4">
        {isOpen && (
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={200} height={40} />
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-700">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="px-2">
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.href} className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${pathname === item.href ? "bg-gray-700" : ""}`}>
                <item.icon className={`w-6 h-6 ${isOpen ? "mr-3" : "mx-auto"}`} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        {isOpen ? (
          <div className="flex items-center">
            <UserCircleIcon className="w-8 h-8 text-gray-300" />
            <span className="ml-2">山田 太郎</span>
          </div>
        ) : (
          <UserCircleIcon className="w-8 h-8 text-gray-300 mx-auto" />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
