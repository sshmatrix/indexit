import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import sample from "./img/samples.gif";

const Samples = (props) => {
  const [ens, setENS] = useState("");
  const [status, setStatus] = useState("");
  const [nftFront, setNFTFront] = useState("");
  const [nftBack, setNFTBack] = useState("");

  useEffect((status) => {
    return () => {
      setStatus(status);
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

  const onGeneratePressed = async () => {
    setStatus('Processing... ⌛');
    var digit = ens.slice(0, -4);
    if (
      (digit.length === 5 && digit.substring(2,3) === "h" && /^[0-9]+$/.test(digit.substring(0,2)) && /^[0-9]+$/.test(digit.substring(3,5))) ||
      (digit.length >= 3 && digit.length <= 5 && /^[0-9]+$/.test(digit)) ||
      (digit.length >= 3 && digit.length <= 7 && digit.startsWith("0x") && /^[0-9]+$/.test(digit.substring(2)))
    ) {
      setENS(`${digit}.eth`);
      setStatus('⌛ Generating card... Please wait! (5 digits can take up to 60 seconds)');

      try {
        console.log('⌛ Generating card... Please wait!');
        const meta = {
          signature: ens,
          message: '0xwenmoonwenlambowenmonieshelpsirpleasengmimcdonaldsmcafeesamsifuo',
          ens: ens,
          toSign: 'Sample Rarity Cards'
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
              if (data.image === 'empty') {
                setStatus('✋ Slow down champ! Let the previous request finish ⌛');
                window.alert('✋ Slow down champ! Let the previous request finish ⌛')
              } else {
                const urlImg = data.image.slice(0, -4);
                setNFTFront(urlImg + '-Front.png');
                setNFTBack(urlImg + '-Back.png');
                setStatus('✅ Card Generated! See below.');
              }
            });
        } catch (error) {
          setStatus('✋ Coming soon! We are still in Beta! ⌛');
          window.alert('✋ Coming soon! We are still in Beta! ⌛')
        }
      } catch (error) {
        setStatus("✅ Valid ENS! Click 'NEXT →' to Generate");
      }
    } else {
      setENS('.none');
      window.alert("❌ Provided ENS doesn't belong to 999, 10k, 100k, 24h or 0xdigit Clubs!");
      setStatus("❌ Provided ENS doesn't belong to 999, 10k, 100k, 24h or 0xdigit Clubs!");
    }
  }
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

      <br></br>
      <h1 id="title">🚀 SAMPLE RARITY CARDS FOR DIGIT CLUBS</h1>
      <img style={{ float: 'right', marginBottom: '20px' }} alt="sample" src={sample} width="337" height="400"/>
      <h3 style={{ marginTop: '10px' }}>→ STEP 1: ENTER AN <span style={{ color: 'blue' }}>ENS</span> NAME & GENERATE A SAMPLE UNSIGNED CARD 🖊️</h3>
      <form style={{ marginBottom: '10px', width: '300px' }}>
        <input
          id="ens"
          type="text"
          placeholder="Enter ENS & Click on 'NEXT →'"
          onChange={(event) => setENS(event.target.value)}
        />
      </form>
      <h5 style={{ marginTop: '-5px', color: 'blue', fontSize: 14 }}>[999, 10k, 100k, 24h and 0xdigit Clubs only, e.g. 034.eth, 0x01397.eth, 05h11.eth etc]</h5>
      {!ens.endsWith(".eth") ? (
        <div>
          <button id="signButton" style={{ background: 'grey', color: 'white' }}>
            <span>NEXT →</span>
          </button>
        </div>
        ) : (
        <div>
          <button id="signButton" onClick={onGeneratePressed}>
            <span>NEXT →</span>
          </button>
        </div>
      )}
      <br></br>
      {status ? (
        <div style={{marginBottom: '100px'}}>
          <h5 id="status" style={{ position: 'absolute', color: 'blue' }} className='blink_me'>
            {status}
          </h5>
        </div>
        ) : (
        <p></p>
      )}
      {nftFront && nftBack ? (
        <div>
          <img alt="nftfront" src={nftFront} width="337" height="400"/>
          <img alt="nftback" src={nftBack} width="337" height="400"/>
        </div>
        ) : (
        <p></p>
      )}
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
    </div>
  );
}

export default Samples;
