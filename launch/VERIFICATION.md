# Contract verification reference

The launcher deploys the fixed-supply contract bytecode embedded in `launch.js`.
After a successful deployment, open the contract in Robinhood Chain Blockscout and
use the verification information copied by the launcher:

- Network: Robinhood Chain Mainnet, chain ID `4663`
- Compiler: Solidity `0.8.30`
- Contract: `MarcelloFixedERC20`
- Constructor arguments: copied from the exact deployment
- Reference source: `contracts/MarcelloFixedERC20.sol`

Before submitting verification, compare the compiled creation bytecode from this
source with `TOKEN_BYTECODE` in `launch.js`. The compiler version, optimizer mode,
EVM version, source path, and constructor arguments must match the deployment.
Never publish a private key or Pinata JWT in this repository.
