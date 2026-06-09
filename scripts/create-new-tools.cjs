/**
 * Create new CustomTools in Flowise for the RequestsGet replacement
 * 
 * Creates: ALHENA_listar_tipologias, ALHENA_consultar_unidades_tipo, ALHENA_info_planes_pago
 * 
 * Run: node scripts/create-new-tools.cjs
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

const FLOWISE_HOST = "ecoflow.koppi.mx";
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY || "";

function makeRequest(method, pathUrl, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: FLOWISE_HOST,
      port: 443,
      path: pathUrl,
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FLOWISE_API_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch { resolve(data); }
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

const NEW_TOOLS = [
  "ALHENA_listar_tipologias-CustomTool.json",
  "ALHENA_consultar_unidades_tipo-CustomTool.json",
  "ALHENA_info_planes_pago-CustomTool.json",
];

async function main() {
  console.log("🔧 Creating new CustomTools in Flowise...\n");

  // Check if tools already exist
  const existing = await makeRequest("GET", "/api/v1/tools");
  const existingNames = new Set(existing.map((t) => t.name));

  for (const file of NEW_TOOLS) {
    const filePath = path.join(__dirname, "..", "flowise", "tools", file);
    const toolData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (existingNames.has(toolData.name)) {
      // Update existing
      const existingTool = existing.find((t) => t.name === toolData.name);
      console.log(`  📝 Updating existing: ${toolData.name} (${existingTool.id})`);
      await makeRequest("PUT", `/api/v1/tools/${existingTool.id}`, {
        name: toolData.name,
        description: toolData.description,
        color: toolData.color,
        iconSrc: toolData.iconSrc || "",
        schema: toolData.schema,
        func: toolData.func,
      });
      console.log(`  ✅ Updated: ${toolData.name}\n`);
    } else {
      // Create new
      console.log(`  🆕 Creating: ${toolData.name}`);
      const result = await makeRequest("POST", "/api/v1/tools", {
        name: toolData.name,
        description: toolData.description,
        color: toolData.color,
        iconSrc: toolData.iconSrc || "",
        schema: toolData.schema,
        func: toolData.func,
      });
      console.log(`  ✅ Created: ${toolData.name} (ID: ${result.id})\n`);
    }
  }

  // Print all tool IDs for reference
  console.log("\n📋 All ALHENA tools:");
  const allTools = await makeRequest("GET", "/api/v1/tools");
  for (const t of allTools.filter((t) => t.name.startsWith("ALHENA_"))) {
    console.log(`  ${t.name}: ${t.id}`);
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
