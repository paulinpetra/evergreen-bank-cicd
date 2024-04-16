import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Genererate One-Time Password
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// My arrays
const users = [];
const accounts = [];
const sessions = [];

// My routes:

app.get("/", (req, res) => {
  res.send("Welcome to the bank's backend!");
});

//Route for creating a new user on the register page - id, username, password
app.post("/create", (req, res) => {
  // Extracting username and password from the request body
  const { username, password } = req.body;

  // Generating unique IDs for the new user (that will be pushed into the users array)
  //and account ((that will be pushed into the accounts array))
  const userId = uuidv4();
  const accountId = uuidv4();

  //new user object with the generated ID, username and password
  const newUser = { id: userId, username, password };
  users.push(newUser);

  //new account object with the generated ID, userId (from newUser so the account and user is linked), and initial balance of 0
  const newAccount = { id: accountId, userId, balance: 0 }; //new account, with id, userId balance:0
  accounts.push(newAccount);

  console.log("User created:", newUser);
  console.log("Account created:", newAccount);

  // Sending a response back to the client with the new user's details
  res.send("Post new user recieved: " + JSON.stringify(newUser));
});

// Route to handle login requests
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user in the users array
  const user = users.find((user) => user.username === username);

  // Check if the user exists
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Check if the password is correct
  if (user.password !== password) {
    return res.status(401).json({ error: "Wrong password" });
  }
  // Generating a session token
  const sessionToken = generateOTP();

  // Createing a new session object and pushing to sessions array
  const session = {
    userId: user.id,
    token: sessionToken,
  };
  sessions.push(session);

  // A successful response with the username and token
  res.status(200).json({ username: user.username, token: sessionToken });
});

// Endpoint to fetch account data
app.post("/account", (req, res) => {
  const { sessionToken } = req.body;

  // Find the user session
  const session = sessions.find(
    (session) => session.sessionToken === sessionToken
  );
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Find the account associated with the user session
  const account = accounts.find((account) => account.userId === session.userId);
  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }
  // Find the user associated with the session
  const user = users.find((user) => user.id === session.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Respond with the updated account data
  const responseData = {
    username: user.username, // Use the username from the user object
    balance: account.balance,
  };

  res.status(200).json(responseData);
});

// Endpoint to deposit money
app.post("/account/transactions", (req, res) => {
  const { sessionToken, depositAmount } = req.body;

  // Find the user session
  const session = sessions.find(
    (session) => session.sessionToken === sessionToken
  );
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Find the account associated with the user session
  const account = accounts.find((account) => account.userId === session.userId);
  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  // Convert depositAmount to number
  const deposit = Number(depositAmount);
  if (isNaN(deposit) || deposit <= 0) {
    return res.status(400).json({ error: "Invalid deposit amount" });
  }

  // Update the balance
  account.balance += deposit;

  // Respond with the updated account data
  const responseData = {
    balance: account.balance,
  };

  res.status(200).json(responseData);
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Bankens backend körs på http://localhost:${PORT}`);
});
