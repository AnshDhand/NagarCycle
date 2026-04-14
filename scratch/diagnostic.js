require('dotenv').config();

async function testFetch() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${key}`;
    
    console.log("Testing with direct Fetch (v1)...");
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
        });
        const data = await response.json();
        if (response.ok) {
            console.log("✅ Fetch (v1) WORKS!");
        } else {
            console.log("❌ Fetch (v1) failed:", JSON.stringify(data));
        }
    } catch (e) {
        console.error("Fetch Error:", e.message);
    }
}

testFetch();
