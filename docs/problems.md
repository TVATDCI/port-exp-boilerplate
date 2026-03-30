# Critical Problems Documentation

> This document provides detailed technical analysis of critical security and functionality issues identified in the codebase. Each issue includes location, current code, impact, and verification steps.

---

## Problem 1: Auth Token Storage Bug

**Severity**: 🔴 CRITICAL  
**Impact**: Authentication appears to work but fails on protected routes  
**Effort to Fix**: 5 minutes

### Location

- **File**: `client/src/context/AuthContext.jsx`
- **Line**: 38
- **Related**: `server/src/controllers/userController.js:55-60`

### Current Code (Buggy)

```javascript
// client/src/context/AuthContext.jsx:38
localStorage.setItem("token", data._id); // WRONG: Stores user ID, not JWT
```

### What the Backend Actually Returns

```javascript
// server/src/controllers/userController.js:55-60
res.json({
  _id: user._id, // MongoDB ObjectId
  email: user.email,
  role: user.role,
  token, // <-- This JWT is never stored!
});
```

### The Problem

The login flow has a silent failure mode:

1. **Login appears successful** - The user ID is stored in localStorage under the key `token`
2. **UI reflects logged-in state** - `AuthContext.jsx:12-17` retrieves this value and restores user state
3. **Protected API calls fail** - When making requests to `/api/users/profile`, the frontend sends the stored user ID as a Bearer token
4. **Server rejects the token** - The server expects a valid JWT signature, gets a MongoDB ObjectId string
5. **Result**: User sees themselves as "logged in" but cannot access protected features

### Technical Breakdown

```javascript
// AuthContext.jsx:38 - The bug
localStorage.setItem("token", data._id); // "1234567890abcdef"

// authMiddleware.js:16 - What the server expects
const decoded = jwt.verify(token, env.jwtSecret); // Expects JWT format

// Result: jwt.verify() throws "invalid token" error
// Response: 401 Unauthorized
```

### Why Login "Works" Initially

The frontend's `login()` function stores:

- `data._id` in `token` key (wrong)
- `JSON.stringify(data)` in `user` key (correct)

On page refresh, `useEffect` checks:

```javascript
const token = localStorage.getItem("token"); // Gets user ID (wrong)
const userData = localStorage.getItem("user"); // Gets full user object
if (token && userData) {
  setUser(JSON.parse(userData)); // Restores UI state
}
```

The UI thinks you're logged in because `user` state exists, but API calls fail because `token` isn't a valid JWT.

### How to Verify

**Method 1: Browser DevTools**

1. Login as admin (appears successful)
2. Open DevTools → Application → Local Storage → http://localhost:5173
3. Check the `token` value - it's a short string (24 chars for MongoDB ID), not a JWT (100+ chars with dots)

**Method 2: API Test**

```bash
# 1. Login
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"changeme123"}'

# Response includes: {"_id": "...", "email": "...", "role": "...", "token": "eyJhbG..."}

# 2. Try to access protected route with WRONG token (data._id)
curl http://localhost:5001/api/users/profile \
  -H "Authorization: Bearer 6579a1b2c3d4e5f6a7b8c9d0e"
# Result: 401 Unauthorized

# 3. Try with CORRECT token (data.token)
curl http://localhost:5001/api/users/profile \
  -H "Authorization: Bearer eyJhbG..."
# Result: 200 OK with user data
```

**Method 3: UI Observation**

1. Login successfully
2. Refresh the page - you'll still appear logged in
3. Try to perform an action that calls a protected API
4. Check Network tab - the request fails with 401

### Fix Required

```diff
// client/src/context/AuthContext.jsx:38
- localStorage.setItem('token', data._id);
+ localStorage.setItem('token', data.token);
```

### Impact Assessment

- **User Experience**: High confusion - appears logged in but features don't work
- **Security**: Cannot access protected resources (unintended side effect)
- **Data Integrity**: None directly, but prevents authenticated operations
- **Production Risk**: 🔴 **CRITICAL** - Would block all authenticated functionality

---

## Problem 2: Projects API Returns Hardcoded Data

**Severity**: 🔴 CRITICAL  
**Impact**: Database is completely disconnected from API; no dynamic project management  
**Effort to Fix**: 1-2 hours

### Location

