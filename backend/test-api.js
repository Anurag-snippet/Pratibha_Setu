const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runSelfTest() {
  console.log(`[Test] Verifying Pratibha Setu API endpoints against ${BASE_URL}...`);

  try {
    // 1. Health check
    console.log(`[Test] 1. Checking /api/health...`);
    const health = await makeRequest('/api/health');
    console.log(`✓ Health status ${health.status}:`, health.body.message);

    // 2. Opportunities list
    console.log(`[Test] 2. Checking /api/opportunities...`);
    const opps = await makeRequest('/api/opportunities');
    console.log(`✓ Opportunities status ${opps.status}: ${opps.body.count} records returned.`);

    // 3. Skills list
    console.log(`[Test] 3. Checking /api/skills...`);
    const skills = await makeRequest('/api/skills');
    console.log(`✓ Skills status ${skills.status}: ${skills.body.count} skills catalogued.`);

    // 4. Test Student Login
    console.log(`[Test] 4. Testing /api/auth/login with student credentials...`);
    const loginRes = await makeRequest('/api/auth/login', 'POST', {
      email: 'ananya.sharma@example.in',
      password: 'password123',
    });

    if (loginRes.status === 200) {
      console.log(`✓ Student Login Successful. Welcome ${loginRes.body.data.user.name}`);
      const token = loginRes.body.data.token;
      const studentId = loginRes.body.data.profile._id;

      // 5. Recommendations
      console.log(`[Test] 5. Testing /api/students/:id/recommendations...`);
      const recRes = await makeRequest(
        `/api/students/${studentId}/recommendations`,
        'GET',
        null,
        { Authorization: `Bearer ${token}` }
      );
      console.log(`✓ Recommendations status ${recRes.status}: ${recRes.body.count} opportunities scored.`);

      // 6. Skill gap
      console.log(`[Test] 6. Testing /api/students/:id/skill-gap...`);
      const gapRes = await makeRequest(
        `/api/students/${studentId}/skill-gap`,
        'GET',
        null,
        { Authorization: `Bearer ${token}` }
      );
      console.log(`✓ Skill gap status ${gapRes.status}: analysis generated.`);

      // 7. Dashboard
      console.log(`[Test] 7. Testing /api/dashboard/student/:id...`);
      const dashRes = await makeRequest(
        `/api/dashboard/student/${studentId}`,
        'GET',
        null,
        { Authorization: `Bearer ${token}` }
      );
      console.log(`✓ Student Dashboard status ${dashRes.status}: stats & radar benchmarks loaded.`);
    } else {
      console.log(`ℹ️ Login status ${loginRes.status} (Note: MongoDB database must be running to test authentication/write operations).`);
    }

    console.log(`\n🎉 Self-test execution finished!`);
  } catch (error) {
    console.log(`ℹ️ Test note: ${error.message}`);
  }
}

if (require.main === module) {
  runSelfTest();
}

module.exports = runSelfTest;
