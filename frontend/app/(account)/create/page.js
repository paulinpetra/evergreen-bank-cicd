"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  // Function to handle user registration
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      // Sending a POST request to the backend with the username and password

      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response from server:", response);

      if (response.ok) {
        setSuccessMessage("You registered successfully!");

        setTimeout(() => {
          router.push("/login");
        }, 1500); // delaying the redirection so customer can see success message first
      } else {
        // Logging an error if the response is not OK
        console.error("Failed to create user");
      }
    } catch (error) {
      // Logging any errors that occur during the fetch operation

      console.error("Error creating user: ", error);
      setSuccessMessage(""); //clear the success message on error
    }
    setUsername("");
    setPassword("");
  };

  return (
    <div className="bg-gradient-to-r from-custom-dark to-custom-green flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Register new user</h1>
      {successMessage && (
        <div className="text-green-500 font-bold text-xl mb-8">
          {successMessage}
        </div>
      )}
      <form action="" onSubmit={handleCreateUser} className="w-full max-w-md">
        <div className="mb-4">
          {/*input field for the username */}

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
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          {/*input field for the username */}

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
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