- **File**: `server/src/controllers/projectController.js`
- **Lines**: 1-84
- **Related**: `server/src/models/Project.js` (exists but unused)

### Current Code (Buggy)

```javascript
// server/src/controllers/projectController.js
const sampleProjects = [
  {
    _id: "1", // String ID, not MongoDB ObjectId
    title: "Interactive Portfolio Website",
    description: "A personal portfolio showcasing...",
    imageUrl:
      "https://via.placeholder.com/400x250/FF5733/FFFFFF?text=Project+1",
    projectUrl: "https://github.com/yourusername/project1",
    tags: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
    category: "Frontend",
    featured: true,
  },
  // ... 6 more hardcoded projects
];

export const getProjects = (req, res) => {
  res.json(sampleProjects); // NEVER queries database
};
```

### What Exists But Is Unused

```javascript
// server/src/models/Project.js - Completely ignored by controller
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: String,
  projectUrl: String,
  tags: [String],
  category: {
    type: String,
    enum: ["MERN", "APIs", "Frontend", "Experiments"],
    default: "Frontend",
  },
  featured: { type: Boolean, default: false },
});
```

### The Problem

There's a complete disconnect between the data layer and API layer:

1. **MongoDB is connected** - `database.js` successfully connects to MongoDB
2. **Schema is defined** - `Project.js` has a proper Mongoose schema
3. **API ignores everything** - Controller returns static array, never queries database
4. **No way to manage projects** - Adding/editing/deleting requires code changes and redeployment

### Technical Impact

**Data Mismatch**:

- Database can have 0 projects or 100 projects
- API always returns exactly 7 projects
- Changes to database never reflected in API

**Type Inconsistency**:

- Hardcoded `_id` values are strings ("1", "2", "3")
- MongoDB would generate ObjectIds ("6579a1b2c3d4e5f6a7b8c9d0")
- Frontend expects consistent ID format for React keys

**Category Filtering**:

- Frontend filtering works on hardcoded data
- Would work with database data too
- But there's no persistence - filtered data resets on reload

### How to Verify

**Method 1: Direct Database Check**

```bash
# Using mongosh or MongoDB Compass
use portfolio
db.projects.find()  # Returns empty array or existing documents

# Add a test project
db.projects.insertOne({
  title: "Test Project From DB",
  description: "This should appear in API",
  category: "Experiments",
  featured: false
})

# Check API response - project won't be there
curl http://localhost:5001/api/projects
```

**Method 2: Code Review**

1. Open `projectController.js`
2. Look for any `import Project from '../models/Project.js'` - doesn't exist
3. Look for `await Project.find()` - doesn't exist
4. Only `sampleProjects` array and direct `res.json()`

**Method 3: Frontend Console**

1. Open Work page (shows projects)
2. Check Network tab - response is always the same 7 projects
3. No database query time in response headers

### Fix Required

```diff
// server/src/controllers/projectController.js
+ import Project from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
- export const getProjects = (req, res) => {
-   res.json(sampleProjects);
- };
+ export const getProjects = async (req, res) => {
+   try {
+     const projects = await Project.find();
+     res.json(projects);
+   } catch (error) {
+     res.status(500).json({ message: 'Failed to fetch projects' });
+   }
+ };
```

**Additional Requirements**:

- Create seed script to populate initial projects from `sampleProjects` data
- Convert string IDs to proper ObjectIds
- Consider pagination for large project lists

### Impact Assessment

- **Functionality**: 🔴 **CRITICAL** - No dynamic content management possible
- **User Experience**: Portfolio appears static, cannot showcase real work
- **Admin Experience**: Must edit code to add projects
- **Data Integrity**: Database and API are separate realities
- **Production Risk**: 🔴 **CRITICAL** - Cannot use as real portfolio

---

## Problem 3: No Input Validation on API Endpoints

**Severity**: 🔴 CRITICAL  
**Impact**: Security vulnerabilities including privilege escalation, injection attacks, data corruption  
**Effort to Fix**: 2-3 hours

### Location

- **User Registration**: `server/src/controllers/userController.js:12-21`
- **User Login**: `server/src/controllers/userController.js:39-64`
- **Contact Form**: `server/src/controllers/contactController.js:4-19`
- **All endpoints**: Lack validation middleware

### Current Code (Vulnerable)

