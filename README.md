# 🧪 WDIO API Test Automation – RealWorld Backend

This project contains a full **API test automation suite** built with **WebdriverIO**, **Mocha**, **Axios**, and **Allure reporting**.  
It targets the [RealWorld backend API](https://github.com/gothinkster/realworld) and verifies core functionality including authentication, article CRUD, comments, and tags.

---

## 🚀 Project Overview

| Layer | Technology |
|--------|-------------|
| Test Framework | WebdriverIO (v9) |
| Assertion Library | Mocha + Expect |
| HTTP Client | Axios |
| Reporting | Allure |
| CI Ready | ✅ Compatible with GitHub Actions |
| Language | JavaScript (Node.js) |

---

## 🧩 Folder Structure

wdio-project/
│
├── test/
│ ├── api/
│ │ ├── users.api.spec.js # User registration tests
│ │ ├── login.api.spec.js # Login flow tests
│ │ ├── articles.api.spec.js # Full CRUD tests for articles
│ │ ├── comments.api.spec.js # Comment creation & validation
│ │ └── tags.api.spec.js # Tag list retrieval
│ └── helpers/
│ └── auth.helper.js # Shared user/token setup
│
├── wdio.conf.api.cjs # WDIO config for API tests
├── start-dev.ps1 # Script to start backend & run tests
├── package.json # NPM scripts & dependencies
└── reports/ # Allure test results (auto-generated)


---

## ⚙️ Setup Instructions

### 1️⃣ Install dependencies

```bash
npm install

Start backend (RealWorld API)

Make sure the backend is running on http://localhost:3001
 before starting tests.

Or simply use the included script:

.\start-dev.ps1


This script:

Starts the backend server in a minimized PowerShell window

Waits a few seconds

Runs the WDIO API test suite

🧪 Run Tests
Run all API tests
npm run test:api

Run a specific test file
npx wdio run ./wdio.conf.api.cjs --spec ./test/api/articles.api.spec.js

Run tests and generate report automatically
npm run test:api:report

📊 Allure Reporting
Generate & open report
npm run report:allure


After generation, a browser window will open showing:

Test results with duration and history

Console logs (e.g. created IDs, slugs, etc.)

Passed/Failed breakdown

🧱 Global Token Setup

A shared JWT token is generated automatically via:

beforeSuite: async function () {
  global.authToken = await getAuthToken();
}


This allows all test suites to reuse the same authenticated session without re-login.

🧰 PowerShell Helper

start-dev.ps1
Runs both backend & tests automatically:

Start-Process powershell -ArgumentList "cd ../realworld-backend; npm run dev" -WindowStyle Minimized
Start-Sleep -Seconds 5
npx wdio run ./wdio.conf.api.cjs --no-cache

🧾 NPM Scripts
Command	Description
npm run test:api	Run all API tests
npm run test:api:report	Run tests + open Allure report
npm run report:allure	Generate and open Allure report
npm test	Default WebdriverIO UI test run (optional)
✅ Covered Endpoints
Area	Endpoint	Verified Scenarios
Users	/api/users	Registration, duplicate emails
Login	/api/users/login	Valid & invalid credentials
Articles	/api/articles	Create, update, get, delete
Comments	/api/articles/:slug/comments	Add, fetch (graceful handling), delete
Tags	/api/tags	Retrieve tag list
📦 CI/CD Integration

This project supports GitHub Actions.
To trigger tests automatically:

Commit & push to GitHub

Go to Actions → WDIO Tests

Watch your pipeline execute the API suite & publish Allure results

👨‍💻 Author

Constantin Arseni
📧 constantin.arseni@endava.com