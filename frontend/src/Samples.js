import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import sample from "./img/samples.gif";

const Samples = (props) => {
  const [ens, setENS] = useState("");
  const [status, setStatus] = useState("");
  const [nftFront, setNFTFront] = useState("");
  const [nftBack, setNFTBack] = useState("");
  let navigate = useNavigate();
  useEffect((status) => {
    return () => {
      setStatus(status);
    }
  }, []);

  function isMobileDevice() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
  }
  const isMobile = isMobileDevice();

  const goToHome = () =>{
    let path = `/minter`
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
    var hasNonAscii = !/^[\u0000-\u007f]*$/.test(digit);
    var isArabic = [...digit].every(item => arabic.includes(item));
    var isHindi = [...digit].every(item => hindi.includes(item));
    var isChinese = [...digit].every(item => chinese.includes(item));
    var isKorean = [...digit].every(item => korean.includes(item));
    var isPersian = [...digit].every(item => persian.includes(item));
    var isRoman = /^(m{1,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})|m{0,4}(cm|c?d|d?c{1,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})|m{0,4}(cm|cd|d?c{0,3})(xc|x?l|l?x{1,3})(ix|iv|v?i{0,3})|m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|i?v|v?i{1,3}))$/.test(digit.toLowerCase());

    if (
      (
        !isRoman && hasNonAscii &&
        (
          (digit.length >= 3 && digit.length <= 5 && isArabic) || (digit.length >= 3 && digit.length <= 5 && isHindi) || (digit.length >= 3 && digit.length <= 5 && isChinese) || (digit.length >= 3 && digit.length <= 5 && isKorean) || (digit.length >= 3 && digit.length <= 5 && isPersian)
        )
      ) ||
      (
        isRoman && !hasNonAscii &&
        (
          parseRoman(digit) < 4000
        ) && digit.length >= 3 && digit.length <= 15
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
      setENS(`${digit}.eth`);
      setStatus('⌛ Generating card... please wait! (up to 60 seconds)');

      try {
        console.log('⌛ Generating card... please wait!');
        const timestamp = Date.now();
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

        const meta = {
          signature: '0xfuckthisfuckwhyfuckberaswagmigmgmgmgmggmygmigmiaaauuurrgggggoblintownsaylordokwon3acsuzhucelsiusmarkrektlolallwhyplshelpmafamiliia',
          message: '0xwenmoonwenlambowenmonieshelpsirpleasengmimcdonaldsmcafeesamsifuo',
          ens: ens,
          trans: trans + '.eth',
          lang: lang,
          toSign: `Signed by ${digit}.eth at time ${timestamp}`,
          prompt: 'sample'
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
              if (data.image === 'empty') {
                setStatus('✋ Slow down champ! Let the previous request finish ⌛');
                window.alert('✋ Slow down champ! Let the previous request finish ⌛')
              } else if (data.image === 'reset') {
                setStatus('❌ Your card could not be generated. Devs have been told 🥴');
                window.alert('❌ Your card could not be generated. Devs have been told 🥴')
              } else if (data.image === 'exists' || data.image.startsWith('https')) {
                const urlImg = data.link.slice(0, -4);
                setNFTFront(urlImg + '-Front.png');
                setNFTBack(urlImg + '-Back.png');
                setStatus('✅ Card generated! See below.');
              } else {
                setStatus('❌ Unknown error! Try again ⌛');
                window.alert('❌ Unknown error! Try again ⌛')
              }
            });
        } catch (error) {
          setStatus('✋ Hold up! Backend is not reachable. Try later ⌛');
          window.alert('✋ Hold up! Backend is not reachable. Try later ⌛')
        }
      } catch (error) {
        setStatus("✅ Valid ENS! Click 'NEXT ▶▶▶' to generate");
      }
    } else {
      setENS('.none');
      window.alert("❌ Provided ENS doesn't belong to 999, 10k, 100k, SPQR, 24h or 0xdigit Clubs!");
      setStatus("❌ Provided ENS doesn't belong to 999, 10k, 100k, SPQR, 24h or 0xdigit Clubs!");
    }
  }
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
      <br></br><br></br>
      <img style={{ float: 'right', marginBottom: '20px', marginTop: '30px' }} alt="sample" src={sample} width="337" height="400"/>
      <br></br><br></br>
      <h1 id="title" style={{ marginTop: '100px' }}>🚀 RARITY CARDS FOR DIGIT CLUBS</h1>
      <h4 style={{ marginTop: '10px', marginLeft: '10px' }}><span style={{ fontSize: 30 }}>🎁 </span>enter ens name & generate a sample unsigned card</h4>
      <form style={{ marginBottom: '10px', width: '300px', marginLeft: '10px' }}>
        <input
          id="ens"
          type="text"
          placeholder="Enter ENS & Click on 'NEXT ▶▶▶'"
          onChange={(event) => setENS(event.target.value)}

        />
      </form>
      <h6 style={{ marginTop: '-8px', color: 'black', marginLeft: '10px', fontFamily: 'SFMono', fontSize: 15, fontWeight: 100 }}>999, 10k, 100k (english/العربية/देवनागरी/中国人/한국인/فارسی), 24h, 0xdigit, Roman</h6>
      <h6 style={{ marginTop: '-38px', color: 'black', marginLeft: '20px', fontFamily: 'SFMono', fontSize: 12, fontWeight: 100 }}>✓ 034.eth, ٢٣٢٣٤.eth, ४५६७.eth, 四五六七.eth, 육구구오.eth, ۳۵۴.eth, 05h11.eth, 0x01397.eth, dcccxxxix.eth</h6>
      {!ens.endsWith(".eth") ? (
        <div>
          <button id="signButton" style={{ background: 'grey', color: 'white', marginLeft: '10px' }}>
            <span>🔒 NEXT</span>
          </button>
        </div>
        ) : (
        <div>
          <button id="signButton" onClick={onGeneratePressed} style={{ marginLeft: '10px' }}>
            <span>NEXT ▶▶▶</span>
          </button>
        </div>
      )}
      <br></br>
      {status ? (
        <div className='errorbox' style={{marginTop: '50px', marginBottom: '100px'}}>
          {status.toString().toLowerCase()}
        </div>
        ) : (
        <p></p>
      )}
      <br></br>
      {nftFront && nftBack ? (
        <div style={{ float: 'left', marginLeft: '10px', marginTop: '100px', marginBottom: '100px' }}>
          <img alt="nftfront" src={nftFront} width="337"/>
          <img alt="nftback" src={nftBack} width="337"/>
        </div>
        ) : (
        <p></p>
      )}
      <br></br>
      <p></p>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <span style={{ fontFamily: 'Major Mono Display', fontSize: '14px', fontWeight: 600, marginLeft: '10%' }}>twitter: <a style={{ color: 'black', textDecoration: 'none' }} href="https://twitter.com/indexit_eth" target='_blank' rel="noreferrer">@indexit_eth</a></span>
      <br></br>
    </div>
  );
}

export default Samples;