**User Registration**:

```javascript
export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;  // No validation!

  // Can pass role: 'admin' to become admin immediately
  const user = await User.create({
    email,
    password,
    role: role || 'user'  // Accepts any role value
  });

  // No email format validation
  // No password strength requirements
  // No XSS protection
  res.status(201).json({ ... });
};
```

**Contact Form**:

```javascript
export const submitContactForm = (req, res) => {
  const { name, email, message } = req.body; // No validation!

  // Accepts:
  // - Empty strings
  // - Invalid email formats
  // - XSS payloads: <script>alert('xss')</script>
  // - NoSQL injection attempts

  console.log(`Name: ${name}`); // Logs raw input
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  res.status(200).json({ message: "Message received!" });
};
```

### Vulnerability Breakdown

#### 1. Privilege Escalation

**Attack**:

```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "attacker@example.com",
    "password": "123",
    "role": "admin"
  }'
```

**Result**: Creates user with `role: "admin"` immediately

**Impact**: Attacker gains admin access without authorization

#### 2. Weak Password Policy

**Accepts**:

- Single character passwords: `"password": "a"`
- No complexity requirements
- Common passwords: `"password": "12345678"`

**Impact**: Accounts vulnerable to brute force attacks

#### 3. Email Validation Missing

**Accepts**:

- `"email": "notanemail"`
- `"email": "missing@domain"`
- `"email": " spaces@around.com "` (not trimmed)

**Impact**:

- Cannot contact users
- Database pollution with invalid data
- Potential delivery issues if email service added later

#### 4. XSS (Cross-Site Scripting) Vulnerability

**Attack**:

```bash
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\'XSS\')</script>",
    "email": "test@test.com",
    "message": "<img src=x onerror=alert(\'XSS\')>"
  }'
```

**Result**: Raw HTML/JS stored and potentially displayed without sanitization

**Impact**: If admin dashboard displays contact messages, attacker can execute JavaScript in admin's browser

#### 5. NoSQL Injection Risk

**Attack**:

```bash
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": {"$ne": null},
    "password": "anything"
  }'
```

**Risk**: MongoDB operators in email field could manipulate queries

**Impact**: Authentication bypass, data extraction

### How to Verify

**Test 1: Admin Privilege Escalation**

```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"attacker@test.com","password":"123","role":"admin"}'

# Check response - returns 201 Created with role: "admin"
```

**Test 2: Invalid Email Acceptance**

```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"not-valid-email","password":"12345678"}'

# Returns 201 Created (should reject with 400)
```

**Test 3: XSS Payload**

```bash
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@test.com","message":"test"}'

# Returns 200 OK with unescaped script tag
```

**Test 4: Empty Data**

```bash
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"","message":""}'

# Returns 200 OK (should reject empty fields)
```

### Fix Required

**Option A: express-validator (Recommended)**

```javascript
// server/src/middleware/validation.js
import { body } from "express-validator";

export const validateRegistration = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role")
    .optional()
    .isIn(["user"]) // Only allow 'user', not 'admin'
    .withMessage("Invalid role"),
];

export const validateContact = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .escape() // Sanitize HTML
    .withMessage("Name must be 2-100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .escape()
    .withMessage("Message must be 10-1000 characters"),
];

// Usage in routes
router.post(
  "/users/register",
  validateRegistration,
  userController.registerUser,
);
router.post("/contact", validateContact, contactController.submitContactForm);
```

**Option B: Joi (Alternative)**

```javascript
import Joi from "joi";

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("user").optional(),
});
```

### Impact Assessment

- **Security**: 🔴 **CRITICAL** - Multiple attack vectors open
- **Data Integrity**: Invalid/incomplete data stored in database
- **User Experience**: No feedback on invalid inputs
- **Admin Security**: XSS can compromise admin accounts
- **Production Risk**: 🔴 **CRITICAL** - Cannot deploy without validation

---

## Problem 4: No Rate Limiting on API Endpoints

**Severity**: 🔴 CRITICAL (Security)  
**Impact**: Vulnerable to brute force attacks, API abuse, spam, resource exhaustion  
**Effort to Fix**: 30 minutes

### Location

- **File**: `server/server.js:12` (CORS is only middleware)
- **All route files**: No rate limiting applied
- **Authentication endpoints**: Most vulnerable

