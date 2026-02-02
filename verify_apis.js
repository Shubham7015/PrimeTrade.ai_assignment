const fetch = require("node-fetch"); // Fallback if global fetch not available? Node 18 has it.
// Actually, let's use standard http if we want to be safe, but fetch is easier.
// Let's assume global fetch (Node 18+) or try to require it if user has it.
// The user has 'axios' in 'client' node_modules. Let's use that if possible, or just standard http.
// To be safe and dependency-free for the root, I'll use a simple wrapper around http.

const http = require("http");

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/v1" + path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("--- Starting API Verification ---");
  const timestamp = Date.now();
  const testUser = {
    name: "API Tester",
    email: `api_test_${timestamp}@example.com`,
    password: "password123",
  };

  try {
    // 1. Signup
    console.log(`\n1. Testing Signup (${testUser.email})...`);
    const signupRes = await request("/auth/signup", testUser);
    if (signupRes.status !== 201)
      throw new Error(
        `Signup failed: ${signupRes.status} - ${JSON.stringify(signupRes.data)}`,
      );
    console.log("✅ Signup Successful");

    // 2. Login
    console.log("\n2. Testing Login...");
    const loginRes = await request("/auth/login", {
      email: testUser.email,
      password: testUser.password,
    });
    if (loginRes.status !== 200 || !loginRes.data.token)
      throw new Error(`Login failed: ${loginRes.status}`);
    const token = loginRes.data.token;
    console.log("✅ Login Successful (Token received)");

    // 3. Create Task
    console.log("\n3. Testing Create Task...");
    const taskData = {
      title: "Test Task via Script",
      description: "Created by verification script",
      status: "pending",
      dueDate: new Date().toISOString(),
    };
    const createRes = await request("/tasks", taskData, token);
    if (createRes.status !== 201)
      throw new Error(`Create Task failed: ${createRes.status}`);
    console.log("✅ Create Task Successful");

    // 4. Get Tasks
    console.log("\n4. Testing Get All Tasks...");
    const getTasksRes = await request("/tasks", null, token);
    if (getTasksRes.status !== 200 || !Array.isArray(getTasksRes.data))
      throw new Error(`Get Tasks failed: ${getTasksRes.status}`);
    console.log(
      `✅ Get Tasks Successful (Found ${getTasksRes.data.length} tasks)`,
    );

    // 5. Get Profile
    console.log("\n5. Testing Get Profile...");
    const profileRes = await request("/me", null, token);
    if (profileRes.status !== 200 || profileRes.data.email !== testUser.email)
      throw new Error(`Get Profile failed: ${profileRes.status}`);
    console.log("✅ Get Profile Successful");

    console.log("\n--- 🎉 All API Tests Passed! ---");
  } catch (error) {
    console.error("\n❌ API Verification Failed:", error.message);
    process.exit(1);
  }
}

runTests();
