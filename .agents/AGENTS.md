# TxODDS API V3 Integration Rule
When interacting with the TxODDS API and on-chain validation for this project, always use the V3 implementation.

**Key V3 Details:**
- **API Endpoint:** `/api/scores/stat-validation-v3`
- **On-chain Method:** `validateStatV3`
- **Data Structure:** Uses compressed multiproof data. Payloads require:
  - `statsToProve`
  - `multiproof.indices`
  - `multiproof.hashes`

**Reference Documentation:**
- [On-chain validation guide](https://github.com/txodds/tx-on-chain/blob/main/documentation/examples/onchain-validation.mdx)
- [Devnet examples](https://github.com/txodds/tx-on-chain/blob/main/documentation/examples/devnet-examples.mdx)
- Runnable example scripts are available at `examples/devnet/scripts/subscription_scores_v3c.ts` and `examples/mainnet/scripts/subscription_scores_v3c.ts` in the tx-on-chain repository.

# TxODDS Historical Data & Replay Rule
When building demos or verifying finished fixtures for judging:
- **Do NOT** use `/api/scores/stream` or `Last-Event-ID`. The stream is strictly for live, ongoing matches.
- **Use:** `/api/scores/historical/{fixtureId}` for historical replay. This endpoint returns the sequence of score updates for fixtures whose start time is between 2 weeks and 6 hours ago.
- When doing stat validation for these matches, you must extract and use the real `Seq` / `seq` from the historical records.

# TxLINE Score Validation & Merkle Tree Rules
When formatting data for TxLINE score validation:
- **Leaf Hashing Format:** The leaf is generated using SHA-256 over exactly 12 bytes. The structure must be strictly:
  - `key` [u32 little-endian] (4 bytes)
  - `value` [i32 little-endian] (4 bytes)
  - `period` [i32 little-endian] (4 bytes)
- **Merkle Proof Verification:** Use the `is_right_sibling` boolean to determine hashing order during tree traversal:
  - If `is_right_sibling == true`: Hash `(current || sibling)`
  - If `is_right_sibling == false`: Hash `(sibling || current)`
