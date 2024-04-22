import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to DB
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bank",
  port: 8889,
});

// help function to make code look nicer
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Genererate One-Time Password
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// My routes:

app.get("/", (req, res) => {
  res.send("Welcome to the bank's backend!");
});

//Route for creating a new user on the register page
app.post("/users", async (req, res) => {
  // Extracting username and password from the request body
  const { username, password } = req.body;

  // Encrypt the password before it ends up in the DB
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const result = await query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    //insertId from the result object that holds the unique ID assigned to the inserted user row in the database.
    const userId = result.insertId;

    //creating an account for the new user

    await query("INSERT INTO accounts (userId, amount) VALUES (?, ?)", [
      userId,
      0, // intitial balance
    ]);

    res.status(200).json({ message: "User created!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user!" });
  }
});

// Route to handle login requests
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // SELECT for finding matching DB-row for username

  const result = await query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  const user = result[0];

  // 2. Check if hash in DB matches crypted password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Incorrect username or password" });
  }

  // 3. Generate a session token
  const token = generateOTP();

  try {
    // check if user has existing session
    const existingSession = await query(
      "SELECT * FROM sessions WHERE userId = ?",
      [user.id]
    );

    if (existingSession.length === 0) {
      // if there is no session, create new session and token
      await query("INSERT INTO sessions (userId, token) VALUES (?, ?)", [
        user.id,
        token,
      ]);
    } else {
      // if session exist, update token only
      await query("UPDATE sessions SET token = ? WHERE userId = ?", [
        token,
        user.id,
      ]);
    }

    res.status(200).json({ userId: user.id, token });
  } catch (error) {
    console.error("error handeling session");
    res.status(500).json({ message: "error handeling session" });
  }
});

// Endpoint to fetch account data
app.post("/accounts", async (req, res) => {
  const { token } = req.body;

  try {
    const result = await query(
      "SELECT amount FROM accounts INNER JOIN sessions ON accounts.userId = sessions.userId WHERE token = ?",
      [token]
    );

    if (result.length === 0) {
      return res.status(401).json({ message: "Unvalid session" });
    }

    res.status(200).json({ balance: result[0].amount });
  } catch (error) {
    console.error("Error fetching balance");
    res.status(500).json({ message: "Error fetching balance" });
  }
});

// Endpoint to deposit money
app.post("/account/transactions", async (req, res) => {
  const { token, depositAmount } = req.body;

  try {
    const sessionResult = await query(
      "SELECT userId FROM sessions WHERE token = ?",
      [token]
    );

    if (sessionResult.length === 0) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const userId = sessionResult[0].userId;

    // Fetch the current amount
    const currentAmountResult = await query(
      "SELECT amount FROM accounts WHERE userId = ?",
      [userId]
    );
    const currentAmount = currentAmountResult[0].amount;

    // Calculate the new amount and round it
    const newAmount = Math.round((currentAmount + depositAmount) * 100) / 100;

    await query("UPDATE accounts SET amount = ? WHERE userId = ?", [
      newAmount,
      userId,
    ]);

    const newBalanceResult = await query(
      "SELECT amount FROM accounts WHERE userId = ?",
      [userId]
    );

    res.status(200).json({
      message: "Money deposited!",
      newBalance: newBalanceResult[0].amount,
    });
  } catch (error) {
    console.error("Error deposting money");
    res.status(500).json({ message: "Error depositing money" });
  }
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Bankens backend körs på http://localhost:${PORT}`);
});
