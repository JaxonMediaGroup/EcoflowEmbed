#!/usr/bin/env node
/**
 * patch-add-tools-to-general.cjs
 * 
 * Adds missing cotización tools to the Agente general node so it can
 * handle follow-up messages that get routed there instead of the
 * specialized cotización agent.
 * 
 * Run: node scripts/patch-add-tools-to-general.cjs
 */

const https = require('https');

const FLOWISE_HOST = 'ecoflow.koppi.mx';
const FLOWISE_API_KEY = 'Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8';
const CHATFLOW_ID = 'c4e6b0d8-30ab-4466-bfc8-c3d8bf5231ea';

// Tools to add to Agente general (agentAgentflow_5)
const TOOLS_TO_ADD = {
  agentAgentflow_5: [ // Agente general
    { id: 'e3a29bf8-0ab3-480a-b12d-40e45aaea659', name: 'ALHENA_guardar_cotizacion' },
    { id: '8d21c87f-a16d-418a-9ca5-0ff99cfdbcf8', name: 'ALHENA_info_planes_pago' },
    { id: '57f2677f-eac5-4aea-a1bd-5f1d6d85da51', name: 'ALHENA_consultar_leads_cot' },
    { id: '64749008-2b77-43df-8451-7d5554ecfde3', name: 'ALHENA_crear_lead' },
  ]
};

function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: FLOWISE_HOST,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${FLOWISE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 500)}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function makeCustomToolEntry(id, name) {
  return {
    agentSelectedTool: 'customTool',
    agentSelectedToolRequiresHumanInput: '',
    agentSelectedToolConfig: {
      selectedTool: id,
      returnDirect: '',
      customToolName: name,
      customToolDesc: '',
      customToolSchema: '',
      customToolFunc: '',
      agentSelectedTool: 'customTool'
    }
  };
}

async function main() {
  console.log('🔧 Adding missing tools to agent nodes\n');

  // 1. Fetch current agentflow
  console.log('📋 Fetching agentflow from Flowise...');
  const chatflow = await makeRequest('GET', `/api/v1/chatflows/${CHATFLOW_ID}`);
  const flowData = JSON.parse(chatflow.flowData);
  
  let totalAdded = 0;

  // 2. Iterate target nodes and add missing tools
  for (const node of flowData.nodes) {
    const nodeId = node.data?.id;
    const toolsToAdd = TOOLS_TO_ADD[nodeId];
    if (!toolsToAdd) continue;

    const nodeLabel = node.data.label || nodeId;
    const existingTools = node.data.inputs.agentTools || [];
    
    // Get existing tool names
    const existingNames = new Set();
    for (const t of existingTools) {
      if (t.agentSelectedTool === 'customTool') {
        existingNames.add(t.agentSelectedToolConfig.customToolName);
      }
    }

    for (const tool of toolsToAdd) {
      if (existingNames.has(tool.name)) {
        console.log(`   ⏭️  [${nodeLabel}] ${tool.name} — already present`);
        continue;
      }

      existingTools.push(makeCustomToolEntry(tool.id, tool.name));
      totalAdded++;
      console.log(`   ✅ [${nodeLabel}] Added ${tool.name}`);
    }

    node.data.inputs.agentTools = existingTools;
  }

  if (totalAdded === 0) {
    console.log('\n✅ All tools already present. Nothing to do.');
    return;
  }

  // 3. Upload
  console.log(`\n📤 Uploading patched agentflow (${totalAdded} tools added)...`);
  const updatedFlowData = JSON.stringify(flowData);
  const body = JSON.stringify({ flowData: updatedFlowData });
  await makeRequest('PUT', `/api/v1/chatflows/${CHATFLOW_ID}`, body);

  console.log(`\n✅ Done! ${totalAdded} tools added.`);

  // 4. Verify
  console.log('\n🔍 Verifying...');
  const verify = await makeRequest('GET', `/api/v1/chatflows/${CHATFLOW_ID}`);
  const verifyFlow = JSON.parse(verify.flowData);
  for (const node of verifyFlow.nodes) {
    const nodeId = node.data?.id;
    if (!TOOLS_TO_ADD[nodeId]) continue;
    const tools = node.data.inputs.agentTools || [];
    const names = tools.map(t => t.agentSelectedToolConfig?.customToolName || t.agentSelectedToolConfig?.requestsGetName).filter(Boolean);
    console.log(`   ${node.data.label}: ${names.length} tools → ${names.join(', ')}`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