### Current State

```javascript
// server/server.js
app.use(cors()); // No rate limiting
app.use(express.json());

// All routes exposed without protection
app.use("/api", apiRoutes);
```

**Available Middleware**: None for rate limiting
**Current Protection**: Zero - accepts unlimited requests

### Attack Scenarios

#### 1. Brute Force Login Attack

**Attack Pattern**:

```bash
# Attacker tries thousands of password combinations
for password in $(cat passwords.txt); do
  curl -X POST http://localhost:5001/api/users/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"admin@example.com\",\"password\":\"$password\"}"
done
```

**Without Rate Limiting**:

- Can try 1000+ passwords per minute
- No account lockout
- No IP blocking
- Eventually guess weak passwords

**With Rate Limiting** (5 attempts per 15 minutes):

- Attacker locked out after 5 attempts
- 15-minute window makes brute force impractical
- Protects even weak passwords

#### 2. Registration Spam

**Attack Pattern**:

```bash
# Bot creates thousands of fake accounts
for i in {1..1000}; do
  curl -X POST http://localhost:5001/api/users/register \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"bot$i@spam.com\",\"password\":\"password123\"}"
done
```

**Impact**:

- Database flooded with fake users
- Storage costs increase
- Legitimate users can't find real accounts
- Potential legal issues (fake data)

#### 3. Contact Form Spam

**Attack Pattern**:

```bash
# Spam bot submits contact form repeatedly
while true; do
  curl -X POST http://localhost:5001/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Spammer",
      "email": "spam@example.com",
      "message": "Buy cheap products! Click here!"
    }'
done
```

**Impact**:

- Contact inbox flooded (when email service added)
- Real messages buried
- Server resources wasted
- Potential blacklist by email providers

#### 4. API Scraping / Data Harvesting

**Attack Pattern**:

```bash
# Scrape all projects rapidly
curl http://localhost:5001/api/projects

# Can be called thousands of times per minute
# No throttling on data endpoints
```

**Impact**:

- Server resources consumed
- Database overloaded with queries
- Legitimate users experience slow responses
- Bandwidth costs increase

#### 5. Resource Exhaustion

**Attack Pattern**:

```bash
# Large payload attacks
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"'$(python3 -c "print('A'*10000000)')'","email":"test@test.com","message":"test"}'
```

**Impact**:

- Large JSON payloads consume memory
- No size limits enforced
- Server can crash from memory exhaustion

### How to Verify

**Test 1: Rapid Login Attempts**

```bash
# Try 20 rapid login attempts
for i in {1..20}; do
  curl -s -X POST http://localhost:5001/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"wrong"}' \
    -w "%{http_code}\n" -o /dev/null
done

# All 20 requests will return 401 (should block after 5)
```

**Test 2: Rapid Contact Submissions**

```bash
# Submit 50 contact forms rapidly
for i in {1..50}; do
  curl -s -X POST http://localhost:5001/api/contact \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"message\":\"Message $i\"}" \
    -w "%{http_code}\n" -o /dev/null &
done
wait

# All 50 succeed (should be throttled)
```

**Test 3: Check Headers**

```bash
curl -I http://localhost:5001/api/projects

# Look for rate limit headers - won't find any:
# X-RateLimit-Limit
# X-RateLimit-Remaining
# X-RateLimit-Reset
```

### Fix Required

**Installation**:

```bash
cd server && npm install express-rate-limit
```

**Implementation**:

```javascript
// server/src/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

// Strict limit for authentication (5 attempts per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: "Too many attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Moderate limit for contact form (3 submissions per hour)
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    error: "Too many contact submissions. Please try again later.",
  },
});

// General API limit (100 requests per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests. Please slow down.",
  },
});
```

**Application in Routes**:

```javascript
// server/src/routes/index.js
import {
  authLimiter,
  contactLimiter,
  apiLimiter,
} from "../middleware/rateLimiter.js";

// Apply strict limit to auth endpoints
router.post("/users/register", authLimiter, userController.registerUser);
router.post("/users/login", authLimiter, userController.loginUser);

// Apply contact limit
router.post("/contact", contactLimiter, contactController.submitContactForm);

// Apply general limit to all routes (optional, can be in server.js)
router.get("/projects", apiLimiter, projectController.getProjects);
```

