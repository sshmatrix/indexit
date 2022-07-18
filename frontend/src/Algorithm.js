import { useNavigate } from "react-router-dom";
import algorithm from "./img/algorithm.png";

const Algorithm = (props) => {

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
      <br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br>
      <img style={{ float: 'right', marginLeft: '100px', marginBottom: '30px'  }} alt="sample" src={algorithm} height="700"/>
      <h2 style={{ marginTop: '20px', marginLeft: '10px' }}>📓 CONTRACT</h2>
      <h3 style={{ marginTop: '20px', marginLeft: '30px' }}>iigenesis (iig)</h3>
      <h4 style={{ marginTop: '20px', marginLeft: '30px' }}><a style={{ color: 'blue', textDecoration: 'none' }} href="https://etherscan.io/address/0x14ab45f6edc154e338e27f8d1d2a7cad4ed62ec2" target='_blank' rel="noreferrer">0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>14ab45f6edc154e338e27f8d1d2a7cad4ed62ec2</a> (on-chain erc721)</h4>
      <h2 style={{ marginTop: '10px', marginLeft: '5px' }}>📓 CLUBS SO FAR</h2>
      <h4 style={{ marginTop: '2px', marginLeft: '15px' }}><span style={{ fontWeight: 600 }}>999, 10k & 100k</span> (<span style={{ fontWeight: 200 }}>中国人</span>/english/العربية/<span style={{ fontWeight: 200 }}>देवनागरी</span>), <span style={{ fontWeight: 600 }}>24h</span>, <span style={{ fontWeight: 600 }}>0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>digit</span>, roman clubs</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '5px' }}>📓 CLUBS COMING SOON</h2>
      <h4 style={{ marginTop: '2px', marginLeft: '15px' }}><span style={{ fontWeight: 600 }}>hebrew</span>, <span style={{ fontWeight: 600 }}>korean</span> digits</h4>
      <h2 style={{ marginTop: '10px', marginLeft: '5px' }}>📓 ABOUT THE TRAITS</h2>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 index</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> if a digit is <span style={{ fontWeight: 600 }}>odd</span> and <span style={{ fontWeight: 600 }}>prime</span>, it is assigned <span style={{ fontWeight: 600 }}>index 1.0 (highest)</span>, otherwise it is assigned <span style={{ fontWeight: 600 }}>index 0.0 (lowest)</span>. if a digit is <span style={{ fontWeight: 600 }}>even</span> but its <span style={{ fontWeight: 600 }}>half is a prime</span>, then it is assigned <span style={{ fontWeight: 600 }}>index 0.5 (mid-tier)</span>, otherwise it is assigned <span style={{ fontWeight: 600 }}>index 0 (lowest)</span>. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 odd</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> if a digit is <span style={{ fontWeight: 600 }}>odd</span>. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 even</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> if a digit is <span style={{ fontWeight: 600 }}>even</span>.</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 palindrome</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> if a digit is a <span style={{ fontWeight: 600 }}>palindrome</span>.</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 prime</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> if a digit is <span style={{ fontWeight: 600 }}>prime</span>.</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 prime count</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> number of <span style={{ fontWeight: 600 }}>prime types/families</span> that the digit is member of. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 prime form</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> An abbreviation showing the different memberships in the form <span style={{ fontWeight: 600 }}>n<sub>k</sub></span>, where <span style={{ fontWeight: 600 }}>n is the initial of family name</span>, and <span style={{ fontWeight: 600 }}>c is the number of memberships</span> corresponding to n. for instance, if a digit is of type bell, balanced, chen but not higgs, then it will have a form of b<sub>2</sub>c<sub>1</sub>h<sub>0</sub>. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 repeating</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> ratio between <span style={{ fontWeight: 600 }}>maximum repetitions of a character</span> (after removing '0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>' and 'h', if applicable) and the length of ens name, i.e. 02323.eth → 0.4, 01234 → <span style={{ fontWeight: 600 }}>0.2 (lowest)</span>, 0000.eth → <span style={{ fontWeight: 600 }}>1.0 (highest)</span> etc. Ratio is rounded to one decimal. note: for 0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>digit and 24h clubs, '0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>' and 'h' are removed before calculating the numerator, i.e. 0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>0000.eth → 0.7, 23h21.eth → 0.4 etc.</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 alternating</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> if the name has <span style={{ fontWeight: 600 }}>strictly alternating characters</span> (after removing '0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>' and 'h', if applicable), e.g. 01010.eth, 0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>7575.eth, 13h13.eth, 121.eth etc. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📊 incrementing</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> if the <span style={{ fontWeight: 600 }}>difference between successive characters is a constant</span> positive or negative number (after removing '0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>' and 'h', if applicable), e.g. 321.eth, 1357.eth, 0<span style={{ fontFamily: 'SFMono', fontWeight: 400 }}>x</span>2468.eth, 23h45.eth, 97531.eth etc. </h4>
      <h2 style={{ marginTop: '10px', marginLeft: '5px' }}>📓 TYPES OF PRIMES</h2>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> the algorithm checks for <span style={{ fontWeight: 600 }}>69 types of primes</span>. these primes are:</h4>
      <h5 style={{ marginTop: '10px', marginLeft: '20px' }}>balanced<br></br> bell<br></br> chen<br></br> circular<br></br> cousin<br></br> cuban<br></br> dihedral<br></br> eisenstein<br></br> emirp<br></br> euclid<br></br> factorial<br></br> fermat<br></br> fibonacci<br></br> fortunate<br></br> gaussian<br></br> good<br></br> happy<br></br> harmonic<br></br> higgs<br></br> home<br></br> irregular<br></br> isolated<br></br> leyland<br></br> long<br></br> lucas<br></br> lucky<br></br> mersenne<br></br> repunit<br></br> mills<br></br> minimal<br></br> n4<br></br> non-generous<br></br> palindromic<br></br> partition<br></br> pell<br></br> permutable<br></br> perrin<br></br> pierpoint<br></br> pillai<br></br> primeval<br></br> primorial<br></br> proth<br></br> pythagorean<br></br> quadruplet<br></br> quartan<br></br> ramanujan<br></br> safe<br></br> self<br></br> sexy<br></br> smarandache-wellin<br></br> solinas<br></br> stern<br></br> strobo-grammatic<br></br> super-singular<br></br> thabit<br></br> two-sided<br></br> triplet<br></br> twin<br></br> unique<br></br> wagstaff<br></br> weakly<br></br> wilson<br></br> wolstenholme<br></br> woodall</h5>
      <h2 style={{ marginTop: '20px', marginLeft: '05px' }}>📓 NEWS & UPDATES</h2>
      <h4 style={{ marginTop: '20px', marginLeft: '20px' }}>✅ 29/06/2022: contract deployed</h4>
      <h4 style={{ marginTop: '20px', marginLeft: '20px' }}>⚠️ 29/06/2022: bug reported during mainnet testing in backend queuing</h4>
      <h6 style={{ marginTop: '01px', marginLeft: '50px' }}>️‍❗ affected tokenid: 0-7, metadata-image mismatch</h6>
      <h6 style={{ marginTop: '01px', marginLeft: '50px' }}>⚙️ fix implemented</h6>
      <h4 style={{ marginTop: '20px', marginLeft: '20px' }}>⚠️ 29/06/2022: bug reported in opensea rendering</h4>
      <h6 style={{ marginTop: '01px', marginLeft: '50px' }}>️‍❗ affected tokenid: 0-11, 1:1 aspect ratio not rendered</h6>
      <h6 style={{ marginTop: '01px', marginLeft: '50px' }}>⚙️ fix implemented</h6>
      <h4 style={{ marginTop: '20px', marginLeft: '20px' }}>✅ 29/06/2022: dynamic metadata implemented </h4>
      <h4 style={{ marginTop: '20px', marginLeft: '20px' }}>🚀 30/06/2022: launch! </h4>
      <h4 style={{ marginTop: '20px', marginLeft: '20px' }}>✅ 03/07/2022: العربية and <span style={{ fontWeight: 200 }}>देवनागरी </span> support added to 999, 10k and 100k clubs </h4>
      <h4 style={{ marginTop: '20px', marginLeft: '20px' }}>✅ 04/07/2022: <span style={{ fontWeight: 200 }}>中国人</span> clubs and roman (spqr) clubs supported </h4>
      <br></br>
      <span style={{ fontFamily: 'Major Mono Display', fontSize: '14px', fontWeight: 600, marginLeft: '10%' }}>twitter: <a style={{ color: 'blue', textDecoration: 'none' }} href="https://twitter.com/indexit_eth" target='_blank' rel="noreferrer">@indexit_eth</a></span>
    </div>
  );
};

export default Algorithm;
