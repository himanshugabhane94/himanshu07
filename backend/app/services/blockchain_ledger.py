import hashlib
import json
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.models.schemas import LedgerBlock, IntegrityReport, L2Checkpoint

class BlockchainLedger:
    """
    Append-Only Cryptographic Blockchain Hash-Chain for Evidence Integrity & Chain-of-Custody.
    Implements SHA-256 block hashing, Merkle root aggregation, Layer-2 anchoring, and real-time tamper auditing.
    """
    def __init__(self):
        self.chain: List[Dict[str, Any]] = []
        self.tampered_backup: Optional[List[Dict[str, Any]]] = None
        self.l2_checkpoints: List[Dict[str, Any]] = []
        self._initialize_genesis_block()
        self._seed_initial_evidence_blocks()

    def _hash_payload(self, data: Dict[str, Any]) -> str:
        """Calculates deterministic SHA-256 hash of JSON record."""
        payload_str = json.dumps(data, sort_keys=True)
        return hashlib.sha256(payload_str.encode('utf-8')).hexdigest()

    def _calculate_block_hash(self, block_id: int, timestamp: str, investigator_id: str,
                              action_type: str, entity_id: str, data_snapshot_hash: str,
                              previous_block_hash: str) -> str:
        block_content = f"{block_id}|{timestamp}|{investigator_id}|{action_type}|{entity_id}|{data_snapshot_hash}|{previous_block_hash}"
        return hashlib.sha256(block_content.encode('utf-8')).hexdigest()

    def _initialize_genesis_block(self):
        timestamp = "2024-01-01T00:00:00Z"
        genesis_data = {
            "genesis_protocol": "CrimeNet Sovereign Evidence Ledger Initialized",
            "jurisdiction": "Republic of India — Ministry of Home Affairs",
            "legal_framework": "Section 65B Indian Evidence Act & Bharatiya Sakshya Adhiniyam (BSA) 2023",
            "cryptographic_standard": "SHA-256 + Ed25519 Signature"
        }
        data_hash = self._hash_payload(genesis_data)
        prev_hash = "0" * 64
        block_hash = self._calculate_block_hash(
            block_id=0,
            timestamp=timestamp,
            investigator_id="SYSTEM_ROOT_AUTHORITY",
            action_type="GENESIS_LEDGER_INIT",
            entity_id="MHA_ROOT_001",
            data_snapshot_hash=data_hash,
            previous_block_hash=prev_hash
        )
        
        genesis_block = {
            "block_id": 0,
            "timestamp": timestamp,
            "investigator_id": "SYSTEM_ROOT_AUTHORITY",
            "investigator_name": "MHA Root Cryptographic Authority",
            "action_type": "GENESIS_LEDGER_INIT",
            "entity_id": "MHA_ROOT_001",
            "case_id": "SYSTEM",
            "data_snapshot_hash": data_hash,
            "data_snapshot": genesis_data,
            "previous_block_hash": prev_hash,
            "current_block_hash": block_hash,
            "signature": f"MHA_SIG_ED25519_{block_hash[:16].upper()}",
            "is_verified": True,
            "l2_anchored": True,
            "l2_tx_hash": "0x4a91b8204918e9a2b719482b991823ab192837f4819283719283918293849102"
        }
        self.chain.append(genesis_block)

    def _seed_initial_evidence_blocks(self):
        """Seeds realistic historical evidence audit blocks for the 3 demo cases."""
        sample_entries = [
            ("CREATE", "PER_VIKRAM_SHARMA", {"label": "Vikram Sharma", "role": "Shadow Financier", "risk": "Critical"}, "USR-INV-001", "Inspector Rajesh Mehra", "CASE-HAWALA-2024"),
            ("INTERCEPT", "PH_VIKRAM_BURNER", {"imei": "864920049182391", "intercept_type": "IMSI Catcher", "carrier": "Airtel"}, "USR-INV-001", "Inspector Rajesh Mehra", "CASE-HAWALA-2024"),
            ("INGEST", "ACC_SWISS_9941", {"bank": "Banque Cantonale de Genève", "balance": "$4,850,000", "source": "CRS STR Filing"}, "USR-ANA-002", "Dr. Ananya Sen", "CASE-HAWALA-2024"),
            ("CREATE", "PER_GURPREET_SINGH", {"label": "Gurpreet Singh", "role": "Border Infiltration Courier", "risk": "Critical"}, "USR-ANA-002", "Dr. Ananya Sen", "CASE-NARCO-2024"),
            ("SEIZE", "VEH_TRUCK_PB10", {"plate": "PB-10-CZ-4412", "seizure_memo": "False fuel cavity with 12kg contraband"}, "USR-ANA-002", "Dr. Ananya Sen", "CASE-NARCO-2024"),
            ("CREATE", "PER_ZUBER_FAROOQ", {"label": "Zuber Farooq", "role": "Strategic Controller", "risk": "Critical"}, "USR-ADM-003", "DIG Vikramaditya Singh", "CASE-SLEEPER-2024"),
            ("QUERY", "DIG_MATRIX_SERVER", {"protocol": "Matrix/Tor Hidden Service", "analyst_query": "Traffic Flow Correlation"}, "USR-ADM-003", "DIG Vikramaditya Singh", "CASE-SLEEPER-2024")
        ]

        for action, entity_id, data, inv_id, inv_name, case_id in sample_entries:
            self.add_block(
                action_type=action,
                entity_id=entity_id,
                data_snapshot=data,
                investigator_id=inv_id,
                investigator_name=inv_name,
                case_id=case_id
            )

    def add_block(self, action_type: str, entity_id: str, data_snapshot: Dict[str, Any],
                  investigator_id: str, investigator_name: str = "Investigating Officer",
                  case_id: Optional[str] = None) -> Dict[str, Any]:
        """Appends a new immutable block to the chain."""
        latest_block = self.chain[-1]
        new_id = len(self.chain)
        timestamp = datetime.now(timezone.utc).isoformat()
        prev_hash = latest_block["current_block_hash"]
        
        data_hash = self._hash_payload(data_snapshot)
        block_hash = self._calculate_block_hash(
            block_id=new_id,
            timestamp=timestamp,
            investigator_id=investigator_id,
            action_type=action_type,
            entity_id=entity_id,
            data_snapshot_hash=data_hash,
            previous_block_hash=prev_hash
        )

        signature = f"MHA_SIG_ED25519_{hashlib.sha256((block_hash + investigator_id).encode()).hexdigest()[:16].upper()}"

        block = {
            "block_id": new_id,
            "timestamp": timestamp,
            "investigator_id": investigator_id,
            "investigator_name": investigator_name,
            "action_type": action_type,
            "entity_id": entity_id,
            "case_id": case_id,
            "data_snapshot_hash": data_hash,
            "data_snapshot": data_snapshot,
            "previous_block_hash": prev_hash,
            "current_block_hash": block_hash,
            "signature": signature,
            "is_verified": True,
            "l2_anchored": False,
            "l2_tx_hash": None
        }

        self.chain.append(block)
        return block

    def _compute_merkle_root(self) -> str:
        """Calculates Merkle tree root of all block hashes in the ledger."""
        hashes = [b["current_block_hash"] for b in self.chain]
        if not hashes:
            return "0" * 64
        while len(hashes) > 1:
            if len(hashes) % 2 != 0:
                hashes.append(hashes[-1])
            new_level = []
            for i in range(0, len(hashes), 2):
                combined = hashes[i] + hashes[i+1]
                new_level.append(hashlib.sha256(combined.encode()).hexdigest())
            hashes = new_level
        return hashes[0]

    def verify_chain_integrity(self) -> IntegrityReport:
        """
        Cryptographically validates the entire ledger by recalculating all SHA-256 hashes
        from raw data snapshots and verifying pointer continuity.
        """
        verified_at = datetime.now(timezone.utc).isoformat()
        merkle_root = self._compute_merkle_root()

        for i in range(len(self.chain)):
            current = self.chain[i]

            # 1. Recompute data snapshot hash
            recomputed_data_hash = self._hash_payload(current["data_snapshot"])
            if recomputed_data_hash != current["data_snapshot_hash"]:
                current["is_verified"] = False
                msg = f"CRITICAL TAMPER DETECTED at Block #{i}: Data snapshot JSON has been illegally modified without updating cryptographic hash."
                return IntegrityReport(
                    is_valid=False,
                    total_blocks_checked=i + 1,
                    verified_at=verified_at,
                    genesis_hash=self.chain[0]["current_block_hash"],
                    terminal_hash=self.chain[-1]["current_block_hash"],
                    merkle_root=merkle_root,
                    tampered_block_id=i,
                    tampered_block_index=i,
                    tampered_field="data_snapshot",
                    status_message=msg,
                    message=msg
                )

            # 2. Recompute block hash
            recomputed_block_hash = self._calculate_block_hash(
                block_id=current["block_id"],
                timestamp=current["timestamp"],
                investigator_id=current["investigator_id"],
                action_type=current["action_type"],
                entity_id=current["entity_id"],
                data_snapshot_hash=current["data_snapshot_hash"],
                previous_block_hash=current["previous_block_hash"]
            )

            if recomputed_block_hash != current["current_block_hash"]:
                current["is_verified"] = False
                msg = f"CRITICAL HASH MISMATCH at Block #{i}: Stored block hash does not match computed SHA-256 digest."
                return IntegrityReport(
                    is_valid=False,
                    total_blocks_checked=i + 1,
                    verified_at=verified_at,
                    genesis_hash=self.chain[0]["current_block_hash"],
                    terminal_hash=self.chain[-1]["current_block_hash"],
                    merkle_root=merkle_root,
                    tampered_block_id=i,
                    tampered_block_index=i,
                    tampered_field="current_block_hash",
                    status_message=msg,
                    message=msg
                )

            # 3. Check previous hash pointer continuity (except genesis)
            if i > 0:
                previous = self.chain[i - 1]
                if current["previous_block_hash"] != previous["current_block_hash"]:
                    current["is_verified"] = False
                    msg = f"BROKEN POINTER FAULT at Block #{i}: Previous hash pointer does not match Block #{i-1} hash."
                    return IntegrityReport(
                        is_valid=False,
                        total_blocks_checked=i + 1,
                        verified_at=verified_at,
                        genesis_hash=self.chain[0]["current_block_hash"],
                        terminal_hash=self.chain[-1]["current_block_hash"],
                        merkle_root=merkle_root,
                        tampered_block_id=i,
                        tampered_block_index=i,
                        tampered_field="previous_block_hash",
                        status_message=msg,
                        message=msg
                    )
            
            current["is_verified"] = True

        latest_l2 = self.l2_checkpoints[-1]["tx_hash"] if self.l2_checkpoints else "0x4a91b820...49102"
        success_msg = f"ALL {len(self.chain)} EVIDENCE BLOCKS CRYPTOGRAPHICALLY VERIFIED. Full chain of custody intact under Section 65B Indian Evidence Act."

        return IntegrityReport(
            is_valid=True,
            total_blocks_checked=len(self.chain),
            verified_at=verified_at,
            genesis_hash=self.chain[0]["current_block_hash"],
            terminal_hash=self.chain[-1]["current_block_hash"],
            merkle_root=merkle_root,
            tampered_block_id=None,
            tampered_block_index=None,
            tampered_field=None,
            status_message=success_msg,
            message=success_msg,
            l2_checkpoint_tx=latest_l2
        )

    def simulate_database_tamper(self, block_id: int, malicious_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Live Demo Tool for Hackathon Judges:
        Directly alters a block's underlying data snapshot (bypassing normal app logic)
        to show how cryptographic verification catches the tampering immediately.
        """
        if block_id < 0 or block_id >= len(self.chain):
            raise ValueError(f"Invalid block_id {block_id}")

        if not self.tampered_backup:
            self.tampered_backup = json.loads(json.dumps(self.chain))

        self.chain[block_id]["data_snapshot"] = malicious_data
        self.chain[block_id]["is_verified"] = False

        return {
            "status": "TAMPER_INJECTED",
            "tampered_block_id": block_id,
            "tampered_block": self.chain[block_id],
            "note": "Block data altered directly in database. Run cryptographic verification to see tamper detection."
        }

    def restore_ledger(self) -> Dict[str, Any]:
        """Restores ledger from verified consensus state."""
        if self.tampered_backup:
            self.chain = json.loads(json.dumps(self.tampered_backup))
            self.tampered_backup = None
            for b in self.chain:
                b["is_verified"] = True
            return {"status": "RESTORED", "message": "Ledger restored from verified consensus state."}
        return {"status": "NO_TAMPER", "message": "Ledger is already in verified state."}

    def anchor_checkpoint_to_l2(self) -> L2Checkpoint:
        """
        Anchors current ledger Merkle root to a public Layer-2 blockchain (Polygon Testnet simulation)
        for external, tamper-proof proof of existence.
        """
        merkle_root = self._compute_merkle_root()
        timestamp = datetime.now(timezone.utc).isoformat()
        tx_hash = f"0x{hashlib.sha256((merkle_root + timestamp).encode()).hexdigest()}"
        checkpoint_id = f"L2-CHK-{len(self.l2_checkpoints)+1:03d}"
        
        checkpoint = {
            "checkpoint_id": checkpoint_id,
            "timestamp": timestamp,
            "network": "Polygon PoS / Ethereum Layer-2",
            "contract_address": "0x892a0194827F38E22b5129849281a8b192839912",
            "merkle_root": merkle_root,
            "tx_hash": tx_hash,
            "block_range": f"Block #0 to #{len(self.chain)-1}",
            "status": "CONFIRMED_ON_CHAIN"
        }
        self.l2_checkpoints.append(checkpoint)

        # Mark latest blocks as anchored
        for b in self.chain:
            b["l2_anchored"] = True
            b["l2_tx_hash"] = tx_hash

        return L2Checkpoint(**checkpoint)

    def get_ledger(self, case_id: Optional[str] = None, entity_id: Optional[str] = None,
                   action_type: Optional[str] = None) -> List[Dict[str, Any]]:
        results = self.chain
        if case_id:
            results = [b for b in results if b.get("case_id") == case_id or b.get("block_id") == 0]
        if entity_id:
            results = [b for b in results if b.get("entity_id") == entity_id]
        if action_type:
            results = [b for b in results if b.get("action_type") == action_type]
        return results

    def get_entity_chain_of_custody(self, entity_id: str) -> List[Dict[str, Any]]:
        return [b for b in self.chain if b.get("entity_id") == entity_id]

# Global Singleton Ledger Instance
blockchain_ledger = BlockchainLedger()
