/**
 * Update Flowise Custom Tools via API
 * 
 * Reads the updated tool JSON files from flowise/tools/ and updates them
 * in the Flowise instance via the API.
 * 
 * Usage: node scripts/update-flowise-tools.cjs
 * 
 * Requires FLOWISE_API_KEY environment variable or will prompt.
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

// Map tool names to their Flowise UUIDs (from the Agentflow JSON)
const TOOL_UUID_MAP = {
  "ALHENA_consultar_leads": "2a3fc8b6-b3cd-45c8-8c74-b2dcd597ec67",
  "ALHENA_crear_lead": "64749008-2b77-43df-8451-7d5554ecfde3",
  "ALHENA_actualizar_lead": "a6d9a507-f9a6-4027-81eb-0a748e07fa46",
  "ALHENA_registrar_interaccion": "f037c6f2-c312-4b12-98ec-d37668282615",
  "ALHENA_consultar_leads_cot": "d19b4a12-5c8e-4f3a-9b2d-1e6f8c7a5b3d", // Update if different
  "ALHENA_consultar_cotizaciones": "e28c5b23-6d9f-5g4b-0c3e-2f7g9d8b6c4e", // Update if different
  "ALHENA_guardar_cotizacion": "f39d6c34-7e0g-6h5c-1d4f-3g8h0e9c7d5f", // Update if different
  "ALHENA_dashboard_stats": "g40e7d45-8f1h-7i6d-2e5g-4h9i1f0d8e6g", // Update if different
  "ALHENA_guardar_reporte": "h51f8e56-9g2i-8j7e-3f6h-5i0j2g1e9f7h", // Update if different
  "ALHENA_info_leads_rep": "i62g9f67-0h3j-9k8f-4g7i-6j1k3h2f0g8i", // Update if different
  "ALHENA_info_cotizaciones_rep": "j73h0g78-1i4k-0l9g-5h8j-7k2l4i3g1h9j", // Update if different
};

const TOOLS_DIR = path.join(__dirname, "..", "flowise", "tools");

// ── HTTP Helper ──
function makeRequest(method, pathUrl, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: FLOWISE_HOST,
      port: 443,
      path: pathUrl,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (FLOWISE_API_KEY) {
      options.headers["Authorization"] = `Bearer ${FLOWISE_API_KEY}`;
    }

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers["Content-Length"] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, data: data });
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 500)}`));
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ── Get all existing tools to find UUIDs ──
async function getAllTools() {
  console.log("📋 Fetching existing tools from Flowise...");
  const result = await makeRequest("GET", "/api/v1/tools");
  return result.data;
}

// ── Update a single tool ──
async function updateTool(toolId, toolData) {
  console.log(`   🔄 Updating tool: ${toolData.name}`);
  const payload = {
    name: toolData.name,
    description: toolData.description,
    color: toolData.color,
    iconSrc: toolData.iconSrc || "",
    schema: toolData.schema,
    func: toolData.func,
  };
  
  const result = await makeRequest("PUT", `/api/v1/tools/${toolId}`, payload);
  return result;
}

// ── Main ──
async function main() {
  console.log("🚀 Flowise Tools Updater\n");
  console.log(`   Host: ${FLOWISE_HOST}`);
  console.log(`   API Key: ${FLOWISE_API_KEY ? "***" + FLOWISE_API_KEY.slice(-4) : "(not set)"}\n`);

  // Get all existing tools to map names to IDs
  let existingTools;
  try {
    existingTools = await getAllTools();
    console.log(`   Found ${existingTools.length} existing tools\n`);
  } catch (err) {
    console.error("❌ Failed to fetch tools:", err.message);
    console.log("\n💡 Make sure FLOWISE_API_KEY is set or the Flowise instance allows unauthenticated API access.");
    process.exit(1);
  }

  // Build name → id map from actual Flowise data
  const nameToId = {};
  for (const tool of existingTools) {
    nameToId[tool.name] = tool.id;
  }

  // Read local tool files
  const toolFiles = fs.readdirSync(TOOLS_DIR).filter((f) => f.endsWith(".json"));
  console.log(`📂 Found ${toolFiles.length} local tool files\n`);

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  for (const file of toolFiles) {
    const filePath = path.join(TOOLS_DIR, file);
    const toolData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const toolId = nameToId[toolData.name];
    if (!toolId) {
      console.log(`   ⚠️  Skipped: ${toolData.name} (not found in Flowise)`);
      skipped++;
      continue;
    }

    try {
      await updateTool(toolId, toolData);
      console.log(`   ✅ Updated: ${toolData.name}`);
      updated++;
    } catch (err) {
      console.log(`   ❌ Failed: ${toolData.name} - ${err.message}`);
      failed++;
    }
  }

  console.log("\n" + "═".repeat(50));
  console.log(`📊 Results: ${updated} updated, ${skipped} skipped, ${failed} failed`);
  
  if (updated > 0) {
    console.log("\n✅ Tools updated! The Agentflow will use the new code on next execution.");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
