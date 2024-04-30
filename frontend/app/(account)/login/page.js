"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); //useRouter hook to navigate between pages

  // Function to handle user login
  const handleLoginUser = async (e) => {
    e.preventDefault();

    setError(""); //// Clear any previous error messages

    try {
      // POST request to the backend to log in
      const response = await fetch("http://16.171.45.74:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log("Login Successful!!");

        // Store the token in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
        }

        // Redirect the user to their account page
        router.push("/account");
      } else {
        setError("Wrong username or password!");
      }
    } catch (error) {
      console.error("Error trying to login", error);
      setError("Login failed. Please try again!");
    }
  };

  return (
    <div className="bg-gradient-to-r from-custom-dark to-custom-green flex flex-col items-center justify-center min-h-screen">
      <h3 className="text-3xl font-bold mb-5">Login to your user account</h3>
      {error && (
        <div className="text-red-500 font-bold text-xl mb-8">{error}</div>
      )}
      <form onSubmit={handleLoginUser} className="w-full max-w-md">
        {/* Input fields for username and password */}

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-custom-dark hover:py-2.5 hover:px-5 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
