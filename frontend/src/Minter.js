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
          setStatus("👆🏽 Enter ENS & click 'NEXT →'");
        } else {
          setWallet("");
          setStatus("🦊 Connect to MetaMask using 'Connect Wallet' button");
        }
      });
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
      (digit.length === 5 && digit.substring(2,3) === "h" && ( (/^[0-1]+$/.test(digit.substring(0,1)) && /^[0-9]+$/.test(digit.substring(1,2))) || (/^[2-2]+$/.test(digit.substring(0,1)) && /^[0-9]+$/.test(digit.substring(1,2))) ) && /^[0-5]+$/.test(digit.substring(3,4)) && /^[0-9]+$/.test(digit.substring(4,5))) ||
      (digit.length >= 3 && digit.length <= 5 && /^[0-9]+$/.test(digit)) ||
      (digit.length >= 3 && digit.length <= 7 && digit.startsWith("0x") && /^[0-9]+$/.test(digit.substring(2)))
    ) {
      setStatus('⌛ Checking ENS digit ownership... please wait!');
      var nameList = [];
      await fetch(`https://api.opensea.io/api/v1/assets?owner=${walletAddress}`)
        .then(response => response.json())
        .then(data => {
          var i = 0;
          for (i = 0; i < data.assets.length; i++){
            nameList.push(data.assets[i].name);
          }
      })
      
      if ( nameList.includes(`${digit}.eth`) ) {
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
            toSign: message,
            prompt: 'mint'
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
                if (data.signature !== signedValue) {
                  if (data.signature !== 'wait') {
                    window.alert('✋ Slow down champ! Let the previous request finish ⌛')
                    setStatus('✋ Slow down champ! Let the previous request finish ⌛');
                  } else if (data.signature !== 'reset') {
                    window.alert('❌ Your card could not be generated. Devs have been woken 🥴')
                    setStatus('❌ Your card could not be generated. Devs have been woken 🥴');
                  } else {
                    window.alert('❌ Error! Signature mismatch!')
                    setStatus('❌ Error! Signature mismatch!');
                  }
                } else if (data.image === 'empty') {
                    setStatus('✋ Slow down champ! Let the previous request finish ⌛');
                    window.alert('✋ Slow down champ! Let the previous request finish ⌛')
                } else if (data.image === 'reset') {
                  setStatus('❌ Your card could not be generated. Devs have been woken 🥴');
                  window.alert('❌ Your card could not be generated. Devs have been woken 🥴')
                } else {
                  setNFT(data.image);
                  setStatus('💾 Card generated! Mint (or Sign again)');
                }
              });
          } catch (error) {
            setStatus('✋ Coming soon! We are still in Beta! ⌛');
            window.alert('✋ Coming soon! We are still in Beta! ⌛')
          }
        } else {
          setStatus("✅ Valid ENS! Click 'NEXT →' to Sign");
        }
      } else {
        window.alert('❌ You are not the owner of this ENS digit ✋')
        setStatus('❌ You are not the owner of this ENS digit ✋');
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
      console.log('✅✅✅ Transaction Sent!');
      window.alert('✅✅✅ Transaction Sent!');
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
      {!walletAddress ? (
        <button id="disconnectButton" style={{ background: 'grey', color: 'white' }}>
          SWITCH WALLET
        </button>
      ) : (
        <button id="disconnectButton" onClick={disconnectPressed}>
          SWITCH WALLET
        </button>
      )}
      <br></br>
      <h1 id="title" style={{ marginTop: '100px' }}>🚀 RARITY CARDS FOR DIGIT CLUBS</h1>
      <img style={{ float: 'right', marginBottom: '20px' }} alt="sample" src={sample} width="337" height="400"/>
      <h3 style={{ marginTop: '10px', marginLeft: '20px' }}><span style={{ fontSize: 30 }}>🦊 </span>  connect metamask (goerli)</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '30px' }}>Connect with wallet that owns digit name</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '20px' }}><span style={{ fontSize: 30 }}>🕙 </span>  sign a timestamp to generate card</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '30px' }}>Why Sign? Unique verifiable Signature will be printed on your card!</h4>
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
          <form style={{ marginBottom: '10px', width: '300px' }}>
            <input
              id="ens"
              type="text"
              placeholder="Enter ENS & Click on 'NEXT →'"
              onChange={(event) => setENS(event.target.value)}
            />
          </form>
        </div>
      )}
      <h5 style={{ marginTop: '-8px', color: 'blue', fontSize: 15, marginLeft: '30px', fontFamily: 'SFMono', fontWeight: 15 }}>999, 10k, 100k, 24h and 0xdigit Clubs only,</h5>
      <h5 style={{ marginTop: '-28px', color: 'blue', fontSize: 15, marginLeft: '30px', fontFamily: 'SFMono', fontWeight: 15 }}>e.g. 034.eth, 0x01397.eth, 05h11.eth etc</h5>
      {!ens.endsWith(".eth") || !walletAddress ? (
        <div style={{ marginleft: '60px' }}>
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
      {!nft || !walletAddress ? (
        <div style={{ marginleft: '15px' }}>
          <button id="mintButton" style={{ background: 'grey', color: 'white' }}>
            MINT
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
        <div><img style={{ marginTop: '100px', marginBottom: '5px', marginLeft: '20px' }} alt="nft" src={nft} width="674" height="400"/></div>
        ) : (
        <p></p>
      )}
      <h1 style={{ marginTop: '250px' }}>FAQ:</h1>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>1. WHAT ARE RARITY CARDS FOR DIGIT CLUBS?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>Rarity cards assign rarity to ENS names in 999, 10k, 100k, 24h and 0xdigit clubs based on their mathematical properties. Each card is unique to an ENS name, printed with signature of the owning wallet, thereby making it conceptually SOULBOUND to an ENS name (aka TokenBound Token or TBT), but not contractually - yet. </h4>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>2. WHEN CAN I MINT?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>Soon! We are still in beta but it will not be long! In the meantime, you can test the mint on Goerli Testnet!</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>2. WHO CAN MINT?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>Wallet owning an ENS name in 999, 10k, 100k, 24h and 0xdigit club can mint! You can only mint the card for an ENS digit that you own.</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>3. WHAT CRITERIA ARE TESTED FOR RARITY?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>The algorithm checks for whether the number is even, odd, palindrome, has repeating, alternating or incrementing characters, and 69 types (honest conincidence) of primes! Types of Primes checked by the algorithm are: Balanced, Bell, Chen, Circular, Cousin, Cuban, Dihedral, Eisenstein, Emirp, Euclid, Factorial, Fermat, Fibonacci, Fortunate, Gaussian, Good, Happy, Harmonic, Higgs, Home, Irregular, Isolated, Leyland, Long, Lucas, Lucky, Mersenne, Repunit, Mills, Minimal, N4, Non-generous, Palindromic, Partition, Pell, Permutable, Perrin, Pierpoint, Pillai, Primeval, Primorial, Proth, Pythagorean, Quadruplet, Quartan, Ramanujan, Safe, Self, Sexy, Smarandache-Wellin, Solinas, Stern, Strobo-grammatic, Super-singular, Thabit, Two-sided, Triplet, Twin, Unique, Wagstaff, Weakly, Wilson, Wolstenholme and Woodall Primes.</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>4. ROADMAP?</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}>a) Incoming TokenBound Token, b) More clubs to be added, and more!</h4>
      <br></br>
      <br></br>
      <span style={{ fontFamily: 'Major Mono Display', fontSize: '14px', fontWeight: 600, marginLeft: '10%' }}>twitter: <a style={{ color: 'blue', textDecoration: 'none' }} href="https://twitter.com/indexit_eth" target='_blank' rel="noreferrer">@indexit_eth</a></span>
      <br></br>
    </div>
  );
};

export default Minter;
