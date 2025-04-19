"use client";
import Link from "next/link";
import { House, Dumbbell, Settings, Zap } from 'lucide-react';
import { muscleGroups } from "../data/musclegroups";
import { useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AiAdvisor from "./aiChat";

export default function SideNav() {
  const [active, setActive] = useState<string | null>("dashboard");
  
  // AI Advisor state
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-[#18181B] text-white w-1/5 flex flex-col gap-6 p-2 h-full">
        <div className="text-3xl font-bold text-center">Rep-Sync</div>
        <div className="flex flex-col justify-between h-full">
          {/* Main navigation links */}
          <div className="flex flex-col pl-2 font-semibold gap-2">
            <Link href={'/'}>
              <div
                className={`hover:bg-zinc-700 px-3 py-1 rounded-lg flex gap-2 items-center ${
                  active === "dashboard" ? "bg-zinc-700" : ""
                }`}
                onClick={() => {setActive("dashboard")}}
              >
                <House className="h-5"/>Dashboard
              </div>
            </Link>
            {muscleGroups.map((muscle) => (
              <Link href={`/${muscle.toLowerCase()}`} key={muscle}>
                <div
                  className={`hover:bg-zinc-700 pl-2 py-1 rounded-lg flex gap-2 items-center px-3 ${
                    active === muscle ? "bg-zinc-700" : ""
                  }`}
                  onClick={() => setActive(muscle)}
                >
                  <Dumbbell className="h-5"/>
                  {muscle}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Bottom section with Settings and AI Advisor */}
          <div className="flex flex-col gap-2 mt-auto">
            <div className="pl-4 font-semibold hover:bg-zinc-700 rounded-lg flex gap-2 items-center p-2">
              <Settings className="h-5" /> Settings
            </div>
            
            {/* AI Advisor Button with Sheet component */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button 
                  className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="font-medium">AI Workout Advisor</span>
                </button>
              </SheetTrigger>
              
              {/* The AiAdvisor component is now inside the Sheet component */}
              <AiAdvisor isOpen={isOpen} setIsOpen={setIsOpen} />
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
}