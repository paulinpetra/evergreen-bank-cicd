"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Nav({ children }) {
  return (
    <nav className="bg-custom-dark max-w-screen h-20 flex items-center relative">
      <div className="flex flex-row w-full xl:max-w-[90rem] xl:mx-auto justify-between px-4 text-white">
        <div className="uppercase font-semibold">
          <Link className="hover:text-gray-300" href="/">
            Evergreen Trust Bank
          </Link>
        </div>
        <div className="flex flex-row mr-4">
          <ul className="flex flex-row gap-4">{children}</ul>
        </div>
        <div className="top-1 right-1 absolute"></div>
      </div>
    </nav>
  );
}
