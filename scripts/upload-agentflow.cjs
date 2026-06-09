/**
 * Upload Agentflow to Flowise via API
 * 
 * Updates the ALHENA_CRM_Agentflow in Flowise with the local JSON
 * 
 * Usage: node scripts/upload-agentflow.cjs
 * 
 * Requires FLOWISE_API_KEY environment variable
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// Load .env file
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  }
}

// ── Configuration ──
const FLOWISE_HOST = "ecoflow.koppi.mx";
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY || "";
const CHATFLOW_ID = "c4e6b0d8-30ab-4466-bfc8-c3d8bf5231ea";
const AGENTFLOW_PATH = path.join(__dirname, "..", "flowise", "ALHENA_CRM_Agentflow.json");

if (!FLOWISE_API_KEY) {
  console.error("❌ FLOWISE_API_KEY not set in .env");
  process.exit(1);
}

// ── HTTP Helper ──
function makeRequest(method, pathUrl, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: FLOWISE_HOST,
      port: 443,
      path: pathUrl,
      method,
      headers: {
        "Authorization": `Bearer ${FLOWISE_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ── Main ──
async function main() {
  console.log("📤 Uploading Agentflow to Flowise...\n");

  // Read local agentflow
  const agentflow = JSON.parse(fs.readFileSync(AGENTFLOW_PATH, "utf-8"));

  // Get current chatflow to preserve metadata
  console.log("  📥 Fetching current chatflow metadata...");
  const current = await makeRequest("GET", `/api/v1/chatflows/${CHATFLOW_ID}`);

  // Update with new nodes and edges
  const updatePayload = {
    name: current.name,
    flowData: JSON.stringify({
      nodes: agentflow.nodes,
      edges: agentflow.edges,
      viewport: agentflow.viewport || current.flowData?.viewport || { x: 0, y: 0, zoom: 1 }
    }),
    deployed: current.deployed,
    isPublic: current.isPublic,
    apikeyid: current.apikeyid,
    chatbotConfig: current.chatbotConfig,
    apiConfig: current.apiConfig,
    analytic: current.analytic,
    speechToText: current.speechToText,
    category: current.category,
    type: current.type || "AGENTFLOW"
  };

  console.log("  📤 Uploading updated agentflow...");
  await makeRequest("PUT", `/api/v1/chatflows/${CHATFLOW_ID}`, updatePayload);

  console.log("\n✅ Agentflow uploaded successfully!");
  console.log(`   Chatflow ID: ${CHATFLOW_ID}`);
  console.log(`   Nodes: ${agentflow.nodes?.length || 0}`);
  console.log(`   Edges: ${agentflow.edges?.length || 0}`);
}

main().catch((err) => {
  console.error("\n❌ Upload failed:", err.message);
  process.exit(1);
});
