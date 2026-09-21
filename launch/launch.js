(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const NETWORKS = {
    mainnet: {
      mode: "mainnet",
      label: "Robinhood Chain",
      badge: "ROBINHOOD MAINNET",
      chainId: "0x1237",
      chainIdNumber: 4663,
      chain: {
        chainId: "0x1237",
        chainName: "Robinhood Chain",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://rpc.mainnet.chain.robinhood.com"],
        blockExplorerUrls: ["https://robinhoodchain.blockscout.com"]
      },
      explorer: "https://robinhoodchain.blockscout.com",
      faucet: ""
    },
    testnet: {
      mode: "testnet",
      label: "Robinhood Chain Testnet",
      badge: "ROBINHOOD TESTNET",
      chainId: "0xb626",
      chainIdNumber: 46630,
      chain: {
        chainId: "0xb626",
        chainName: "Robinhood Chain Testnet",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://rpc.testnet.chain.robinhood.com"],
        blockExplorerUrls: ["https://explorer.testnet.chain.robinhood.com"]
      },
      explorer: "https://explorer.testnet.chain.robinhood.com",
      faucet: "https://faucet.testnet.chain.robinhood.com/add-chain"
    }
  };
  const networkMode = new URLSearchParams(window.location.search).get("network") === "testnet" ? "testnet" : "mainnet";
  const NETWORK = NETWORKS[networkMode];
  const CHAIN = NETWORK.chain;
  const IS_MAINNET = networkMode === "mainnet";
  const TARGET_CHAIN_ID = NETWORK.chainIdNumber;
  const ACCESS_CODE_HASH = "83b74934659cf63aec60e5c1b6a29fe97f22629c85a3b2548d39dddb552fd479";
  const PINATA_FILE_ENDPOINT = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const PINATA_JSON_ENDPOINT = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
  const PENDING_STORAGE_KEY = `ma_launch_pending_${networkMode}`;
  const CONTRACT_SOURCE_URL = "https://github.com/marcelloart/marcello/blob/main/launch/contracts/MarcelloFixedERC20.sol";
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
  const TOKEN_ABI = ["constructor(string n, string s, uint256 supply, address owner)"];
  const TOKEN_BYTECODE = "0x608060405234801561000f575f5ffd5b5060405161098238038061098283398101604081905261002e9161013e565b5f610039858261024f565b506001610046848261024f565b5060028290556001600160a01b0381165f818152600360209081526040808320869055518581527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a350505050610309565b634e487b7160e01b5f52604160045260245ffd5b5f82601f8301126100c4575f5ffd5b81516001600160401b038111156100dd576100dd6100a1565b604051601f8201601f19908116603f011681016001600160401b038111828210171561010b5761010b6100a1565b604052818152838201602001851015610122575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f5f60808587031215610151575f5ffd5b84516001600160401b03811115610166575f5ffd5b610172878288016100b5565b602087015190955090506001600160401b0381111561018f575f5ffd5b61019b878288016100b5565b60408701516060880151919550935090506001600160a01b03811681146101c0575f5ffd5b939692955090935050565b600181811c908216806101df57607f821691505b6020821081036101fd57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561024a57805f5260205f20601f840160051c810160208510156102285750805b601f840160051c820191505b81811015610247575f8155600101610234565b50505b505050565b81516001600160401b03811115610268576102686100a1565b61027c8161027684546101cb565b84610203565b6020601f8211600181146102ae575f83156102975750848201515b5f19600385901b1c1916600184901b178455610247565b5f84815260208120601f198516915b828110156102dd57878501518255602094850194600190920191016102bd565b50848210156102fa57868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b61066c806103165f395ff3fe608060405234801561000f575f5ffd5b5060043610610090575f3560e01c8063313ce56711610063578063313ce567146100ff57806370a082311461011957806395d89b4114610138578063a9059cbb14610140578063dd62ed3e14610153575f5ffd5b806306fdde0314610094578063095ea7b3146100b257806318160ddd146100d557806323b872dd146100ec575b5f5ffd5b61009c61017d565b6040516100a991906104c1565b60405180910390f35b6100c56100c0366004610511565b610208565b60405190151581526020016100a9565b6100de60025481565b6040519081526020016100a9565b6100c56100fa366004610539565b610274565b610107601281565b60405160ff90911681526020016100a9565b6100de610127366004610573565b60036020525f908152604090205481565b61009c6103f6565b6100c561014e366004610511565b610403565b6100de610161366004610593565b600460209081525f928352604080842090915290825290205481565b5f8054610189906105c4565b80601f01602080910402602001604051908101604052809291908181526020018280546101b5906105c4565b80156102005780601f106101d757610100808354040283529160200191610200565b820191905f5260205f20905b8154815290600101906020018083116101e357829003601f168201915b505050505081565b335f8181526004602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906102629086815260200190565b60405180910390a35060015b92915050565b6001600160a01b0383165f908152600360205260408120548211156102ca5760405162461bcd60e51b815260206004820152600760248201526662616c616e636560c81b60448201526064015b60405180910390fd5b6001600160a01b0384165f908152600460209081526040808320338452909152902054828110156103295760405162461bcd60e51b8152602060048201526009602482015268616c6c6f77616e636560b81b60448201526064016102c1565b5f19811461035f5761033b8382610610565b6001600160a01b0386165f9081526004602090815260408083203384529091529020555b6001600160a01b038086165f908152600360205260408082208054879003905591861681529081208054859290610397908490610623565b92505081905550836001600160a01b0316856001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040516103e391815260200190565b60405180910390a3506001949350505050565b60018054610189906105c4565b335f9081526003602052604081205482111561044b5760405162461bcd60e51b815260206004820152600760248201526662616c616e636560c81b60448201526064016102c1565b335f90815260036020526040808220805485900390556001600160a01b03851682528120805484929061047f908490610623565b90915550506040518281526001600160a01b0384169033907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610262565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b038116811461050c575f5ffd5b919050565b5f5f60408385031215610522575f5ffd5b61052b836104f6565b946020939093013593505050565b5f5f5f6060848603121561054b575f5ffd5b610554846104f6565b9250610562602085016104f6565b929592945050506040919091013590565b5f60208284031215610583575f5ffd5b61058c826104f6565b9392505050565b5f5f604083850312156105a4575f5ffd5b6105ad836104f6565b91506105bb602084016104f6565b90509250929050565b600181811c908216806105d857607f821691505b6020821081036105f657634e487b7160e01b5f52602260045260245ffd5b50919050565b634e487b7160e01b5f52601160045260245ffd5b8181038181111561026e5761026e6105fc565b8082018082111561026e5761026e6105fc56fea26469706673582212205dbd4901341a9d4df25797ef8c16a6777733ae9897f63f0e3cbfc3370e542c6064736f6c634300081e0033";

  let account = null;
  let activeProvider = null;
  let activeWalletName = "";
  let activeChainId = null;
  let selectedImageFile = null;
  let selectedImageDataUrl = "";
  let selectedImageName = "";
  let selectedImageUri = "";
  let selectedMetadataUri = "";
  let ephemeralPinataJwt = "";
  let pendingDeployment = null;
  let currentVerificationData = null;
  const announced = new Map();

  const normalizeChainId = (chainId) => String(chainId || "").toLowerCase();
  const isTargetNetwork = () => normalizeChainId(activeChainId) === CHAIN.chainId;

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
  }

  function explorerAddressUrl(address) {
    return `${NETWORK.explorer}/address/${address}`;
  }

  function explorerTransactionUrl(hash) {
    return `${NETWORK.explorer}/tx/${hash}`;
  }

  function applyNetworkCopy() {
    setText("networkBadge", NETWORK.badge);
    setText("networkName", NETWORK.label);
    setText("networkChainId", `Chain ID ${NETWORK.chainIdNumber}`);
    setText("walletNetwork", NETWORK.label);
    setText("walletDescription", `Gunakan browser wallet EVM seperti MetaMask. Network akan diarahkan ke ${NETWORK.label}.`);
    setText("heroDescription", `Buat ERC-20 fixed-supply di ${NETWORK.label}. Website tidak meminta atau menyimpan private key; transaksi ditandatangani langsung melalui wallet Anda.`);
    setText("networkRpcNote", IS_MAINNET ? "Wallet/provider RPC digunakan untuk membaca status dan mengirim transaksi. Untuk traffic produksi tinggi, gunakan RPC provider khusus." : "Testnet ETH hanya untuk QA dan tidak memiliki nilai moneter.");
    setText("deployHelp", `Deployment membutuhkan ETH ${IS_MAINNET ? "mainnet" : "testnet"} untuk gas. Token tidak memiliki fungsi mint tambahan, pajak transaksi, blacklist, atau transfer restriction.`);
    const faucet = $("networkFaucetLink");
    if (faucet) {
      faucet.hidden = !NETWORK.faucet;
      if (NETWORK.faucet) faucet.href = NETWORK.faucet;
    }
    const explorer = $("networkExplorerLink");
    if (explorer) explorer.href = NETWORK.explorer;
    const modeLink = $("networkModeLink");
    if (modeLink) {
      modeLink.href = IS_MAINNET ? "/launch/?network=testnet" : "/launch/";
      modeLink.textContent = IS_MAINNET ? "Testnet QA" : "Mainnet";
    }
    const badge = $("networkBadge");
    if (badge) badge.classList.toggle("launch-mainnet-pill", IS_MAINNET);
    setText("warningTitle", IS_MAINNET ? "Mainnet warning." : "Testnet only.");
    setText("warningText", IS_MAINNET
      ? "Transaksi mainnet memakai ETH nyata dan tidak dapat dibatalkan. Pastikan nama, ticker, supply, gambar, metadata, dan wallet owner sudah benar. Token ini dibuat pihak ketiga dan tidak resmi atau berafiliasi dengan Robinhood."
      : "Token testnet tidak memiliki nilai moneter. Periksa nama, ticker, supply, gambar, dan metadata sebelum menandatangani transaksi karena deployment blockchain tidak dapat dibatalkan.");
  }

  function readStorage(storage, key) {
    try {
      return storage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (error) {
      console.debug("Storage unavailable", error);
    }
  }

  function removeStorage(storage, key) {
    try {
      storage.removeItem(key);
    } catch (error) {
      console.debug("Storage cleanup skipped", error);
    }
  }

  async function sha256Hex(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function openLaunchApp() {
    $("accessGate").style.display = "none";
    $("launchApp").hidden = false;
    $("launchApp").style.display = "block";
    writeStorage(window.sessionStorage, "ma_launch_access_v2", "1");
  }

  function bindAccessGate() {
    const gate = $("accessGate");
    const app = $("launchApp");
    const form = $("accessForm");
    const input = $("accessCode");
    const error = $("accessError");
    if (!gate || !app || !form || !input || !error) return;
    if (readStorage(window.sessionStorage, "ma_launch_access_v2") === "1") openLaunchApp();
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        const valid = await sha256Hex(input.value.trim()) === ACCESS_CODE_HASH;
        error.hidden = valid;
        if (valid) openLaunchApp();
      } catch (hashError) {
        console.error("Access verification failed", hashError);
        error.textContent = "Browser tidak mendukung verifikasi access code.";
        error.hidden = false;
      }
    });
    $("lockBtn").addEventListener("click", () => {
      removeStorage(window.sessionStorage, "ma_launch_access_v2");
      window.location.reload();
    });
  }

  function showImageError(message) {
    const error = $("tokenImageError");
    error.textContent = message;
    error.hidden = false;
  }

  function clearImageError() {
    const error = $("tokenImageError");
    error.textContent = "";
    error.hidden = true;
  }

  function normalizeUri(value) {
    const uri = String(value || "").trim();
    if (!uri) return "";
    if (/^ipfs:\/\/[A-Za-z0-9]+/i.test(uri) || /^https:\/\//i.test(uri)) return uri;
    throw new Error("URI harus diawali ipfs:// atau https://.");
  }

  function toGatewayUrl(uri) {
    if (!uri) return "";
    if (/^ipfs:\/\//i.test(uri)) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
    return uri;
  }

  function setStorageStatus(message, ok = false) {
    const status = $("tokenImageStorageStatus");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-ok", ok);
  }

  function renderImagePreview() {
    const preview = $("tokenImagePreview");
    const placeholder = $("tokenImagePlaceholder");
    const hasPreview = Boolean(selectedImageDataUrl || selectedImageUri);
    if (!preview || !placeholder) return;
    if (selectedImageDataUrl) preview.src = selectedImageDataUrl;
    else if (selectedImageUri) preview.src = toGatewayUrl(selectedImageUri);
    else preview.removeAttribute("src");
    preview.hidden = !hasPreview;
    placeholder.hidden = hasPreview;
  }

  function setImageUri(uri, statusMessage = "Image URI siap digunakan") {
    selectedImageUri = normalizeUri(uri);
    $("tokenImageUri").value = selectedImageUri;
    renderImagePreview();
    setStorageStatus(statusMessage, true);
  }

  function resetImagePreview() {
    selectedImageFile = null;
    selectedImageDataUrl = "";
    selectedImageName = "";
    selectedImageUri = "";
    selectedMetadataUri = "";
    $("tokenImage").value = "";
    $("tokenImageUri").value = "";
    $("tokenMetadataUri").value = "";
    $("tokenImageTitle").textContent = "Upload token image";
    $("tokenImageMeta").textContent = "PNG, JPG, WebP, atau GIF · maksimal 10 MB";
    $("removeTokenImage").hidden = true;
    $("tokenImageDropzone").classList.remove("has-image", "is-dragover");
    $("successTokenImageWrap").hidden = true;
    setStorageStatus("Belum diunggah");
    renderImagePreview();
    clearImageError();
  }

  function handleImageFile(file) {
    if (!file) return;
    clearImageError();
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      showImageError("Format gambar harus PNG, JPG, WebP, atau GIF.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      showImageError("Ukuran gambar maksimal 10 MB.");
      return;
    }

    selectedImageFile = file;
    selectedImageUri = "";
    selectedMetadataUri = "";
    $("tokenImageUri").value = "";
    $("tokenMetadataUri").value = "";
    setStorageStatus("Belum diunggah");
    const reader = new FileReader();
    reader.onload = () => {
      selectedImageDataUrl = String(reader.result || "");
      selectedImageName = file.name;
      renderImagePreview();
      $("tokenImageTitle").textContent = file.name;
      $("tokenImageMeta").textContent = `${Math.max(1, Math.round(file.size / 1024))} KB · klik untuk mengganti`;
      $("removeTokenImage").hidden = false;
      $("tokenImageDropzone").classList.add("has-image");
    };
    reader.onerror = () => showImageError("Gambar tidak dapat dibaca. Silakan pilih file lain.");
    reader.readAsDataURL(file);
  }

  function handleImageUriChange(value) {
    const uri = String(value || "").trim();
    if (!uri) {
      if (!selectedImageFile) {
        selectedImageUri = "";
        selectedImageDataUrl = "";
        renderImagePreview();
        setStorageStatus("Belum diunggah");
      }
      return;
    }
    try {
      selectedImageFile = null;
      selectedImageDataUrl = "";
      setImageUri(uri, "Existing image URI siap digunakan");
      $("tokenImageTitle").textContent = "Existing image URI";
      $("tokenImageMeta").textContent = "Preview dari URI yang diberikan";
      $("removeTokenImage").hidden = false;
      $("tokenImageDropzone").classList.add("has-image");
      clearImageError();
    } catch (error) {
      showImageError(error.message);
    }
  }

  function handleMetadataUriChange(value) {
    try {
      selectedMetadataUri = normalizeUri(value);
      if (selectedMetadataUri) setText("tokenImageStorageStatus", "Metadata URI siap digunakan");
      clearImageError();
    } catch (error) {
      showImageError(error.message);
    }
  }

  async function responseJson(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const reason = data.error?.details || data.error?.message || data.message || `HTTP ${response.status}`;
      throw new Error(`IPFS upload gagal: ${reason}`);
    }
    return data;
  }

  async function pinFileToIpfs(file, jwt, name) {
    const form = new FormData();
    form.append("file", file, file.name || "token-image");
    form.append("pinataMetadata", JSON.stringify({ name: `${name || "token"}-logo` }));
    form.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
    const response = await fetch(PINATA_FILE_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: form
    });
    const data = await responseJson(response);
    if (!data.IpfsHash) throw new Error("IPFS tidak mengembalikan CID gambar.");
    return `ipfs://${data.IpfsHash}`;
  }

  async function pinJsonToIpfs(metadata, jwt, name) {
    const response = await fetch(PINATA_JSON_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        pinataOptions: { cidVersion: 1 },
        pinataMetadata: { name: `${name || "token"}-metadata.json` },
        pinataContent: metadata
      })
    });
    const data = await responseJson(response);
    if (!data.IpfsHash) throw new Error("IPFS tidak mengembalikan CID metadata.");
    return `ipfs://${data.IpfsHash}`;
  }

  async function uploadSelectedImageToIpfs() {
    if (!selectedImageFile) {
      showImageError("Pilih file gambar terlebih dahulu sebelum upload ke IPFS.");
      return;
    }
    const jwt = $("pinataJwt").value.trim() || ephemeralPinataJwt;
    if (!jwt) {
      showImageError("Masukkan Pinata JWT terbatas untuk mengunggah gambar ke IPFS.");
      $("ipfsUploadDetails").open = true;
      return;
    }
    const button = $("uploadTokenImage");
    button.disabled = true;
    button.textContent = "Uploading…";
    clearImageError();
    setStorageStatus("Mengunggah gambar ke IPFS…");
    try {
      ephemeralPinataJwt = jwt;
      const uri = await pinFileToIpfs(selectedImageFile, jwt, $("tokenName").value.trim() || "token");
      setImageUri(uri, "Image pinned ke IPFS ✓");
      $("pinataJwt").value = "";
    } catch (error) {
      showImageError(error.message || "Gambar gagal diunggah ke IPFS.");
      setStorageStatus("Upload gagal");
    } finally {
      button.disabled = false;
      button.textContent = "Upload image to IPFS";
    }
  }

  async function prepareTokenMetadata(name, symbol, rawSupply) {
    let imageUri = selectedImageUri || normalizeUri($("tokenImageUri").value);
    let metadataUri = selectedMetadataUri || normalizeUri($("tokenMetadataUri").value);
    const jwt = $("pinataJwt").value.trim() || ephemeralPinataJwt;

    if (!imageUri && selectedImageFile) {
      if (!jwt) {
        if (IS_MAINNET) throw new Error("Gambar belum permanen. Buka bagian IPFS dan masukkan Pinata JWT terbatas.");
        setStorageStatus("Preview lokal untuk testnet");
      } else {
        setText("progressText", "Mengunggah gambar ke IPFS sebelum transaksi wallet…");
        ephemeralPinataJwt = jwt;
        imageUri = await pinFileToIpfs(selectedImageFile, jwt, name);
        setImageUri(imageUri, "Image pinned ke IPFS ✓");
      }
    }
    if (!imageUri && !selectedImageFile) throw new Error("Token image wajib dipilih atau diisi dengan image URI IPFS/HTTPS.");

    if (!metadataUri && jwt) {
      setText("progressText", "Membuat metadata token di IPFS…");
      const description = $("tokenDescription").value.trim() || `${name} (${symbol}) community token on ${NETWORK.label}. Not affiliated with Robinhood.`;
      metadataUri = await pinJsonToIpfs({
        name,
        symbol,
        description,
        image: imageUri,
        external_url: `${window.location.origin}/launch/`,
        attributes: [
          { trait_type: "Network", value: NETWORK.label },
          { trait_type: "Supply Type", value: "Fixed" },
          { trait_type: "Decimals", value: 18 },
          { trait_type: "Total Supply", value: rawSupply }
        ]
      }, jwt, symbol);
      selectedMetadataUri = metadataUri;
      $("tokenMetadataUri").value = metadataUri;
      setStorageStatus("Image + metadata pinned ke IPFS ✓", true);
    }

    if (IS_MAINNET && !metadataUri) {
      throw new Error("Mainnet membutuhkan Metadata URI. Upload image + metadata ke IPFS atau isi Metadata URI yang sudah ada.");
    }

    ephemeralPinataJwt = "";
    $("pinataJwt").value = "";
    return { imageUri, metadataUri };
  }

  function bindImagePicker() {
    const dropzone = $("tokenImageDropzone");
    const input = $("tokenImage");
    if (!dropzone || !input) return;
    input.addEventListener("change", (event) => handleImageFile(event.target.files && event.target.files[0]));
    $("removeTokenImage").addEventListener("click", resetImagePreview);
    $("tokenImageUri").addEventListener("change", (event) => handleImageUriChange(event.target.value));
    $("tokenImageUri").addEventListener("blur", (event) => handleImageUriChange(event.target.value));
    $("tokenMetadataUri").addEventListener("change", (event) => handleMetadataUriChange(event.target.value));
    $("tokenMetadataUri").addEventListener("blur", (event) => handleMetadataUriChange(event.target.value));
    $("uploadTokenImage").addEventListener("click", uploadSelectedImageToIpfs);
    ["dragenter", "dragover"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("is-dragover");
    }));
    ["dragleave", "drop"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("is-dragover");
    }));
    dropzone.addEventListener("drop", (event) => handleImageFile(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]));
  }

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
      network.textContent = NETWORK.label;
      setDeployState(false, "Connect wallet first");
      return;
    }

    if (isTargetNetwork()) {
      state.textContent = `${activeWalletName || "Wallet"} Connected`;
      state.classList.add("is-ok");
      network.textContent = NETWORK.label;
      setDeployState(true, `Deploy Token on ${IS_MAINNET ? "Mainnet" : "Testnet"} →`);
    } else {
      state.textContent = `Switch to ${NETWORK.label}`;
      state.classList.remove("is-ok");
      network.textContent = "Wrong network · switch required";
      setDeployState(false, `Switch to ${NETWORK.label}`);
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
    renderPendingDeployment();
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
    renderPendingDeployment();
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

  function loadPendingDeployment() {
    const raw = readStorage(window.localStorage, PENDING_STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !/^0x[0-9a-f]{64}$/i.test(parsed.txHash || "")) return null;
      return parsed;
    } catch (error) {
      removeStorage(window.localStorage, PENDING_STORAGE_KEY);
      return null;
    }
  }

  function savePendingDeployment(record) {
    pendingDeployment = { ...record, networkMode, chainId: NETWORK.chainIdNumber, savedAt: new Date().toISOString() };
    writeStorage(window.localStorage, PENDING_STORAGE_KEY, JSON.stringify(pendingDeployment));
    renderPendingDeployment();
  }

  function clearPendingDeployment() {
    pendingDeployment = null;
    removeStorage(window.localStorage, PENDING_STORAGE_KEY);
    renderPendingDeployment();
  }

  function renderPendingDeployment() {
    const panel = $("pendingDeployment");
    if (!panel) return;
    if (!pendingDeployment) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    setText("pendingTxHash", pendingDeployment.txHash);
    const link = $("pendingExplorerLink");
    link.href = explorerTransactionUrl(pendingDeployment.txHash);
    const sameAccount = Boolean(account && pendingDeployment.account && account.toLowerCase() === pendingDeployment.account.toLowerCase());
    setText("pendingDeploymentText", sameAccount
      ? "Hash transaksi ditemukan untuk wallet ini. Periksa statusnya sebelum membuat deployment baru."
      : `Deployment tersimpan dari wallet ${pendingDeployment.account || "sebelumnya"}. Hubungkan wallet tersebut untuk recovery.`);
    $("recoverDeployment").disabled = Boolean(activeProvider && pendingDeployment.account && !sameAccount);
  }

  async function waitForReceipt(provider, txHash) {
    const started = Date.now();
    while (Date.now() - started < 180000) {
      const receipt = await provider.request({ method: "eth_getTransactionReceipt", params: [txHash] });
      if (receipt) return receipt;
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
    }
    throw new Error("Transaksi belum terkonfirmasi setelah 3 menit. Hash sudah disimpan; gunakan panel recovery atau buka explorer.");
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

  async function copyVerificationInfo() {
    if (!currentVerificationData) return;
    const info = JSON.stringify({
      contractAddress: currentVerificationData.address,
      transactionHash: currentVerificationData.txHash,
      network: NETWORK.label,
      chainId: NETWORK.chainIdNumber,
      compiler: "Solidity 0.8.30",
      constructorArguments: currentVerificationData.constructorArguments,
      source: CONTRACT_SOURCE_URL
    }, null, 2);
    try {
      await navigator.clipboard.writeText(info);
      $("copyVerification").textContent = "Copied ✓";
      window.setTimeout(() => { $("copyVerification").textContent = "Copy Verification Info"; }, 1800);
    } catch (error) {
      alert(info);
    }
  }

  function showDeploymentSuccess(receipt, details) {
    const receiptStatus = String(receipt.status || "").toLowerCase();
    if (receiptStatus && receiptStatus !== "0x1" && receiptStatus !== "1") throw new Error("Deployment transaction gagal dikonfirmasi.");
    if (!receipt.contractAddress) throw new Error("Transaksi berhasil, tetapi alamat contract belum dikembalikan oleh wallet. Buka explorer untuk memeriksa hash transaksi.");

    currentVerificationData = {
      address: receipt.contractAddress,
      txHash: details.txHash,
      constructorArguments: details.constructorArguments,
      name: details.name,
      symbol: details.symbol,
      rawSupply: details.rawSupply,
      imageUri: details.imageUri,
      metadataUri: details.metadataUri
    };
    clearPendingDeployment();
    $("launchProgress").hidden = true;
    $("launchSuccess").hidden = false;
    $("contractAddress").textContent = receipt.contractAddress;
    $("explorerLink").href = explorerAddressUrl(receipt.contractAddress);
    $("verificationLink").href = `${explorerAddressUrl(receipt.contractAddress)}?tab=contract`;
    const successImageWrap = $("successTokenImageWrap");
    if (selectedImageDataUrl || details.imageUri) {
      $("successTokenImage").src = selectedImageDataUrl || toGatewayUrl(details.imageUri);
      $("successTokenImage").alt = details.name ? `${details.name} image preview` : "Token image preview";
      successImageWrap.hidden = false;
    } else {
      successImageWrap.hidden = true;
    }
    const metadataBox = $("successMetadata");
    if (details.imageUri || details.metadataUri) {
      metadataBox.hidden = false;
      setText("successImageUri", details.imageUri || "—");
      setText("successMetadataUri", details.metadataUri || "—");
    } else {
      metadataBox.hidden = true;
    }
    $("copyAddress").onclick = copyContractAddress;
    $("copyVerification").onclick = copyVerificationInfo;
    $("launchSuccess").scrollIntoView({ behavior: "smooth" });
  }

  async function recoverPendingDeployment() {
    if (!pendingDeployment || !activeProvider) return;
    if (pendingDeployment.account && account && pendingDeployment.account.toLowerCase() !== account.toLowerCase()) {
      alert("Hubungkan wallet yang sama dengan wallet pembuat transaksi.");
      return;
    }
    $("launchProgress").hidden = false;
    $("launchSuccess").hidden = true;
    setText("progressTitle", "Checking saved transaction…");
    setText("progressText", `Memeriksa ${pendingDeployment.txHash}`);
    try {
      const receipt = await waitForReceipt(activeProvider, pendingDeployment.txHash);
      showDeploymentSuccess(receipt, pendingDeployment);
    } catch (error) {
      $("launchProgress").hidden = true;
      alert(getErrorMessage(error, "Recovery gagal"));
    }
  }

  async function confirmMainnetDeployment(name, symbol, rawSupply, imageUri, metadataUri, gas) {
    if (!IS_MAINNET) return;
    const confirmation = window.prompt(
      `MAINNET DEPLOYMENT\n\n${name} ($${symbol})\nSupply: ${rawSupply}\nOwner: ${account}\nImage: ${imageUri || "—"}\nMetadata: ${metadataUri || "—"}\nEstimated gas units: ${gas || "wallet estimate"}\n\nKetik MAINNET untuk melanjutkan.`,
      ""
    );
    if (confirmation !== "MAINNET") throw new Error("Deployment mainnet dibatalkan. Ketik MAINNET dengan tepat untuk melanjutkan.");
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
    if (pendingDeployment) {
      renderPendingDeployment();
      alert("Masih ada deployment tersimpan. Check & Recover transaksi tersebut atau Forget Record sebelum membuat deployment baru.");
      return;
    }

    try {
      await ensureNetwork();
      if (!isTargetNetwork()) throw new Error(`Wallet belum berada di ${NETWORK.label} (Chain ID ${NETWORK.chainIdNumber}).`);

      const accounts = await activeProvider.request({ method: "eth_accounts" });
      if (accounts && accounts[0] && accounts[0].toLowerCase() !== account.toLowerCase()) {
        account = accounts[0];
        $("walletAddress").textContent = account;
      }

      const balanceHex = await activeProvider.request({ method: "eth_getBalance", params: [account, "latest"] });
      if (BigInt(balanceHex) === 0n) throw new Error(`Wallet tidak memiliki ETH ${IS_MAINNET ? "Robinhood Chain mainnet" : "Robinhood Chain Testnet"} untuk membayar gas deployment.`);
      if (typeof ethers === "undefined") throw new Error("Library transaksi belum termuat. Muat ulang halaman lalu coba lagi.");

      const supply = ethers.parseUnits(rawSupply, 18);
      const iface = new ethers.Interface(TOKEN_ABI);

      $("launchProgress").hidden = false;
      $("launchSuccess").hidden = true;
      $("progressTitle").textContent = "Preparing fixed-supply ERC-20…";
      $("progressText").textContent = "Menyiapkan image dan metadata permanen sebelum transaksi wallet.";

      const metadata = await prepareTokenMetadata(name, symbol, rawSupply);
      const imageUri = metadata.imageUri;
      const metadataUri = metadata.metadataUri;
      const finalConstructorData = iface.encodeDeploy([name, symbol, supply, account]);
      const finalDeployData = TOKEN_BYTECODE + finalConstructorData.slice(2);

      let gas;
      try {
        gas = await activeProvider.request({ method: "eth_estimateGas", params: [{ from: account, data: finalDeployData }] });
      } catch (error) {
        console.warn("Gas estimate failed; wallet will estimate again", error);
      }

      await confirmMainnetDeployment(name, symbol, rawSupply, imageUri, metadataUri, gas);
      const transaction = { from: account, data: finalDeployData };
      if (gas) transaction.gas = gas;
      const txHash = await activeProvider.request({ method: "eth_sendTransaction", params: [transaction] });
      savePendingDeployment({
        txHash,
        account,
        name,
        symbol,
        rawSupply,
        imageUri,
        metadataUri,
        constructorArguments: finalConstructorData.slice(2)
      });
      $("progressTitle").textContent = "Waiting for confirmation…";
      $("progressText").textContent = "Transaction: " + txHash;

      const receipt = await waitForReceipt(activeProvider, txHash);
      showDeploymentSuccess(receipt, { txHash, account, name, symbol, rawSupply, imageUri, metadataUri, constructorArguments: finalConstructorData.slice(2) });
    } catch (error) {
      $("launchProgress").hidden = true;
      console.error("Deploy error:", error);
      let message = getErrorMessage(error, "Deployment failed");
      if (/insufficient funds/i.test(message)) message = `ETH Robinhood Chain ${IS_MAINNET ? "mainnet" : "testnet"} tidak cukup untuk gas deployment.`;
      ephemeralPinataJwt = "";
      $("pinataJwt").value = "";
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
  $("recoverDeployment").addEventListener("click", recoverPendingDeployment);
  $("forgetDeployment").addEventListener("click", () => {
    if (pendingDeployment && window.confirm("Hapus catatan hash ini dari browser? Transaksi blockchain tidak dihapus.")) clearPendingDeployment();
  });
  $("tokenForm").addEventListener("submit", deployToken);
  applyNetworkCopy();
  bindAccessGate();
  pendingDeployment = loadPendingDeployment();
  bindImagePicker();
  renderPendingDeployment();
  renderWalletState();
  scanWallets();
})();
