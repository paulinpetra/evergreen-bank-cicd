"use client";
import React, { useEffect, useState } from "react";

export default function AccountPage() {
  const [currentAmount, setCurrentAmount] = useState(0); // Current account balance
  const [depositAmount, setDepositAmount] = useState(""); // Amount to deposit
  const [loading, setLoading] = useState(true);

  // Effect hook to fetch account data on component mount
  useEffect(() => {
    fetchAccountData();
  }, []);

  // Function to fetch account data from the backend
  const fetchAccountData = async () => {
    try {
      // Get the session token from localStorage
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:4000/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const accountData = await response.json();
        console.log("Account data:", accountData);
        // Update state with fetched data
        setCurrentAmount(accountData.balance);
      } else {
        console.error("Failed to fetch account data");
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deposit
  const handleDeposite = async () => {
    // Get the session token from localStorage again

    const token = localStorage.getItem("token");

    let newAmount = currentAmount + Number(depositAmount); // Convert depositAmount to number
    setCurrentAmount(newAmount);

    try {
      // Send deposit request to the backend

      const response = await fetch(
        "http://localhost:4000/account/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, depositAmount }),
        }
      );

      if (response.ok) {
        setDepositAmount("");
        console.log("Money deposited successfully.");
      } else {
        console.error("Failed to deposit money");
      }
    } catch (error) {
      console.error("Error depositing money:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-custom-dark to-custom-green flex flex-col items-center justify-center min-h-screen">
      <h3 className="text-3xl font-bold mb-5">My Account</h3>
      <div className="mb-4">
        <h3 className="font-semibold">
          Balance:{" "}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <span className="text-white font-bold text-xl">
              {currentAmount} SEK
            </span>
          )}
        </h3>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Deposit money</h3>
        <div className="mb-4">
          <input
            onChange={(e) => setDepositAmount(e.target.value)}
            pattern="[0-9]*"
            type="text"
            value={depositAmount}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={handleDeposite}
            className="bg-custom-dark hover:py-2.5 hover:px-5 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