**Advanced: Different Limits by IP**

```javascript
// Store limits in memory (Redis for production)
const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rl:",
  }),
  windowMs: 15 * 60 * 1000,
  max: (req) => {
    // Premium users get higher limits
    return req.user?.role === "premium" ? 1000 : 100;
  },
});
```

### Impact Assessment

- **Security**: 🔴 **CRITICAL** - Brute force attacks possible
- **Availability**: Server can be overwhelmed with requests
- **Data Integrity**: Spam submissions pollute database
- **User Experience**: Legitimate users locked out during attacks
- **Cost**: Bandwidth and compute resources wasted
- **Production Risk**: 🔴 **CRITICAL** - Must have rate limiting before deployment

---

## Bonus: Problem 5 - No Error Handling Middleware

**Severity**: 🟠 HIGH  
**Impact**: Inconsistent error responses, unhandled crashes, poor debugging experience  
**Effort to Fix**: 1 hour

### Current Pattern (Inconsistent)

Each controller handles errors differently:

**User Controller**:

```javascript
try {
  // logic
} catch (error) {
  res.status(500).json({ message: error.message }); // Property: message
}
```

**Project Controller**:

```javascript
// No try-catch at all - will crash on error
export const getProjects = (req, res) => {
  res.json(sampleProjects);
};
```

**Contact Controller**:

```javascript
// No error handling
export const submitContactForm = (req, res) => {
  // If req.body is undefined, throws unhandled error
};
```

### Problems

1. **Inconsistent Response Structure**:
   - Some return `{ message: ... }`
   - Some might return `{ error: ... }`
   - Frontend can't reliably parse error responses

2. **No Stack Traces**:
   - `error.message` only gives the error description
   - No line numbers or context
   - Hard to debug production issues

3. **Unhandled Promise Rejections**:
   - Async errors not caught crash the Node process
   - Server goes down on unexpected errors

4. **Security Leak**:
   - Raw error messages expose internal details
   - Stack traces reveal file paths and code structure

5. **No Error Logging**:
   - Errors only visible in console (if logged)
   - No audit trail
   - No error tracking service integration

### Fix Required

```javascript
// server/src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  // Log error with context
  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error(`Request: ${req.method} ${req.path}`);
  console.error(`Error: ${err.name}: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Sanitize message for client (don't leak internal details in production)
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message;

  // Consistent response structure
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
      details: err,
    }),
  });
};

// server/server.js
app.use("/api", apiRoutes);
app.use(errorHandler); // Must be last!
```

---

## Summary Matrix

| Problem                 | Severity    | Attack Vector                        | Effort  | Files Modified                            |
| ----------------------- | ----------- | ------------------------------------ | ------- | ----------------------------------------- |
| **Auth Token Bug**      | 🔴 Critical | Authentication bypass (silent)       | 5 min   | 1 file (AuthContext.jsx)                  |
| **Hardcoded Projects**  | 🔴 Critical | No dynamic data                      | 1-2 hrs | 2 files (controller + seed)               |
| **No Input Validation** | 🔴 Critical | Privilege escalation, XSS, injection | 2-3 hrs | 3+ files (validation middleware + routes) |
| **No Rate Limiting**    | 🔴 Critical | Brute force, spam, DoS               | 30 min  | 2 files (middleware + routes)             |
| **No Error Handling**   | 🟠 High     | Crashes, debugging issues            | 1 hr    | 2 files (middleware + server)             |

---

## Verification Commands

Run these to confirm problems exist:

```bash
# 1. Check auth token storage (Problem 1)
echo "Check browser Local Storage -> token key should be JWT, not MongoDB ID"

# 2. Verify hardcoded data (Problem 2)
curl http://localhost:5001/api/projects | jq '. | length'
# Always returns 7 (hardcoded) regardless of database

# 3. Test privilege escalation (Problem 3)
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"1","role":"admin"}' \
  -s | jq '.role'
# Returns "admin" (should be rejected)

# 4. Test rate limiting absence (Problem 4)
for i in {1..10}; do
  curl -s -X POST http://localhost:5001/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"a@b.com","password":"wrong"}' \
    -w "%{http_code}\n" -o /dev/null
done
# All return 401 (should block after 5)
```

---

_Document created as part of security audit and remediation planning._
