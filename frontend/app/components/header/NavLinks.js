import React from "react";
import Link from "next/link";

export default function NavLinks() {
  return (
    <>
      <li>
        <Link className="hover:text-gray-300" href="/login">
          Login
        </Link>
      </li>
      <li>
        <Link className="hover:text-gray-300" href="/create">
          Register
        </Link>
      </li>
    </>
  );
}
