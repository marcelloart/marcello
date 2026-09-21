(()=>{"use strict";
const ACCESS_CODE="MARCELLO-RH-2026";
const CHAIN={chainId:"0xb626",chainName:"Robinhood Chain Testnet",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:["https://rpc.testnet.chain.robinhood.com/"],blockExplorerUrls:["https://explorer.testnet.chain.robinhood.com"]};
const $=id=>document.getElementById(id); let account=null;
function unlock(){sessionStorage.setItem("ma_launch_access","1");$("accessGate").hidden=true;$("launchApp").hidden=false}
if(sessionStorage.getItem("ma_launch_access")==="1") unlock();
$("accessForm").addEventListener("submit",e=>{e.preventDefault();const ok=$("accessCode").value.trim()===ACCESS_CODE;$("accessError").hidden=ok;if(ok)unlock()});
$("lockBtn").onclick=()=>{sessionStorage.removeItem("ma_launch_access");location.reload()};
let activeProvider=null;
const announced=new Map();
function renderWallets(){
 const box=$("detectedWallets"); if(!box)return;
 const list=Array.from(announced.values());
 if(!list.length){box.innerHTML='<div class="wallet-detecting">Belum ada wallet EIP-6963 terdeteksi. Pastikan extension aktif, lalu klik Scan ulang wallet.</div>';return}
 box.innerHTML="";
 list.forEach(detail=>{
  const btn=document.createElement("button");btn.type="button";btn.className="wallet-option";
  const img=document.createElement("img");img.className="wallet-icon";img.src=detail.info.icon;img.alt="";
  const txt=document.createElement("span");const name=document.createElement("b");name.textContent=detail.info.name;
  const sub=document.createElement("small");sub.textContent=detail.info.rdns||"EIP-6963 wallet";txt.append(name,sub);btn.append(img,txt);
  btn.onclick=()=>connectDetail(detail);box.appendChild(btn);
 });
}
function onAnnounce(e){const d=e.detail;if(!d||!d.provider||!d.info)return;announced.set(d.info.uuid||d.info.rdns||d.info.name,d);renderWallets()}
window.addEventListener("eip6963:announceProvider",onAnnounce);
function scanWallets(){window.dispatchEvent(new Event("eip6963:requestProvider"));setTimeout(renderWallets,250)}
async function ensureNetwork(p=activeProvider){try{await p.request({method:"wallet_switchEthereumChain",params:[{chainId:CHAIN.chainId}]})}catch(e){if(e.code===4902||e.code===-32603){await p.request({method:"wallet_addEthereumChain",params:[CHAIN]})}else throw e}}
async function connectDetail(detail){try{const p=detail.provider;activeProvider=p;const accounts=await p.request({method:"eth_requestAccounts"});if(!accounts||!accounts[0])throw new Error("Tidak ada akun yang dipilih.");account=accounts[0];await ensureNetwork(p);$("walletPicker").hidden=true;$("walletState").textContent=detail.info.name+" Connected";$("walletState").classList.add("is-ok");$("walletInfo").hidden=false;$("walletAddress").textContent=account;$("connectWallet").textContent=detail.info.name+" Connected";$("disconnectWallet").hidden=false;$("deployToken").disabled=false;$("deployToken").textContent="Deploy Token on Testnet →"}catch(e){alert(e.message||"Wallet connection failed")}}
$("connectWallet").onclick=()=>{$("walletPicker").hidden=false;scanWallets()};
$("closeWalletPicker").onclick=()=>{$("walletPicker").hidden=true};
$("refreshWallets").onclick=scanWallets;
$("disconnectWallet").onclick=()=>{account=null;activeProvider=null;$("walletState").textContent="Not connected";$("walletState").classList.remove("is-ok");$("walletInfo").hidden=true;$("walletAddress").textContent="";$("connectWallet").textContent="Connect Wallet";$("disconnectWallet").hidden=true;$("deployToken").disabled=true;$("deployToken").textContent="Connect wallet first";$("launchProgress").hidden=true;};
scanWallets();

const source=(name,symbol)=>`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract MarcelloFixedERC20 {
string public name; string public symbol; uint8 public constant decimals=18; uint256 public totalSupply;
mapping(address=>uint256) public balanceOf; mapping(address=>mapping(address=>uint256)) public allowance;
event Transfer(address indexed from,address indexed to,uint256 value); event Approval(address indexed owner,address indexed spender,uint256 value);
constructor(string memory n,string memory s,uint256 supply,address owner){name=n;symbol=s;totalSupply=supply;balanceOf[owner]=supply;emit Transfer(address(0),owner,supply);}
function transfer(address to,uint256 v) external returns(bool){require(balanceOf[msg.sender]>=v,"balance");unchecked{balanceOf[msg.sender]-=v;}balanceOf[to]+=v;emit Transfer(msg.sender,to,v);return true;}
function approve(address s,uint256 v) external returns(bool){allowance[msg.sender][s]=v;emit Approval(msg.sender,s,v);return true;}
function transferFrom(address f,address t,uint256 v) external returns(bool){require(balanceOf[f]>=v,"balance");uint256 a=allowance[f][msg.sender];require(a>=v,"allowance");if(a!=type(uint256).max)allowance[f][msg.sender]=a-v;unchecked{balanceOf[f]-=v;}balanceOf[t]+=v;emit Transfer(f,t,v);return true;}
}`;
function compile(name,symbol){if(typeof Module==="undefined"||typeof Module.cwrap!=="function")throw new Error("Solidity compiler belum siap. Tunggu beberapa detik lalu coba Deploy lagi.");const solc=solcWrapper(Module);const input={language:"Solidity",sources:{"Token.sol":{content:source(name,symbol)}},settings:{optimizer:{enabled:true,runs:200},outputSelection:{"*":{"*":["abi","evm.bytecode.object"]}}}};const out=JSON.parse(solc.compile(JSON.stringify(input)));if(out.errors){const fatal=out.errors.filter(x=>x.severity==="error");if(fatal.length)throw new Error(fatal.map(x=>x.formattedMessage).join("\n"))}return out.contracts["Token.sol"].MarcelloFixedERC20}
function solcWrapper(Module){const compileStandard=Module.cwrap("solidity_compile","string",["string","number","number"]);return{compile:input=>compileStandard(input,0,0)}}
$("tokenForm").addEventListener("submit",async e=>{e.preventDefault();if(!account||!activeProvider)return;const name=$("tokenName").value.trim(),symbol=$("tokenSymbol").value.trim().toUpperCase(),raw=$("tokenSupply").value.trim();if(!name||!symbol||!/^\d+$/.test(raw)){alert("Periksa kembali data token.");return}try{await ensureNetwork();const provider=new ethers.BrowserProvider(activeProvider);const network=await provider.getNetwork();if(Number(network.chainId)!==46630)throw new Error("Wallet belum berada di Robinhood Chain Testnet (Chain ID 46630).");const balance=await provider.getBalance(account);if(balance===0n)throw new Error("Wallet tidak memiliki ETH Robinhood Testnet untuk membayar gas deployment.");$("launchProgress").hidden=false;$("launchSuccess").hidden=true;$("progressTitle").textContent="Compiling ERC-20…";$("progressText").textContent="Menyiapkan fixed-supply contract di browser Anda.";await new Promise(r=>setTimeout(r,50));const c=compile(name,symbol);const signer=await provider.getSigner();const supply=ethers.parseUnits(raw,18);const factory=new ethers.ContractFactory(c.abi,"0x"+c.evm.bytecode.object,signer);$("progressTitle").textContent="Confirm deployment in wallet";$("progressText").textContent="Periksa estimasi gas dan konfirmasi transaksi testnet.";const contract=await factory.deploy(name,symbol,supply,account);$("progressTitle").textContent="Waiting for confirmation…";await contract.waitForDeployment();const addr=await contract.getAddress();$("launchProgress").hidden=true;$("launchSuccess").hidden=false;$("contractAddress").textContent=addr;$("explorerLink").href=CHAIN.blockExplorerUrls[0]+"/address/"+addr;$("copyAddress").onclick=()=>navigator.clipboard.writeText(addr);$("launchSuccess").scrollIntoView({behavior:"smooth"})}catch(err){$("launchProgress").hidden=true;console.error("Deploy error:",err);let msg=err.shortMessage||err.reason||err.message||"Deployment failed";if(err.code==="ACTION_REJECTED"||err.code===4001)msg="Transaksi deployment dibatalkan di wallet.";if(/insufficient funds/i.test(msg))msg="ETH Robinhood Testnet tidak cukup untuk gas deployment.";alert(msg)}});})();