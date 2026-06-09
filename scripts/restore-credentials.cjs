/**
 * Restore credentials in Flowise Agentflow
 * 
 * Fixes the FLOWISE_CREDENTIAL_ID for all agent nodes and conditionAgent
 * 
 * Run: node scripts/restore-credentials.cjs
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Load .env
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const [key, ...v] = line.split("=");
    if (key && v.length) process.env[key.trim()] = v.join("=").trim();
  }
}

const FLOWISE_HOST = "ecoflow.koppi.mx";
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY;
const CHATFLOW_ID = "c4e6b0d8-30ab-4466-bfc8-c3d8bf5231ea";
const OPENAI_CREDENTIAL_ID = "e8fe03f6-9865-4abf-a662-ebdfe5561c5a";

function makeRequest(method, pathUrl, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: FLOWISE_HOST, port: 443, path: pathUrl, method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${FLOWISE_API_KEY}` },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch { resolve(data); }
        } else { reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 500)}`)); }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log("🔧 Restoring credentials in Flowise Agentflow...\n");

  // 1. Get current chatflow
  const chatflow = await makeRequest("GET", `/api/v1/chatflows/${CHATFLOW_ID}`);
  const flowData = JSON.parse(chatflow.flowData);

  let fixed = 0;

  for (const node of flowData.nodes) {
    const inputs = node.data?.inputs;
    if (!inputs) continue;

    // Fix agent model config
    if (inputs.agentModelConfig && inputs.agentModelConfig.agentModel === "chatOpenAI") {
      if (!inputs.agentModelConfig.FLOWISE_CREDENTIAL_ID) {
        inputs.agentModelConfig.FLOWISE_CREDENTIAL_ID = OPENAI_CREDENTIAL_ID;
        console.log(`  ✅ ${node.data.label}: restored agent model credential`);
        fixed++;
      } else {
        console.log(`  ✔️  ${node.data.label}: agent credential OK (${inputs.agentModelConfig.FLOWISE_CREDENTIAL_ID})`);
      }
    }

    // Fix condition agent model config
    if (inputs.conditionAgentModelConfig && inputs.conditionAgentModelConfig.conditionAgentModel === "chatOpenAI") {
      if (!inputs.conditionAgentModelConfig.FLOWISE_CREDENTIAL_ID) {
        inputs.conditionAgentModelConfig.FLOWISE_CREDENTIAL_ID = OPENAI_CREDENTIAL_ID;
        console.log(`  ✅ ${node.data.label}: restored condition agent credential`);
        fixed++;
      } else {
        console.log(`  ✔️  ${node.data.label}: condition credential OK`);
      }
    }
  }

  if (fixed === 0) {
    console.log("  All credentials OK!");
    return;
  }

  // 2. Upload back
  await makeRequest("PUT", `/api/v1/chatflows/${CHATFLOW_ID}`, {
    flowData: JSON.stringify(flowData),
  });

  console.log(`\n✅ Restored ${fixed} credentials`);

  // 3. Verify
  const verify = await makeRequest("GET", `/api/v1/chatflows/${CHATFLOW_ID}`);
  const verifyData = JSON.parse(verify.flowData);
  for (const node of verifyData.nodes) {
    const cred = node.data?.inputs?.agentModelConfig?.FLOWISE_CREDENTIAL_ID || 
                 node.data?.inputs?.conditionAgentModelConfig?.FLOWISE_CREDENTIAL_ID;
    if (cred) {
      console.log(`  ${node.data.label}: ${cred === OPENAI_CREDENTIAL_ID ? "✅" : "❌"} ${cred}`);
    }
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
