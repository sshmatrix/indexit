import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { useNavigate } from "react-router-dom";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT
} from "./util/interact.js";
import {
  arabic,
  chinese,
  hindi,
  korean,
  persian,
  parseRoman,
  h2e,
  a2e,
  c2e,
  k2e,
  p2e
} from "./util/nonascii.js";
import './index.css';
import sample from "./img/samples.gif";
import roadmap from "./img/roadmap.png";
import { homepage } from '../package.json';
require("dotenv").config();
const alchemyKeyMainnet = process.env.REACT_APP_ALCHEMY_KEY_MAINNET;

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [ens, setENS] = useState("");
  const [message, setMessage] = useState("");
  const [messageHash, setMessageHash] = useState("");
  const [uri, setURI] = useState("");
  const [signature, setSignature] = useState("");
  const [nft, setNFT] = useState("");
  const [record, setRecord] = useState("");

  function isMobileDevice() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
  }
  const isMobile = isMobileDevice();

  var mainnet = new ethers.providers.AlchemyProvider("homestead", alchemyKeyMainnet);
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  useEffect(() => {
    let isComponentMounted = true;
    const fetchData = async () => {
      const { address, status } = await getCurrentWalletConnected();
      if(isComponentMounted) {
        setWallet(address);
        setStatus(status);
        addWalletListener(address);
      }
    };
    fetchData();
    return () => {
      isComponentMounted = false;
    }
  }, []);

  let navigate = useNavigate();

  const goToHome = () =>{
    if (!isMobile) {
      let path = `/`;
      navigate(path);
    } else {
      let path = `/minter`;
      navigate(path);
    }
  }

  const goToAlgorithm = () =>{
    let path = `/algorithm`;
    navigate(path);
  }

  const goToGenerate = () =>{
    let path = `/samples`;
    navigate(path);
  }

  async function addWalletListener(address) {
    const nameResolve = await mainnet.lookupAddress(address);
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setRecord(accounts[0]);
          setStatus("👆🏽 Enter ENS & click 'NEXT ▶▶▶'");
        } else {
          setWallet("");
          setRecord("");
          setStatus("🦊 Connect to MetaMask using 'Connect Wallet' button");
        }
      });
      if (nameResolve) {
        setRecord(nameResolve);
      } else {
        setRecord(walletAddress);
      }
    }
  }

  const switchWalletPressed = async () => {
    if (walletAddress) {
      // console.log(walletAddress);
      const accounts = await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{eth_accounts: {}}]
      }).then(() => window.ethereum.request({
        method: 'eth_requestAccounts',
      }))
      setWallet(accounts[0]);
      const nameResolve = await mainnet.lookupAddress(accounts[0]);
      if (nameResolve) {
        setRecord(nameResolve);
      } else {
        setRecord(accounts[0]);
      }
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    const nameResolve = await mainnet.lookupAddress(walletResponse.address);
    if (nameResolve) {
      setRecord(nameResolve);
    } else {
      setRecord(walletAddress.address);
    }
  };

  const onSignPressed = async () => {
    var digit = ens.slice(0, -4);
    var hasNonAscii = !/^[\u0000-\u007f]*$/.test(digit);
    var isArabic = [...digit].every(item => arabic.includes(item));
    var isPersian = [...digit].every(item => persian.includes(item));
    var isHindi = [...digit].every(item => hindi.includes(item));
    var isChinese = [...digit].every(item => chinese.includes(item));
    var isKorean = [...digit].every(item => korean.includes(item));
    var isRoman = /^(m{1,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})|m{0,4}(cm|c?d|d?c{1,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})|m{0,4}(cm|cd|d?c{0,3})(xc|x?l|l?x{1,3})(ix|iv|v?i{0,3})|m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|i?v|v?i{1,3}))$/.test(digit.toLowerCase());

    if (
      (
        !isRoman && hasNonAscii &&
        (
          (digit.length >= 3 && digit.length <= 5 && isArabic) || (digit.length >= 3 && digit.length <= 5 && isHindi) || (digit.length >= 3 && digit.length <= 5 && isChinese) || (digit.length >= 3 && digit.length <= 5 && isKorean)
        )
      ) ||
      (
        isRoman && !hasNonAscii &&
        (
          parseRoman(digit) < 4000
        ) && digit.length >= 3 && digit.length <= 10
      ) ||
      (
        !hasNonAscii && !isRoman &&
        (
          (digit.length === 5
            && digit.substring(2,3) === "h"
            && ( (/^[0-1]+$/.test(digit.substring(0,1)) && /^[0-9]+$/.test(digit.substring(1,2))) || (/^[2-2]+$/.test(digit.substring(0,1)) && /^[0-9]+$/.test(digit.substring(1,2))) )
            && /^[0-5]+$/.test(digit.substring(3,4))
            && /^[0-9]+$/.test(digit.substring(4,5))
          )
          || (digit.length >= 3 && digit.length <= 5 && /^[0-9]+$/.test(digit))
          || (digit.length >= 3 && digit.length <= 7 && digit.startsWith("0x") && /^[0-9]+$/.test(digit.substring(2)))
        )
      )
    ) {
      var trans = '';
      var lang = '';
      if (isArabic) {
        trans = a2e(digit);
        lang = 'arabic';
      } else if (isHindi) {
        trans = h2e(digit);
        lang = 'hindi';
      } else if (isRoman) {
        trans = parseRoman(digit);
        lang = 'roman';
        digit = digit.toLowerCase();
      } else if (isChinese) {
        trans = c2e(digit);
        lang = 'chinese';
      } else if (isKorean) {
        trans = k2e(digit);
        lang = 'korean';
      } else if (isPersian) {
        trans = p2e(digit);
        lang = 'persian';
      } else {
        trans = digit;
        lang = 'english';
      }
      setStatus('⌛ Checking ENS digit ownership... please wait!');
      const addressResolve = await mainnet.resolveName(`${digit}.eth`);
      if ( addressResolve ) {
        if ( addressResolve.toLowerCase() === walletAddress.toLowerCase() ) {
          setStatus('✅ Ownership confirmed! Waiting for Signature ⌛');
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const timestamp = Date.now();
          const rawMessage = `Signed by ${walletAddress} at time ${timestamp}`;
          const toSign = ethers.utils.id(rawMessage);
          const payload = ethers.utils.defaultAbiCoder.encode([ "bytes32", "string" ], [ toSign, rawMessage ]);
          const messageHashed = ethers.utils.keccak256(payload);
          setMessageHash(toSign);
          setMessage(rawMessage);
          if (message !== '') {
            console.log('⌛ Signing and generating card... Please wait!');
            const messageBytes = ethers.utils.arrayify(messageHashed);
            const signedValue = await signer.signMessage(messageBytes);
            setSignature(signedValue);
            if (signedValue) {
              setStatus('⌛ Signed! Generating card... please wait! (can take up to 60 seconds)');
            } else {
              setStatus('❌ Signature declined or failed to Sign. Try again!');
            }
            const meta = {
              signature: signedValue,
              message: toSign,
              ens: ens,
              trans: trans + '.eth',
              lang: lang,
              toSign: message,
              prompt: 'mint'
            };
            try {
              console.log('Request ↓↓↓');
              console.log(meta);
              await fetch(
                "https://indexit.club:3001/write",
                {
                  method: "post",
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(meta)
                })
                .then(response => response.json())
                .then(data => {
                  console.log('Response ↓↓↓');
                  console.log(data);
                  setURI(data.uri);
                  if (data.signature !== signedValue) {
                    if (data.signature === 'wait') {
                      window.alert('✋ You are in queue! Try again in a few minutes ⌛')
                      setStatus('✋ You are in queue! Try again in a few minutes ⌛');
                    } else if (data.signature === 'reset') {
                      window.alert('❌ Your card could not be generated. Try again 🥴')
                      setStatus('❌ Your card could not be generated. Try again 🥴');
                    } else {
                      window.alert('❌ Error! Signature mismatch!')
                      setStatus('❌ Error! Signature mismatch!');
                    }
                  } else if (data.image === 'empty') {
                      setStatus('✋ You are in queue! Try again in a few minutes ⌛');
                      window.alert('✋ You are in queue! Try again in a few minutes ⌛')
                  } else if (data.image === 'reset') {
                    setStatus('❌ Your card could not be generated. Try again 🥴');
                    window.alert('❌ Your card could not be generated. Try again 🥴')
                  } else {
                    setNFT(data.link);
                    setStatus("💾 Card generated! Click on 'MINT' (or Sign again)");
                  }
                });
            } catch (error) {
              setStatus('✋ Hold up! Backend is not reachable. Try later ⌛');
              window.alert('✋ Hold up! Backend is not reachable. Try later ⌛')
            }
          } else {
            setStatus("✅ Valid ENS! Click 'NEXT ▶▶▶' to Sign");
          }
        } else {
          window.alert('❌ ENS digit does not resolve to connect wallet ✋')
          setStatus('❌ ENS digit does not resolve to connect wallet ✋');
        }
      } else {
        window.alert('❌ ENS digit does not resolve to connect wallet ✋')
        setStatus('❌ ENS digit does not resolve to connect wallet ✋');
      }
    } else {
      setENS('.none');
      window.alert("❌ Provided ENS doesn't belong to 999, 10k, 100k, 24h, SPQR or 0xdigit Clubs!");
      setStatus("❌ Provided ENS doesn't belong to 999, 10k, 100k, 24h, SPQR or 0xdigit Clubs!");
    }
  };

  const onMintPressed = async () => {
    setStatus('⌛ Minting Card... Please Wait!');
    const { success, status } = await mintNFT(uri, ens, message, signature, messageHash);
    setStatus(status);
    if (success) {
      console.log('🚀 Transaction sent! Check your wallet or LooksRare/Rarible/OpenSea.');
      window.alert('🚀 Transaction sent! Check your wallet or LooksRare/Rarible/OpenSea.');
    } else {
      window.alert(status);
    }
  };

  return (
    <div className="Minter">
      <button id="sampleButton" onClick={goToHome}>
        🏛 HOME
      </button>
      <button id="sampleButton" onClick={goToGenerate}>
        🎁 SAMPLES
      </button>
      <button id="sampleButton" onClick={goToAlgorithm}>
        📃 INFO
      </button>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          record ? (
            !record.endsWith('.eth') ? (
              "⌛  " +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
            ) : (
              "🦊  " + record
            )
          ) : (
            "🦊  " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
          )
        ) : (
          <span>🦊 CONNECT WALLET</span>
        )}
      </button>

      {!walletAddress && !isMobile ? (
        <button id="switchWalletButton" style={{ background: 'grey', color: 'white' }}>
          🔒 CHANGE WALLET
        </button>
      ) : walletAddress && !isMobile ? (
        <button id="switchWalletButton" onClick={switchWalletPressed}>
          🔐 CHANGE WALLET
        </button>
      ) : (
        <div></div>
      )}

      <br></br>
      <h3 style={{ marginTop: '70px', marginLeft: '10px' }}><span style={{ fontSize: 20, color: '#370080' }} className='blink_fast'>📰 العربية/<span style={{ fontWeight: 200 }}>中国人/한국인/فارسی</span>/<span style={{ fontWeight: 200 }}>देवनागरी</span>/roman digits supported!</span></h3>
      <h1 id="title" style={{ marginTop: '20px' }}>🚀 RARITY CARDS FOR DIGIT CLUBS</h1>
      <img style={{ float: 'right', marginBottom: '20px' }} alt="sample" src={sample} width="337" height="400"/>
      <h3 style={{ marginTop: '10px', marginLeft: '20px' }}><span style={{ fontSize: 30 }}>🦊 </span>  connect metamask</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '30px' }}>connect wallet resolved by a digit name (requires a resolver)</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '20px' }}><span style={{ fontSize: 30 }}>🕙 </span>  sign a timestamp to generate card</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '30px' }}>why sign<span style={{ fontFamily: 'DM Mono' }}>?</span> unique verifiable signature will be printed on your card!</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '20px' }}><span style={{ fontSize: 30 }}>🖨️ </span>  mint your unique card!</h3>
      {!walletAddress ? (
        <div style={{ fontFamily:'SFMono', marginLeft: '30px' }}>
          <form style={{ marginBottom: '10px', width: '300px' }}>
            <input
              id="ens"
              type="text"
              placeholder="Connect Wallet"
              disabled
            />
          </form>
        </div>
      ) : (
        <div style={{ fontFamily:'SFMono', marginLeft: '30px' }}>
          <form style={{ marginBottom: '10px', width: '350px' }}>
            <input
              id="ens"
              type="text"
              placeholder="Enter digit.eth & Click on 'NEXT ▶▶▶'"
              onChange={(event) => setENS(event.target.value)}

            />
          </form>
        </div>
      )}
      <h6 style={{ marginTop: '-8px', color: 'blue', marginLeft: '30px', fontFamily: 'SFMono', fontSize: 15, fontWeight: 100 }}>999, 10k, 100k (english/العربية/देवनागरी/中国人/한국인/فارسی), 24h, 0xdigit, Roman</h6>
      <h6 style={{ marginTop: '-38px', color: 'blue', marginLeft: '40px', fontFamily: 'SFMono', fontSize: 12, fontWeight: 100 }}>✓ 034.eth, ٢٣٢٣٤.eth, ४५६७.eth, 四五六七.eth, 육구구오.eth, ۳۵۴.eth, 05h11.eth, 0x01397.eth, dcccxxxix.eth</h6>
      {!ens.endsWith(".eth") || !walletAddress ? (
        <div style={{ marginleft: '60px' }}>
          <button id="signButton" style={{ background: 'grey', color: 'white' }}>
            <span>🔒 NEXT </span>
          </button>
        </div>
        ) : (
        <div>
          <button id="signButton" onClick={onSignPressed}>
            <span>NEXT ▶▶▶</span>
          </button>
        </div>
      )}
      {!nft || !walletAddress ? (
        <div style={{ marginleft: '15px' }}>
          <button id="mintButton" style={{ background: 'grey', color: 'white' }}>
            🔒 MINT
          </button>
        </div>
        ) : (
        <div>
          <button id="mintButton" onClick={onMintPressed}>
            MINT
          </button>
        </div>
      )}
      {status && walletAddress ? (
        <div className='errorbox'>
            {status.toString().toLowerCase()}
        </div>
        ) : (
        <div className='errorbox'>
            {"🦊 Connect to MetaMask using 'Connect Wallet' button".toLowerCase()}
        </div>
      )}
      {nft ? (
        <div><img style={{ marginTop: '100px', marginBottom: '5px', marginLeft: '20px' }} alt="nft" src={nft} width="674"/></div>
        ) : (
        <p></p>
      )}
      <h1 style={{ marginTop: '150px' }}>FAQ:</h1>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>🀄 WHAT ARE RARITY CARDS FOR DIGIT CLUBS?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>rarity cards assign rarity to ens names in <span style={{ fontWeight: 600 }}>999</span>, <span style={{ fontWeight: 600 }}>10k</span>, <span style={{ fontWeight: 600 }}>100k</span> (<span style={{ fontWeight: 200 }}>中国人/한국인/فارسی</span>/english/العربية/<span style={{ fontWeight: 200 }}>देवनागरी</span>) & <span style={{ fontWeight: 600 }}>24h</span>, <span style={{ fontWeight: 600 }}>0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>digit</span>, roman clubs based on their mathematical properties. each card is unique to an ens name, printed with signature of the resolved wallet, thereby making it conceptually soulbound to an ens name (aka tokenbound token or tbt), but not contractually - yet. </h4>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>📚 LINK TO COLLECTION?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}><a style={{ color: 'blue', textDecoration: 'none' }} href="https://looksrare.org/collections/0x14aB45F6EdC154E338E27f8d1d2A7caD4ed62EC2" target='_blank' rel="noreferrer">looksrare</a> ✅, <a style={{ color: 'blue', textDecoration: 'none' }} href="https://rarible.com/collection/0x14aB45F6EdC154E338E27f8d1d2A7caD4ed62EC2" target='_blank' rel="noreferrer">rarible</a> ✅, <a style={{ color: 'blue', textDecoration: 'none' }} href="https://opensea.io/collection/iigenesis?search[sortAscending]=false&search[sortBy]=CREATED_DATE" target='_blank' rel="noreferrer">opensea</a> ✅</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>📓 CONTRACT ADDRESS?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}><a style={{ color: 'blue', textDecoration: 'none' }} href="https://etherscan.io/address/0x14ab45f6edc154e338e27f8d1d2a7cad4ed62ec2" target='_blank' rel="noreferrer">0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>14ab45f6 ... 4ed62ec2</a></h4>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>⏰ WHEN CAN I MINT?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>we are going live on <span style={{ fontWeight: 600 }}>mainnet on june 30 2022</span>! in the meantime, you can generate sample unsigned cards in the 'samples' tab!</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>🍾 WHO CAN MINT?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>wallet <span style={{ fontWeight: 600 }}>resolved</span> by an ens name in <span style={{ fontWeight: 600 }}>999, 10k, 100k</span> (<span style={{ fontWeight: 200 }}>中国人/한국인/فارسی</span>/english/العربية/<span style={{ fontWeight: 200 }}>देवनागरी</span>) & <span style={{ fontWeight: 600 }}>24h</span>, <span style={{ fontWeight: 600 }}>0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>digit</span>, roman club can mint! you can only mint the card for an ens digit for which a resolver is set pointing to your wallet. ownership (registrant) or control (controller) is not necessary.</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>💸 WHAT'S THE MINT PRICE?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '50px' }}><span style={{ fontWeight: 600 }}>3l </span>clubs: 0.050 eth + gas (<span style={{ fontWeight: 200 }}>中国人/한국인/فارسی</span>/english/العربية/<span style={{ fontWeight: 200 }}>देवनागरी</span> 999 & 0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>1l)</h4>
      <h4 style={{ marginTop: '20px', marginLeft: '50px' }}><span style={{ fontWeight: 600 }}>4l </span>clubs: 0.010 eth + gas (<span style={{ fontWeight: 200 }}>中国人/한국인/فارسی</span>/english/العربية/<span style={{ fontWeight: 200 }}><span style={{ fontWeight: 200 }}>देवनागरी </span> </span> 10k & 0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>2l)</h4>
      <h4 style={{ marginTop: '20px', marginLeft: '50px' }}><span style={{ fontWeight: 600 }}>5l </span>clubs: 0.005 eth + gas (24h, <span style={{ fontWeight: 200 }}>中国人/한국인/فارسی</span>/english/العربية/<span style={{ fontWeight: 200 }}>देवनागरी</span> 100k, roman & 0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>3l, 0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>4l, 0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>5l)</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '35px' }}>🎁 card holders will be eligible for premium zero-cost features in the future, such as wrapped subdomains hosting their digiverse, card drops on polygon and more! check out the roadmap below!</h3>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>⚙️ WHAT CRITERIA ARE TESTED FOR RARITY?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>the algorithm checks for whether the number is <span style={{ fontWeight: 600 }}>even</span>, <span style={{ fontWeight: 600 }}>odd</span>, <span style={{ fontWeight: 600 }}>palindrome</span>, has <span style={{ fontWeight: 600 }}>repeating</span>, <span style={{ fontWeight: 600 }}>alternating</span> and/or <span style={{ fontWeight: 600 }}>incrementing</span> characters, and <span style={{ fontWeight: 600 }}>69</span> types (honest coincidence 😋) of <span style={{ fontWeight: 600 }}>primes</span>! types of primes checked by the algorithm are: </h4>
      {width > 1050 ? (
        <h5 style={{ marginTop: '20px', marginLeft: '45px' }}>balanced<br></br> bell<br></br> chen<br></br> circular<br></br> cousin<br></br> cuban<br></br> dihedral<br></br> eisenstein<br></br> emirp<br></br> euclid<br></br> factorial<br></br> fermat<br></br> fibonacci<br></br> fortunate<br></br> gaussian<br></br> good<br></br> happy<br></br> harmonic<br></br> higgs<br></br> home<br></br> irregular<br></br> isolated<br></br> leyland<br></br> long<br></br> lucas<br></br> lucky<br></br> mersenne<br></br> repunit<br></br> mills<br></br> minimal<br></br> n4<br></br> non-generous<br></br> palindromic<br></br> partition<br></br> pell<br></br> permutable<br></br> perrin<br></br> pierpoint<br></br> pillai<br></br> primeval<br></br> primorial<br></br> proth<br></br> pythagorean<br></br> quadruplet<br></br> quartan<br></br> ramanujan<br></br> safe<br></br> self<br></br> sexy<br></br> smarandache-wellin<br></br> solinas<br></br> stern<br></br> strobo-grammatic<br></br> super-singular<br></br> thabit<br></br> two-sided<br></br> triplet<br></br> twin<br></br> unique<br></br> wagstaff<br></br> weakly<br></br> wilson<br></br> wolstenholme<br></br> woodall primes</h5>
      ) : (
        <h6 style={{ marginTop: '20px', marginLeft: '45px', fontSize: 16 }}>balanced, bell, chen, circular, cousin, cuban, dihedral, eisenstein, emirp, euclid, factorial, fermat, fibonacci, fortunate, gaussian, good, happy, harmonic, higgs, home, irregular, isolated, leyland, long, lucas, lucky, mersenne, repunit, mills, minimal, n4, non-generous, palindromic, partition, pell, permutable, perrin, pierpoint, pillai, primeval, primorial, proth, pythagorean, quadruplet, quartan, ramanujan, safe, self, sexy, smarandache-wellin, solinas, stern, strobo-grammatic, super-singular, thabit, two-sided, triplet, twin, unique, wagstaff, weakly, wilson, wolstenholme, woodall primes</h6>
      )}
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>🚧 ROADMAP?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>indexit.eth subdomains for card holders, support non-digit ens, and more!</h4>
      <br></br>
      <img style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '100px' }} alt="roadmap" src={roadmap} height="750" />
      <br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <span style={{ fontFamily: 'Major Mono Display', fontSize: '14px', fontWeight: 600, marginLeft: '10%' }}>twitter: <a style={{ color: 'blue', textDecoration: 'none' }} href="https://twitter.com/indexit_eth" target='_blank' rel="noreferrer">@indexit_eth</a></span>
      <br></br>
    </div>
  );
};

export default Minter;
