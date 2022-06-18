import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import {
  useSigner,
  useConnect,
  useSignMessage,
  useContractRead,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi';
import contractInterface from '../contract-abi.json';
import FlipCard, { BackCard, FrontCard } from '../components/FlipCard';
import { ethers } from 'ethers';

const contractConfig = {
  addressOrName: '0x86fbbb1254c39602a7b067d5ae7e5c2bdfd61a30',
  contractInterface: contractInterface,
};

const Home: NextPage = () => {
  const [totalMinted, setTotalMinted] = React.useState(0);
  const { isConnected, connectors } = useConnect();
  const isSigned = false;
  const timestamp = Date.now();
  // const raw = `${signer._address} signed this message at ${timestamp}`;
  const raw = 'Hello';
  const message = ethers.utils.solidityKeccak256(["string"],[raw]);
  const messageBytes = ethers.utils.arrayify(message);
  // const { data, isLoading, signMessage } = useSignMessage();
  try {
    const signature = signer.signMessage(messageBytes);
  } catch (error) {
    console.log(error);
  }
  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
  } = useContractWrite(contractConfig, 'mint');

  const { data: totalSupplyData } = useContractRead(
    contractConfig,
    'totalSupply',
    { watch: true }
  );

  const { isSuccess: txSuccess } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  React.useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }
  }, [totalSupplyData]);

  const isMinted = txSuccess;
  const genJob = async (meta: any) => {
    try {
      console.log(JSON.stringify(meta));
      const res = await fetch(
        "https://indexit.club:3001/write",
        {
          method: "post",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meta)
        }
      );
      // console.log(JSON.stringify(res));
      // window.alert(JSON.stringify(res));
    } catch (error) {
      let data = 0;
      window.alert('Coming soon! We are still in Beta!')
    }
  };

  return (
    <div className="page">
      <Head>
        <title>indexit.eth</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="logo.png" />
      </Head>
      <div className="container" style={{ marginBottom: 100, marginTop: 100 }}>
        <div>
          <div style={{ float: 'left', marginBottom: 0 }}>
            <ConnectButton />
          </div>
          <div style={{ padding: '24px 24px 24px 0' }}>
            {isConnected && message && !isSigned && (
              <button className="button" disabled={isLoading} style={{ marginLeft: '0%', marginTop: 24 }} onClick={() => {
                // signMessage({ message });
                console.log(raw);
                console.log(signature);
                genJob({
                  signature: signature,
                  message: message,
                  ens: '013'
                });
              }}
              >
                {isLoading ? 'Check Wallet' : 'Sign Card'}
              </button>
            )}
          </div>
        </div>
        <div>
          <div style={{ float: 'left', marginBottom: 0 }}>
            {isSigned && isConnected && !isMinted && (
              <button
                style={{ marginLeft: 0, marginTop: 0 }}
                disabled={isMintLoading || isMintStarted}
                className="button"
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => {
                  //mint();
                }}
                >
                  {isMintLoading && 'Waiting for approval'}
                  {isMintStarted && 'Minting...'}
                  {!isMintLoading && !isMintStarted && 'Mint Card'}
              </button>
            )}
          </div><br></br>
          <h1 style={{ float: 'left', marginTop: '20px' }}>Rarity Cards for Digit Clubs <span style={{ color: '#0062ff' }}>(COMING SOON!)</span></h1>
          <h2 style={{ marginTop: '10px' }}>Step 1: Connect Wallet</h2>
          <h3 style={{ marginTop: '10px', marginLeft: '10px' }}>Tip: You must collect with the wallet that owns your ENS name</h3>
          <h2 style={{ marginTop: '10px' }}>Step 2: Sign a message to generate card</h2>
          <h2 style={{ marginTop: '10px' }}>Step 3: Mint!</h2>
          <h3 style={{ marginTop: '10px', marginLeft: '10px' }}>Mint Price:</h3>
          <h3 style={{ marginTop: '05px', marginLeft: '15px' }}>0.03 ETH for 999 Club</h3>
          <h3 style={{ marginTop: '05px', marginLeft: '15px' }}>0.02 ETH for 10k Club</h3>
          <h3 style={{ marginTop: '05px', marginLeft: '15px' }}>0.01 ETH for 100k Club & 0xdigit Club</h3>
          <h2 style={{ marginTop: '50px' }}>FAQ:</h2>
          <h3 style={{ marginTop: '20px', marginLeft: '15px' }}>1. What are Rarity Cards for Digit Clubs?</h3>
          <h4 style={{ marginTop: '20px', marginLeft: '15px' }}>Rarity cards assign rarity to ENS names in 999, 10k, 100k and 0xdigit clubs based on their mathematical properties. Each card is unique to an ENS name, printed with signature of the owning wallet, thereby making it conceptually SOUNBOUND to an ENS name (aka TokenBound Token or TBT), but not contractually - yet. </h4>
          <h3 style={{ marginTop: '20px', marginLeft: '15px' }}>2. When can I mint?</h3>
          <h4 style={{ marginTop: '20px', marginLeft: '15px' }}>Soon! We are still in beta but it will not be long!</h4>
          <h3 style={{ marginTop: '20px', marginLeft: '15px' }}>3. What criteria are tested for rarity?</h3>
          <h4 style={{ marginTop: '20px', marginLeft: '15px' }}>The algorithm checks for whether the number is even, odd, palindrome and 69 types (honest conincidence) of primes! </h4>
          <h3 style={{ marginTop: '20px', marginLeft: '15px' }}>4. Roadmap?</h3>
          <h4 style={{ marginTop: '20px', marginLeft: '15px' }}>a) Incoming TokenBound Token, b) More clubs to be added, and more!</h4>
        </div>
      </div>
      <div style={{ flex: '0 0 auto', marginRight: 120, marginTop: -200 }}>
            <Image
              src="/samples.gif"
              width="421"
              height="500"
              alt='samples-gif'
            />
      </div>
      {/*<div style={{ flex: '0 0 auto', marginTop: 50, marginLeft: 10 }}>
        <FlipCard>
          <FrontCard isCardFlipped={isMinted}>
            <Image
              src="/samples.gif"
              width="421"
              height="500"
            />
          </FrontCard>
          <BackCard isCardFlipped={isMinted}>
            <div style={{ padding: 24 }}>
              <Image
                src="/nft.png"
                width="140"
                height="80"
                style={{ borderRadius: 0 }}
              />
              <h2 style={{ marginTop: 24, marginBottom: 6 }}>NFT Minted!</h2>
              <p style={{ marginBottom: 24 }}>
                Your NFT will show up in your wallet in the next few minutes.
              </p>
              <p style={{ marginBottom: 6 }}>
                View on{' '}
                <a href={`https://rinkeby.etherscan.io/tx/${mintData?.hash}`}>
                  Etherscan
                </a>
              </p>
              <p>
                View on{' '}
                <a
                  href={`https://testnets.opensea.io/assets/rinkeby/${mintData?.to}/1`}
                >
                  OpenSea
                </a>
              </p>
            </div>
          </BackCard>
        </FlipCard>
      </div>*/}
    </div>
  );
};

export default Home;
