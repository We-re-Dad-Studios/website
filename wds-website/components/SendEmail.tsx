"use client";

import React, {  useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

type category = "All Categories" | "Games" | "Novels" | "Visual Projects";
export const SendEmail = () => {
  const [category, setCategory] = useState<category>("All Categories");
  return (
    <div className="flex flex-col gap-y-3 w-full">
      <div className="w-[80%] mx-auto rounded-lg relative bg-white p-2 flex items-center">
        <input
          type="text"
          className="bg-transparent flex-1 h-full  p-1 outline-none focus-within:outline-none focus:outline-none text-black"
          placeholder="Enter your email address"
        />
        <Dropdown chosenCategory={category} setCategory={setCategory} />
      </div>
      <button className="w-60 max-w-[80%] mx-auto rounded-lg bg-primary-0 py-2 px-6 text-white">
        Submit
      </button>
    </div>
  );
};

const Dropdown = ({
  chosenCategory,
  setCategory,
}: {
  chosenCategory: category;
  setCategory: React.Dispatch<React.SetStateAction<category>>;
}) => {

  return (
    <div className="relative pr-2">
        <Select onValueChange={(value)=>{setCategory(value as unknown as category)}} value={chosenCategory}>
      <SelectTrigger
        id="dropdown"
        
        className="hover:bg-primary-0 ring-transparent border-none focus-within:ring-transparent focus:ring-transparent  dark:hover:text-white dark:text-black h-full px-3 py-1.5 rounded text-black flex items-center justify-center gap-x-1.5 hover:text-white transition-colors"
      
      >
        {chosenCategory?chosenCategory:"All Categories"}
      </SelectTrigger>

      <SelectContent
       
        className="w-40 h-max py-2 cursor-pointer fixed bg-primary-0 rounded-lg px-1.5 text-white dark:text-white ring-transparent border-none"
        
      >  
          <SelectItem
            value="Games"
            className="focus:bg-slate-100/10 cursor-pointer focus:text-white"
          >
            Games
          </SelectItem>
          <SelectItem
            value="Novels"
            className="focus:bg-slate-100/10 cursor-pointer focus:text-white"
          >
            Novels
          </SelectItem>
          <SelectItem
            value="Visual Projects"
            className="focus:bg-slate-100/10 cursor-pointer focus:text-white"
          >
            Visual Projects
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
