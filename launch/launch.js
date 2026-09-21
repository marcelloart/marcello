(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const CHAIN = {
    chainId: "0xb626",
    chainName: "Robinhood Chain Testnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://rpc.testnet.chain.robinhood.com"],
    blockExplorerUrls: ["https://explorer.testnet.chain.robinhood.com"]
  };
  const TESTNET_CHAIN_ID = 46630;
  const TOKEN_ABI = ["constructor(string n, string s, uint256 supply, address owner)"];
  const TOKEN_BYTECODE = "0x608060405234801561000f575f5ffd5b5060405161098238038061098283398101604081905261002e9161013e565b5f610039858261024f565b506001610046848261024f565b5060028290556001600160a01b0381165f818152600360209081526040808320869055518581527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a350505050610309565b634e487b7160e01b5f52604160045260245ffd5b5f82601f8301126100c4575f5ffd5b81516001600160401b038111156100dd576100dd6100a1565b604051601f8201601f19908116603f011681016001600160401b038111828210171561010b5761010b6100a1565b604052818152838201602001851015610122575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f5f60808587031215610151575f5ffd5b84516001600160401b03811115610166575f5ffd5b610172878288016100b5565b602087015190955090506001600160401b0381111561018f575f5ffd5b61019b878288016100b5565b60408701516060880151919550935090506001600160a01b03811681146101c0575f5ffd5b939692955090935050565b600181811c908216806101df57607f821691505b6020821081036101fd57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561024a57805f5260205f20601f840160051c810160208510156102285750805b601f840160051c820191505b81811015610247575f8155600101610234565b50505b505050565b81516001600160401b03811115610268576102686100a1565b61027c8161027684546101cb565b84610203565b6020601f8211600181146102ae575f83156102975750848201515b5f19600385901b1c1916600184901b178455610247565b5f84815260208120601f198516915b828110156102dd57878501518255602094850194600190920191016102bd565b50848210156102fa57868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b61066c806103165f395ff3fe608060405234801561000f575f5ffd5b5060043610610090575f3560e01c8063313ce56711610063578063313ce567146100ff57806370a082311461011957806395d89b4114610138578063a9059cbb14610140578063dd62ed3e14610153575f5ffd5b806306fdde0314610094578063095ea7b3146100b257806318160ddd146100d557806323b872dd146100ec575b5f5ffd5b61009c61017d565b6040516100a991906104c1565b60405180910390f35b6100c56100c0366004610511565b610208565b60405190151581526020016100a9565b6100de60025481565b6040519081526020016100a9565b6100c56100fa366004610539565b610274565b610107601281565b60405160ff90911681526020016100a9565b6100de610127366004610573565b60036020525f908152604090205481565b61009c6103f6565b6100c561014e366004610511565b610403565b6100de610161366004610593565b600460209081525f928352604080842090915290825290205481565b5f8054610189906105c4565b80601f01602080910402602001604051908101604052809291908181526020018280546101b5906105c4565b80156102005780601f106101d757610100808354040283529160200191610200565b820191905f5260205f20905b8154815290600101906020018083116101e357829003601f168201915b505050505081565b335f8181526004602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906102629086815260200190565b60405180910390a35060015b92915050565b6001600160a01b0383165f908152600360205260408120548211156102ca5760405162461bcd60e51b815260206004820152600760248201526662616c616e636560c81b60448201526064015b60405180910390fd5b6001600160a01b0384165f908152600460209081526040808320338452909152902054828110156103295760405162461bcd60e51b8152602060048201526009602482015268616c6c6f77616e636560b81b60448201526064016102c1565b5f19811461035f5761033b8382610610565b6001600160a01b0386165f9081526004602090815260408083203384529091529020555b6001600160a01b038086165f908152600360205260408082208054879003905591861681529081208054859290610397908490610623565b92505081905550836001600160a01b0316856001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040516103e391815260200190565b60405180910390a3506001949350505050565b60018054610189906105c4565b335f9081526003602052604081205482111561044b5760405162461bcd60e51b815260206004820152600760248201526662616c616e636560c81b60448201526064016102c1565b335f90815260036020526040808220805485900390556001600160a01b03851682528120805484929061047f908490610623565b90915550506040518281526001600160a01b0384169033907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610262565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b038116811461050c575f5ffd5b919050565b5f5f60408385031215610522575f5ffd5b61052b836104f6565b946020939093013593505050565b5f5f5f6060848603121561054b575f5ffd5b610554846104f6565b9250610562602085016104f6565b929592945050506040919091013590565b5f60208284031215610583575f5ffd5b61058c826104f6565b9392505050565b5f5f604083850312156105a4575f5ffd5b6105ad836104f6565b91506105bb602084016104f6565b90509250929050565b600181811c908216806105d857607f821691505b6020821081036105f657634e487b7160e01b5f52602260045260245ffd5b50919050565b634e487b7160e01b5f52601160045260245ffd5b8181038181111561026e5761026e6105fc565b8082018082111561026e5761026e6105fc56fea26469706673582212205dbd4901341a9d4df25797ef8c16a6777733ae9897f63f0e3cbfc3370e542c6064736f6c634300081e0033";

  let account = null;
  let activeProvider = null;
  let activeWalletName = "";
  let activeChainId = null;
  const announced = new Map();

  const normalizeChainId = (chainId) => String(chainId || "").toLowerCase();
  const isTestnet = () => normalizeChainId(activeChainId) === CHAIN.chainId;

  function setDeployState(enabled, label) {
    const button = $("deployToken");
    button.disabled = !enabled;
    button.textContent = label;
  }

  function renderWalletState() {
    const state = $("walletState");
    const network = $("walletNetwork");
    const connected = Boolean(account && activeProvider);

    if (!connected) {
      state.textContent = "Not connected";
      state.classList.remove("is-ok");
      network.textContent = "Robinhood Chain Testnet";
      setDeployState(false, "Connect wallet first");
      return;
    }

    if (isTestnet()) {
      state.textContent = `${activeWalletName || "Wallet"} Connected`;
      state.classList.add("is-ok");
      network.textContent = "Robinhood Chain Testnet";
      setDeployState(true, "Deploy Token on Testnet →");
    } else {
      state.textContent = "Switch to Testnet";
      state.classList.remove("is-ok");
      network.textContent = "Wrong network · switch required";
      setDeployState(false, "Switch to Robinhood Testnet");
    }
  }

  function resetWalletState() {
    if (activeProvider) unbindProvider(activeProvider);
    account = null;
    activeProvider = null;
    activeWalletName = "";
    activeChainId = null;
    $("walletPicker").hidden = true;
    $("walletInfo").hidden = true;
    $("walletAddress").textContent = "";
    $("connectWallet").textContent = "Connect Wallet";
    $("disconnectWallet").hidden = true;
    $("launchProgress").hidden = true;
    renderWalletState();
  }

  function bindProvider(provider) {
    if (typeof provider.on !== "function") return;
    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);
  }

  function unbindProvider(provider) {
    if (typeof provider.removeListener !== "function") return;
    try {
      provider.removeListener("accountsChanged", handleAccountsChanged);
      provider.removeListener("chainChanged", handleChainChanged);
    } catch (error) {
      console.debug("Wallet listener cleanup skipped", error);
    }
  }

  function handleAccountsChanged(accounts) {
    if (!activeProvider) return;
    if (!accounts || !accounts[0]) {
      resetWalletState();
      return;
    }
    account = accounts[0];
    $("walletAddress").textContent = account;
    $("walletInfo").hidden = false;
    renderWalletState();
  }

  function handleChainChanged(chainId) {
    activeChainId = normalizeChainId(chainId);
    renderWalletState();
  }

  function renderWallets() {
    const box = $("detectedWallets");
    if (!box) return;
    const list = Array.from(announced.values());
    if (!list.length) {
      box.innerHTML = '<div class="wallet-detecting">Belum ada wallet EIP-6963 terdeteksi. Pastikan extension aktif, lalu klik Scan ulang wallet.</div>';
      return;
    }

    box.innerHTML = "";
    list.forEach((detail) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "wallet-option";

      const image = document.createElement("img");
      image.className = "wallet-icon";
      image.src = detail.info.icon;
      image.alt = "";
      image.onerror = () => image.removeAttribute("src");

      const text = document.createElement("span");
      const name = document.createElement("b");
      name.textContent = detail.info.name;
      const sub = document.createElement("small");
      sub.textContent = detail.info.rdns || "EIP-6963 wallet";
      text.append(name, sub);
      button.append(image, text);
      button.addEventListener("click", () => connectDetail(detail));
      box.appendChild(button);
    });
  }

  function onAnnounce(event) {
    const detail = event.detail;
    if (!detail || !detail.provider || !detail.info) return;
    announced.set(detail.info.uuid || detail.info.rdns || detail.info.name, detail);
    renderWallets();
  }

  function scanWallets() {
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    window.setTimeout(renderWallets, 300);
  }

  async function ensureNetwork(provider = activeProvider) {
    if (!provider) throw new Error("Wallet belum terhubung.");
    try {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN.chainId }] });
    } catch (error) {
      const code = Number(error && error.code);
      if (code === 4902 || code === -32603) {
        await provider.request({ method: "wallet_addEthereumChain", params: [CHAIN] });
      } else {
        throw error;
      }
    }
    activeChainId = normalizeChainId(await provider.request({ method: "eth_chainId" }));
    renderWalletState();
  }

  async function connectDetail(detail) {
    try {
      if (activeProvider && activeProvider !== detail.provider) unbindProvider(activeProvider);
      const provider = detail.provider;
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      if (!accounts || !accounts[0]) throw new Error("Tidak ada akun yang dipilih.");

      activeProvider = provider;
      activeWalletName = detail.info.name || "Wallet";
      account = accounts[0];
      bindProvider(provider);
      await ensureNetwork(provider);

      $("walletPicker").hidden = true;
      $("walletInfo").hidden = false;
      $("walletAddress").textContent = account;
      $("connectWallet").textContent = `${activeWalletName} Connected`;
      $("disconnectWallet").hidden = false;
      renderWalletState();
    } catch (error) {
      alert(getErrorMessage(error, "Wallet connection failed"));
    }
  }

  function getErrorMessage(error, fallback) {
    let message = (error && error.error && error.error.message) || (error && error.shortMessage) || (error && error.reason) || (error && error.message) || fallback;
    if (error && (error.code === "ACTION_REJECTED" || error.code === 4001)) message = "Permintaan dibatalkan di wallet.";
    return String(message).replace(/^Error:\s*/i, "").trim();
  }

  async function waitForReceipt(provider, txHash) {
    const started = Date.now();
    while (Date.now() - started < 180000) {
      const receipt = await provider.request({ method: "eth_getTransactionReceipt", params: [txHash] });
      if (receipt) return receipt;
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
    }
    throw new Error("Transaksi belum terkonfirmasi setelah 3 menit. Periksa hash transaksi di explorer.");
  }

  async function copyContractAddress() {
    const address = $("contractAddress").textContent;
    try {
      await navigator.clipboard.writeText(address);
      $("copyAddress").textContent = "Copied ✓";
      window.setTimeout(() => { $("copyAddress").textContent = "Copy Address"; }, 1600);
    } catch (error) {
      alert("Alamat contract: " + address);
    }
  }

  async function deployToken(event) {
    event.preventDefault();
    if (!account || !activeProvider) return;

    const name = $("tokenName").value.trim();
    const symbol = $("tokenSymbol").value.trim().toUpperCase();
    const rawSupply = $("tokenSupply").value.trim();
    if (!name || !symbol || !/^\d+$/.test(rawSupply) || BigInt(rawSupply) < 1n) {
      alert("Periksa kembali nama, ticker, dan total supply token.");
      return;
    }

    try {
      await ensureNetwork();
      if (!isTestnet()) throw new Error(`Wallet belum berada di Robinhood Chain Testnet (Chain ID ${TESTNET_CHAIN_ID}).`);

      const accounts = await activeProvider.request({ method: "eth_accounts" });
      if (accounts && accounts[0] && accounts[0].toLowerCase() !== account.toLowerCase()) {
        account = accounts[0];
        $("walletAddress").textContent = account;
      }

      const balanceHex = await activeProvider.request({ method: "eth_getBalance", params: [account, "latest"] });
      if (BigInt(balanceHex) === 0n) throw new Error("Wallet tidak memiliki ETH Robinhood Testnet untuk membayar gas deployment.");
      if (typeof ethers === "undefined") throw new Error("Library transaksi belum termuat. Muat ulang halaman lalu coba lagi.");

      const supply = ethers.parseUnits(rawSupply, 18);
      const iface = new ethers.Interface(TOKEN_ABI);
      const constructorData = iface.encodeDeploy([name, symbol, supply, account]);
      const deployData = TOKEN_BYTECODE + constructorData.slice(2);

      $("launchProgress").hidden = false;
      $("launchSuccess").hidden = true;
      $("progressTitle").textContent = "Preparing fixed-supply ERC-20…";
      $("progressText").textContent = "Kontrak siap. Periksa estimasi gas dan konfirmasi transaksi di wallet.";

      let gas;
      try {
        gas = await activeProvider.request({ method: "eth_estimateGas", params: [{ from: account, data: deployData }] });
      } catch (error) {
        console.warn("Gas estimate failed; wallet will estimate again", error);
      }

      const transaction = { from: account, data: deployData };
      if (gas) transaction.gas = gas;
      const txHash = await activeProvider.request({ method: "eth_sendTransaction", params: [transaction] });
      $("progressTitle").textContent = "Waiting for confirmation…";
      $("progressText").textContent = "Transaction: " + txHash;

      const receipt = await waitForReceipt(activeProvider, txHash);
      const receiptStatus = String(receipt.status || "").toLowerCase();
      if (receiptStatus && receiptStatus !== "0x1" && receiptStatus !== "1") throw new Error("Deployment transaction gagal dikonfirmasi.");
      if (!receipt.contractAddress) throw new Error("Transaksi berhasil, tetapi alamat contract belum dikembalikan oleh wallet. Buka explorer untuk memeriksa hash transaksi.");

      $("launchProgress").hidden = true;
      $("launchSuccess").hidden = false;
      $("contractAddress").textContent = receipt.contractAddress;
      $("explorerLink").href = CHAIN.blockExplorerUrls[0] + "/address/" + receipt.contractAddress;
      $("copyAddress").onclick = copyContractAddress;
      $("launchSuccess").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      $("launchProgress").hidden = true;
      console.error("Deploy error:", error);
      let message = getErrorMessage(error, "Deployment failed");
      if (/insufficient funds/i.test(message)) message = "ETH Robinhood Testnet tidak cukup untuk gas deployment.";
      alert(message);
    }
  }

  window.addEventListener("eip6963:announceProvider", onAnnounce);
  $("connectWallet").addEventListener("click", () => {
    $("walletPicker").hidden = false;
    scanWallets();
  });
  $("closeWalletPicker").addEventListener("click", () => { $("walletPicker").hidden = true; });
  $("refreshWallets").addEventListener("click", scanWallets);
  $("getWalletBtn").addEventListener("click", () => window.open("https://ethereum.org/en/wallets/", "_blank", "noopener"));
  $("disconnectWallet").addEventListener("click", resetWalletState);
  $("tokenForm").addEventListener("submit", deployToken);
  renderWalletState();
  scanWallets();
})();
