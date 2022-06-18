import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { useNavigate } from "react-router-dom";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT
} from "./util/interact.js";
import sample from "./img/samples.gif";
import './index.css';

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [ens, setENS] = useState("");
  const [message, setMessage] = useState("");
  const [messageHash, setMessageHash] = useState("");
  const [uri, setURI] = useState("");
  const [signature, setSignature] = useState("");
  const [sig, setSig] = useState("");
  const [nft, setNFT] = useState("");

  useEffect(() => {
    let isComponentMounted = true;
    const fetchData = async () => {
      const { address, status } = await getCurrentWalletConnected();
      if(isComponentMounted) {
        setWallet(address);
        setStatus(status);
        addWalletListener();
      }
    };
    fetchData();
    return () => {
      isComponentMounted = false;
    }
  }, []);

  let navigate = useNavigate();
  const goToHome = () =>{
    let path = `/`;
    navigate(path);
  }

  const goToAlgorithm = () =>{
    let path = `/algorithm`;
    navigate(path);
  }

  const goToGenerate = () =>{
    let path = `/samples`;
    navigate(path);
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Click 'NEXT →' to initialise");
        } else {
          setWallet("");
          setStatus("🦊 Connect to MetaMask using 'Connect Wallet' button.");
        }
      });
      setStatus(
        <p>
          {" "}
          🦊{" You must install  "}
          <a target="_blank" href={`https://metamask.io/download.html`} rel="noreferrer">
            MetaMask browser extension
          </a>
          {"  & connect using 'Connect Wallet' button!"}
        </p>
      );
    }
  }

  const disconnectPressed = async () => {
    if (walletAddress) {
      console.log(walletAddress)
      const accounts = await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{eth_accounts: {}}]
      }).then(() => window.ethereum.request({
        method: 'eth_requestAccounts',
      }))
      setWallet(accounts[0]);
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onSignPressed = async () => {
    var digit = ens.slice(0, -4);
    if (
      (digit.length === 5 && digit.substring(2,3) === "h" && /^[0-9]+$/.test(digit.substring(0,2)) && /^[0-9]+$/.test(digit.substring(3,5))) ||
      (digit.length >= 3 && digit.length <= 5 && /^[0-9]+$/.test(digit)) ||
      (digit.length >= 3 && digit.length <= 7 && digit.startsWith("0x") && /^[0-9]+$/.test(digit.substring(2)))
    ) {
      setENS(`${digit}.eth`);
      setStatus('⌛ Generating card... Please wait! (5 digits can take up to 60 seconds)');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const timestamp = Date.now();
      const rawMessage = `Hello IndexIt.eth at time ${timestamp}`;
      const toSign = ethers.utils.id(rawMessage);
      const payload = ethers.utils.defaultAbiCoder.encode([ "bytes32", "string" ], [ toSign, rawMessage ]);
      const messageHashed = ethers.utils.keccak256(payload);
      setMessageHash(messageHashed);
      setMessage(rawMessage);
      try {
        console.log('⌛ Signing and generating card... Please wait!');
        const messageBytes = ethers.utils.arrayify(messageHash);
        const signedValue = await signer.signMessage(messageBytes);
        setSignature(signedValue);
        const meta = {
          signature: signedValue,
          message: messageHash,
          ens: ens,
          toSign: message
        };
        try {
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
              console.log(data);
              setURI(data.signature);
              setSig(data.signature);
              if (sig !== signedValue) {
                window.alert('❌ Error! Signature mismatch!')
                setStatus('❌ Error! Signature mismatch!');
              } else {
                setNFT(data.image);
                setStatus(
                  <span>
                    <p>
                      {" "}
                      💾{" "}
                      <a target="_blank" rel="noreferrer" href={data.image}>
                        Card generated
                      </a>
                      ! Mint (or Sign again)
                    </p>
                  </span>
                );
              }
            });
        } catch (error) {
          setStatus('✋ Coming soon! We are still in Beta! ⌛');
          window.alert('✋ Coming soon! We are still in Beta! ⌛')
        }
      } catch (error) {
        setStatus("✅ Valid ENS! Click 'NEXT →' to Sign");
      }
    } else {
      setENS('.none');
      window.alert("❌ Provided ENS doesn't belong to 999, 10k, 100k, 24h or 0xdigit Clubs!");
      setStatus("❌ Provided ENS doesn't belong to 999, 10k, 100k, 24h or 0xdigit Clubs!");
    }
  };

  const onMintPressed = async () => {
    const { success, status } = await mintNFT(uri, ens, message, signature, messageHash);
    setStatus(status);
    if (success) {
      console.log('✅✅✅ NFT minted!');
      window.alert('✅✅✅ NFT minted!');
    } else {
      window.alert(status);
    }
  };

  return (
    <div className="Minter">
      <button id="sampleButton" onClick={goToHome}>
        HOME
      </button>
      <button id="sampleButton" onClick={goToGenerate}>
        SAMPLES
      </button>
      <button id="sampleButton" onClick={goToAlgorithm}>
        ALGORITHM
      </button>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>CONNECT WALLET</span>
        )}
      </button>
      <button id="disconnectButton" onClick={disconnectPressed}>
        SWITCH WALLET
      </button>
      <br></br>
      <h1 id="title">🚀 RARITY CARDS FOR DIGIT CLUBS</h1>
      <h2 className='blink_me'><span style={{ color: 'blue', fontSize: 20 }}>⚒️⚒️⚒️ CLICK 'SAMPLES' ↑ ↑ ↑ </span></h2>
      <img style={{ float: 'right', marginBottom: '20px' }} alt="sample" src={sample} width="337" height="400"/>
      <h3 style={{ marginTop: '10px' }}>→ STEP 1: CONNECT METAMASK <span style={{ color: 'blue', fontSize: 26 }}>[RINKEBY]</span> 🔌</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '15px' }}>⚠️ Connect with wallet that owns digit ENS name ⚠️</h4>
      <h3 style={{ marginTop: '10px' }}>→ STEP 2: ENTER AN <span style={{ color: 'blue' }}>ENS</span> NAME & SIGN A TIMESTAMP MESSAGE TO GENERATE CARD 🖊️</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '15px' }}>🖊️ Why Sign? 📝 Unique verifiable Signature will be printed on your card!</h4>
      <h3 style={{ marginTop: '10px' }}>→ STEP 3: MINT YOUR UNIQUE SIGNED CARD! 🖨️</h3>
      <div style={{ fontFamily:'SFMono' }}>
        <form style={{ marginBottom: '10px', width: '300px' }}>
          <input
            id="ens"
            type="text"
            placeholder="Enter ENS & Click on 'NEXT →'"
            onChange={(event) => setENS(event.target.value)}
            disabled
          />
        </form>
      </div>
      <h5 style={{ marginTop: '-5px', color: 'blue', fontSize: 14 }}>[999, 10k, 100k, 24h and 0xdigit Clubs only, e.g. 034.eth, 0x01397.eth, 05h11.eth etc]</h5>
      {!ens.endsWith(".eth") ? (
        <div>
          <button id="signButton" style={{ background: 'grey', color: 'white' }}>
            <span>NEXT →</span>
          </button>
        </div>
        ) : (
        <div>
          <button id="signButton" onClick={onSignPressed}>
            <span>NEXT →</span>
          </button>
        </div>
      )}
      {!message ? (
        <div>
          <button id="mintButton" style={{ background: 'grey', color: 'white' }}>
            Mint Card
          </button>
        </div>
        ) : (
        <div>
          <button id="mintButton" onClick={onMintPressed}>
            Mint Card
          </button>
        </div>
      )}
      {status ? (
        <div>
          <h5 id="status" style={{ position: 'absolute', color: 'blue' }} className='blink_me'>
            {status}
          </h5>
        </div>
        ) : (
        <p></p>
      )}
      {nft ? (
        <div><img style={{ marginTop: '100px', marginBottom: '-50px' }} alt="nft" src={nft} width="674" height="400"/></div>
        ) : (
        <p></p>
      )}
      <h1 style={{ marginTop: '150px' }}>FAQ:</h1>
      <h2 style={{ marginTop: '20px', marginLeft: '5px' }}>1. WHAT ARE RARITY CARDS FOR DIGIT CLUBS?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '15px' }}>Rarity cards assign rarity to ENS names in <span style={{ fontWeight: '600' }}>ENS</span>, 10k, 100k, 24h and 0xdigit clubs based on their mathematical properties. Each card is unique to an ENS name, printed with signature of the owning wallet, thereby making it conceptually SOULBOUND to an ENS name (aka TokenBound Token or TBT), but not contractually - yet. </h4>
      <h2 style={{ marginTop: '20px', marginLeft: '5px' }}>2. WHEN CAN I MINT?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '15px' }}>Soon! We are still in beta but it will not be long!</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '5px' }}>2. WHO CAN MINT?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '15px' }}>Wallet owning an ENS name in 999, 10k, 100k, 24h and 0xdigit club can mint! If you have multiple eligible names in your wallet, you'll get the option to mint them one by one.</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '5px' }}>3. WHAT CRITERIA ARE TESTED FOR RARITY?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '15px' }}>The algorithm checks for whether the number is even, odd, palindrome, has repeating, alternating or incrementing characters, and 69 types (honest conincidence) of primes! Types of Primes checked by the algorithm are: Balanced, Bell, Chen, Circular, Cousin, Cuban, Dihedral, Eisenstein, Emirp, Euclid, Factorial, Fermat, Fibonacci, Fortunate, Gaussian, Good, Happy, Harmonic, Higgs, Home, Irregular, Isolated, Leyland, Long, Lucas, Lucky, Mersenne, Repunit, Mills, Minimal, N4, Non-generous, Palindromic, Partition, Pell, Permutable, Perrin, Pierpoint, Pillai, Primeval, Primorial, Proth, Pythagorean, Quadruplet, Quartan, Ramanujan, Safe, Self, Sexy, Smarandache-Wellin, Solinas, Stern, Strobo-grammatic, Super-singular, Thabit, Two-sided, Triplet, Twin, Unique, Wagstaff, Weakly, Wilson, Wolstenholme and Woodall Primes.</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '5px' }}>4. ROADMAP?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '15px' }}>a) Incoming TokenBound Token, b) More clubs to be added, and more!</h4>
      <br></br>
      <br></br>
    </div>
  );
};

export default Minter;
