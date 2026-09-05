"""Regression tests for the EcoFlow agent template safety baseline."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

import agent_factory as factory  # noqa: E402


def node(flow: dict, node_id: str) -> dict:
    return factory.node_by_id(flow, node_id)


def contains_system_marker(agent: dict, marker: str) -> bool:
    return any(marker in content for content in factory.system_contents(agent))


class AgentFactorySafetyTests(unittest.TestCase):
    def assert_safe_baseline(self, flow: dict, category: str | None = None) -> None:
        qa = node(flow, factory.NODE_QA)
        qa_inputs = qa["data"]["inputs"]
        self.assertEqual(
            {key: qa_inputs.get(key) for key in factory.WEB_SEARCH_CONFIG},
            factory.WEB_SEARCH_CONFIG,
        )
        self.assertTrue(contains_system_marker(qa, factory.SAFE_WEB_MARKER))
        if category:
            self.assertIn(factory.category_scope(category), " ".join(factory.system_contents(qa)))

        source_tools = [
            tool["agentSelectedToolConfig"]
            for tool in qa_inputs["agentTools"]
            if tool.get("agentSelectedToolConfig", {}).get("agentSelectedTool") == "requestsGet"
        ]
        self.assertTrue(source_tools)
        self.assertTrue(
            all(factory.SOURCE_GUARD_MARKER in tool["requestsGetDescription"] for tool in source_tools)
        )

        router = node(flow, factory.NODE_ROUTER)
        self.assertIn(
            factory.ROUTER_GUARD_MARKER,
            router["data"]["inputs"]["conditionAgentInstructions"],
        )
        scenario_default = next(
            parameter["default"]
            for parameter in router["data"]["inputParams"]
            if parameter["name"] == "conditionAgentScenarios"
        )
        self.assertEqual(scenario_default, router["data"]["inputs"]["conditionAgentScenarios"])

        off_topic = node(flow, factory.NODE_OFFTOPIC)
        self.assertTrue(contains_system_marker(off_topic, factory.OFF_TOPIC_GUARD_MARKER))

    def test_canonical_template_has_the_safe_baseline(self) -> None:
        template = factory.load_flow(factory.TEMPLATE_FILE)
        self.assert_safe_baseline(template)
        self.assertNotIn("web_search_preview", factory.TEMPLATE_FILE.read_text(encoding="utf-8-sig"))

    def test_build_flow_applies_the_selected_category_without_changing_topology(self) -> None:
        flow = factory.build_flow(
            "Northport",
            "TEST_DOCUMENT_ID_123",
            category="industrial",
            model="gpt-5.4",
        )
        self.assert_safe_baseline(flow, "industrial")
        self.assertNotIn("multilingual real estate advisor", factory.system_message(node(flow, factory.NODE_QA))["content"])
        factory.validate_flow(flow, "Northport", "TEST_DOCUMENT_ID_123")

    def test_policy_update_is_idempotent_and_replaces_template_scope(self) -> None:
        first = factory.update_flow(
            factory.load_flow(factory.TEMPLATE_FILE),
            "Volterra",
            category="industrial",
        )
        second = factory.update_flow(first, "Volterra", category="industrial")
        self.assert_safe_baseline(second, "industrial")

        qa = node(second, factory.NODE_QA)
        self.assertEqual(
            sum(factory.SAFE_WEB_MARKER in content for content in factory.system_contents(qa)),
            1,
        )
        router_instructions = node(second, factory.NODE_ROUTER)["data"]["inputs"]["conditionAgentInstructions"]
        self.assertEqual(router_instructions.count(factory.ROUTER_GUARD_MARKER), 1)


if __name__ == "__main__":
    unittest.main()
