const fs = require('fs');
const path = require('path');

async function testLiveFlow() {
  console.log("Starting Root Analysis of the Next.js API endpoint...");

  const payload = {
    idea: "An AI-powered automated code editor for junior developers.",
    roastLevel: "honest",
    industry: "Developer Tools",
    stage: "Idea Stage"
  };

  try {
    console.log("Calling API endpoint http://localhost:3000/api/analyze-startup...");
    const res = await fetch("http://localhost:3000/api/analyze-startup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseText = await res.text();
    console.log("API HTTP Status:", res.status);
    
    if (!res.ok) {
      throw new Error(`API returned HTTP error: ${res.status} - ${responseText}`);
    }

    const reportJson = JSON.parse(responseText);
    console.log("Success! API generated a valid JSON report.");
    console.log("Score:", reportJson.startupScore);
    console.log("Verdict:", reportJson.verdict);
    console.log("Roast:", reportJson.roast);
    console.log("=== ROOT ANALYSIS SUCCESSFUL ===");

  } catch (error) {
    console.error("=== ROOT ANALYSIS FAILURE ===");
    console.error("Error Details:", error.message);
  }
}

testLiveFlow();
