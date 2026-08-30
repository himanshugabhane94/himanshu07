import unittest
from app.services.seed_data import seed_database, DEMO_CASES
from app.services.graph_engine import graph_engine
from app.services.blockchain_service import blockchain_service
from app.services.nlp_extractor import nlp_extractor
from app.services.report_generator import report_generator

class TestCrimeNetBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        seed_database()

    def test_seed_database_populated(self):
        graph_data = graph_engine.get_graph_data()
        self.assertGreaterEqual(len(graph_data.nodes), 30, "Should have at least 30 nodes")
        self.assertGreaterEqual(len(graph_data.edges), 40, "Should have at least 40 edges")
        print(f"[PASS] Seed Database Test Passed: {len(graph_data.nodes)} nodes, {len(graph_data.edges)} edges")

    def test_centrality_calculation(self):
        pagerank_res = graph_engine.calculate_centrality(case_id="CASE-HAWALA-2024", metric="pagerank")
        self.assertGreater(len(pagerank_res.rankings), 0)
        # Vikram Sharma should be at the top
        top_node = pagerank_res.rankings[0]
        self.assertIn("Vikram", top_node["label"])
        print(f"[PASS] Centrality Test Passed: Top Kingpin identified as '{top_node['label']}' with score {top_node['score']}")

    def test_community_detection(self):
        communities = graph_engine.detect_communities(case_id="CASE-HAWALA-2024")
        self.assertGreater(len(communities), 0)
        print(f"[PASS] Community Detection Test Passed: Detected {len(communities)} criminal clusters")

    def test_shortest_path(self):
        path_res = graph_engine.find_shortest_path("PER_ROHIT_KHANNA", "ACC_SWISS_9941")
        self.assertTrue(path_res.found)
        self.assertGreater(path_res.path_length, 0)
        print(f"[PASS] Shortest Path Test Passed: Traced {path_res.path_length}-hop path between Rohit Khanna and Swiss Bank")

    def test_link_prediction(self):
        preds = graph_engine.predict_links(case_id="CASE-HAWALA-2024", top_k=5)
        self.assertIsInstance(preds, list)
        print(f"[PASS] Link Prediction Test Passed: Generated {len(preds)} predicted unconfirmed links")

    def test_anomaly_detection(self):
        anomalies = graph_engine.detect_anomalies(case_id="CASE-HAWALA-2024")
        self.assertGreater(len(anomalies), 0)
        print(f"[PASS] Anomaly Detection Test Passed: Flagged {len(anomalies)} structural & financial anomalies")

    def test_nlp_extraction(self):
        raw_text = "Accused Vikram Sharma was seen with suspect Sameer Merchant transferring funds to Account No 501004 using phone +91-9820199881."
        result = nlp_extractor.extract_from_text(raw_text)
        self.assertGreater(result.total_entities_found, 0)
        print(f"[PASS] NLP Extraction Test Passed: Extracted {result.total_entities_found} entities and {result.total_relationships_found} relationships")

    def test_blockchain_integrity_and_tamper_detection(self):
        # 1. Verify clean chain
        verification = blockchain_service.verify_integrity()
        self.assertTrue(verification.is_valid)
        print(f"[PASS] Blockchain Integrity Initial Check Passed: {verification.total_blocks} blocks verified")

        # 2. Simulate Tamper Attack on Block #1
        tamper_res = blockchain_service.simulate_tamper_attack(block_index=1, malicious_data={"tampered": "hacked"})
        self.assertEqual(tamper_res["status"], "TAMPER_INJECTED")

        # 3. Verify that integrity check FAILS and flags Block #1
        tampered_verification = blockchain_service.verify_integrity()
        self.assertFalse(tampered_verification.is_valid)
        self.assertEqual(tampered_verification.tampered_block_index, 1)
        print(f"[PASS] Blockchain Tamper Detection Test Passed: Successfully caught tampering at Block #{tampered_verification.tampered_block_index}")

        # 4. Restore Chain
        restore_res = blockchain_service.restore_tampered_chain()
        self.assertEqual(restore_res["status"], "RESTORED")
        restored_verification = blockchain_service.verify_integrity()
        self.assertTrue(restored_verification.is_valid)
        print("[PASS] Blockchain Restore Test Passed: Chain restored to verified state")

    def test_report_generation(self):
        html = report_generator.generate_case_dossier_html("CASE-HAWALA-2024")
        self.assertIn("GOVERNMENT OF INDIA", html)
        self.assertIn("Section 65B", html)
        print(f"[PASS] Report Generation Test Passed: HTML dossier generated ({len(html)} bytes)")

    def test_explainability_engine(self):
        from app.services.explainability_engine import explainability_engine
        explanation = explainability_engine.generate_explanation("PER_VIKRAM_SHARMA", "CASE-HAWALA-2024")
        self.assertEqual(explanation.node_id, "PER_VIKRAM_SHARMA")
        self.assertGreaterEqual(explanation.confidence_score, 80)
        self.assertGreater(len(explanation.risk_drivers), 0)
        self.assertGreater(len(explanation.evidence_trail), 0)
        self.assertTrue(explanation.is_traceable)
        self.assertIn("Vikram Sharma", explanation.investigative_briefing)
        print(f"[PASS] Explainable AI (XAI) Test Passed: Generated evidence-traceable explanation for {explanation.node_label} (Confidence: {explanation.confidence_score}%, Risk Drivers: {len(explanation.risk_drivers)})")

    def test_cross_case_linker(self):
        from app.services.cross_case_linker import cross_case_linker
        matches = cross_case_linker.find_cross_case_matches()
        self.assertGreater(len(matches), 0, "Should discover cross-case matches")
        
        # Check exact matches
        exact_matches = [m for m in matches if m.match_type == "CONFIRMED_EXACT"]
        self.assertGreater(len(exact_matches), 0, "Should discover confirmed exact matches")
        
        # Check fuzzy matches
        fuzzy_matches = [m for m in matches if m.match_type == "POSSIBLE_FUZZY"]
        self.assertGreater(len(fuzzy_matches), 0, "Should discover fuzzy matches")
        
        # Check network overlap fusion
        overlap = cross_case_linker.get_case_network_overlap("CASE-HAWALA-2024", "CASE-NARCO-2024")
        self.assertGreater(overlap.overlap_count, 0)
        self.assertGreater(len(overlap.merged_graph.nodes), len(overlap.shared_nodes))
        
        # Check inter-state alerts
        alerts = cross_case_linker.generate_inter_state_alerts()
        self.assertGreater(len(alerts), 0)
        
        print(f"[PASS] Cross-Case Intelligence Linker Test Passed: Discovered {len(exact_matches)} confirmed exact links, {len(fuzzy_matches)} fuzzy links, and generated {len(alerts)} inter-state alerts.")

    def test_blockchain_ledger_and_l2_anchoring(self):
        from app.services.blockchain_ledger import blockchain_ledger
        
        # 1. Test adding a block
        block = blockchain_ledger.add_block(
            action_type="INTERCEPT_TEST",
            entity_id="PER_VIKRAM_SHARMA",
            data_snapshot={"wiretap_duration": 450, "keyword": "hawala transfer"},
            investigator_id="USR-INV-001",
            investigator_name="Inspector Rajesh Mehra",
            case_id="CASE-HAWALA-2024"
        )
        self.assertIn("current_block_hash", block)
        self.assertIn("data_snapshot_hash", block)
        self.assertEqual(len(block["current_block_hash"]), 64)
        
        # 2. Test chain integrity verification
        report = blockchain_ledger.verify_chain_integrity()
        self.assertTrue(report.is_valid)
        self.assertIsNone(report.tampered_block_id)
        
        # 3. Test tamper attack simulation
        tamper_res = blockchain_ledger.simulate_database_tamper(1, {"corrupted_evidence": "deleted illegally"})
        self.assertEqual(tamper_res["status"], "TAMPER_INJECTED")
        
        tampered_report = blockchain_ledger.verify_chain_integrity()
        self.assertFalse(tampered_report.is_valid)
        self.assertEqual(tampered_report.tampered_block_id, 1)
        
        # 4. Test ledger restore
        restore_res = blockchain_ledger.restore_ledger()
        self.assertEqual(restore_res["status"], "RESTORED")
        restored_report = blockchain_ledger.verify_chain_integrity()
        self.assertTrue(restored_report.is_valid)
        
        # 5. Test Layer-2 Polygon checkpoint anchoring
        l2 = blockchain_ledger.anchor_checkpoint_to_l2()
        self.assertEqual(l2.status, "CONFIRMED_ON_CHAIN")
        self.assertTrue(l2.tx_hash.startswith("0x"))
        
        print(f"[PASS] Blockchain Ledger & Layer-2 Checkpoint Test Passed: Verified {report.total_blocks_checked} blocks, caught tampering at Block #1, restored consensus, and anchored Merkle root ({l2.merkle_root[:12]}...) to Polygon L2.")

    def test_investigation_timeline_scrubber(self):
        timeline = graph_engine.get_timeline_data(case_id="CASE-HAWALA-2024")
        self.assertEqual(timeline.case_id, "CASE-HAWALA-2024")
        self.assertGreater(timeline.total_nodes, 0)
        self.assertGreater(timeline.total_edges, 0)
        self.assertGreater(len(timeline.milestones), 0)
        self.assertGreater(len(timeline.steps), 0)
        # Verify chronological order
        dates = [s.date for s in timeline.steps]
        self.assertEqual(dates, sorted(dates), "Timeline steps must be strictly sorted chronologically")
        # Verify key milestones presence
        milestone_titles = [m.title for m in timeline.milestones]
        self.assertTrue(any("Vikram Sharma" in m for m in milestone_titles), "Vikram Sharma kingpin unmasking milestone must exist")
        print(f"[PASS] Investigation Timeline Test Passed: {timeline.total_nodes} nodes, {timeline.total_edges} edges, {len(timeline.milestones)} dramatic milestones across {timeline.start_date[:10]} to {timeline.end_date[:10]}")

    def test_case_handover_briefing(self):
        from app.services.handover_service import handover_service
        briefing = handover_service.generate_handover("CASE-HAWALA-2024", incoming_officer="Inspector Amit Deshmukh")
        self.assertEqual(briefing.case_id, "CASE-HAWALA-2024")
        self.assertIn("402/2024", briefing.fir_number)
        self.assertEqual(briefing.incoming_investigator, "Inspector Amit Deshmukh")
        self.assertGreater(len(briefing.top_targets), 0)
        self.assertGreater(len(briefing.open_leads), 0)
        self.assertTrue(briefing.is_chain_verified)
        self.assertIsNotNone(briefing.html_dossier)
        self.assertIn("CASE HANDOVER", briefing.html_dossier)
        print(f"[PASS] Case Handover Briefing Test Passed: Compiled {len(briefing.top_targets)} top targets, {len(briefing.open_leads)} actionable leads, {len(briefing.cross_case_alerts)} cross-case alerts, and generated {len(briefing.html_dossier)} bytes official dossier.")

    def test_serial_mo_pattern_detector(self):
        from app.services.mo_service import serial_pattern_detector
        profile = serial_pattern_detector.aggregate_person_mo("PER_KULDEEP_YADAV")
        self.assertEqual(profile.person_id, "PER_KULDEEP_YADAV")
        self.assertGreater(len(profile.mo_tags), 0)
        self.assertGreater(len(profile.potential_related_cases), 0)
        # Should link to Manesar Carjacking cold case with high match score
        top_match = profile.potential_related_cases[0]
        self.assertIn("CASE-COLD-CARJACK-2024", top_match.case_id)
        self.assertGreaterEqual(top_match.match_score, 80)
        self.assertGreater(len(top_match.matched_attributes), 0)

        # Test global MO clusters
        clusters = serial_pattern_detector.get_mo_clusters()
        self.assertGreaterEqual(len(clusters), 4)
        print(f"[PASS] Serial MO Pattern Detector Test Passed: Profile for {profile.person_label} matched {len(profile.potential_related_cases)} cold cases (Top match: {top_match.fir_number} @ {top_match.match_score}%). Generated {len(clusters)} behavioral clusters.")

if __name__ == "__main__":
    unittest.main()

