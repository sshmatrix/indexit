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
        HOME
      </button>
      <button id="sampleButton" onClick={goToGenerate}>
        SAMPLES
      </button>
      <button id="sampleButton" onClick={goToAlgorithm}>
        ALGORITHM
      </button>
      <br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br>
      <img style={{ float: 'right', marginLeft: '100px', marginBottom: '30px'  }} alt="sample" src={algorithm} height="700"/>
      <h2 style={{ marginTop: '10px', marginLeft: '5px' }}>💡 CLUBS SO FAR</h2>
      <h4 style={{ marginTop: '2px', marginLeft: '10px' }}><span style={{ fontWeight: 600 }}>999</span>, <span style={{ fontWeight: 600 }}>10k</span>, <span style={{ fontWeight: 600 }}>100k</span>, <span style={{ fontWeight: 600 }}>24h</span> & <span style={{ fontWeight: 600 }}>0xdigit</span> clubs</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '5px' }}>💡 CLUBS COMING SOON</h2>
      <h4 style={{ marginTop: '2px', marginLeft: '10px' }}><span style={{ fontWeight: 600 }}>Arabic</span> Digits</h4>
      <h2 style={{ marginTop: '10px', marginLeft: '5px' }}>💡 ABOUT THE TRAITS</h2>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 index</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> If a digit is <span style={{ fontWeight: 600 }}>Odd</span> and <span style={{ fontWeight: 600 }}>Prime</span>, it is assigned <span style={{ fontWeight: 600 }}>Index 1.0 (highest)</span>, otherwise it is assigned <span style={{ fontWeight: 600 }}>Index 0.0 (lowest)</span>. If a digit is <span style={{ fontWeight: 600 }}>Even</span> but its <span style={{ fontWeight: 600 }}>half is a Prime</span>, then it is assigned <span style={{ fontWeight: 600 }}>Index 0.5 (mid-tier)</span>, otherwise it is assigned <span style={{ fontWeight: 600 }}>Index 0 (lowest)</span>. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 odd</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> If a digit is <span style={{ fontWeight: 600 }}>Odd</span>. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 even</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> If a digit is <span style={{ fontWeight: 600 }}>Even</span>.</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 palindrome</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> If a digit is a <span style={{ fontWeight: 600 }}>Palindrome</span>.</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 prime</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> If a digit is <span style={{ fontWeight: 600 }}>Prime</span>.</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 prime count</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> Number of <span style={{ fontWeight: 600 }}>Prime types/families</span> that the digit is member of. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 prime form</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> An abbreviation showing the different memberships in the form <span style={{ fontWeight: 600 }}>N<sub>K</sub></span>, where <span style={{ fontWeight: 600 }}>N is the initial of family name</span>, and <span style={{ fontWeight: 600 }}>C is the number of memberships</span> corresponding to N. For instance, if a  is of type Bell, Balanced, Chen but not Higgs, then it will have a form of B<sub>2</sub>C<sub>1</sub>H<sub>0</sub>. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 repeating</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> Ratio between <span style={{ fontWeight: 600 }}>maximum repetitions of a character</span> (after removing '0x' and 'h', if applicable) and the length of ENS name, i.e. 02323.eth → 0.4, 01234 → <span style={{ fontWeight: 600 }}>0.2 (lowest)</span>, 0000.eth → <span style={{ fontWeight: 600 }}>1.0 (highest)</span> etc. Ratio is rounded to one decimal. Note: for 0xdigit and 24h clubs, '0x' and 'h' are removed before calculating the numerator, i.e. 0x0000.eth → 0.7, 23h21.eth → 0.4 etc.</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 alternating</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> If the name has <span style={{ fontWeight: 600 }}>strictly alternating characters</span> (after removing '0x' and 'h', if applicable), e.g. 01010.eth, 0x7575.eth, 13h13.eth, 121.eth etc. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '15px' }}>📋 incrementing</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> If the <span style={{ fontWeight: 600 }}>difference between successive characters is a constant</span> positive or negative number (after removing '0x' and 'h', if applicable), e.g. 321.eth, 1357.eth, 0x2468.eth, 23h45.eth, 97531.eth etc. </h4>
      <h2 style={{ marginTop: '10px', marginLeft: '5px' }}>💡 TYPES OF PRIMES</h2>
      <h4 style={{ marginTop: '10px', marginLeft: '20px' }}> The algorithm checks for <span style={{ fontWeight: 600 }}>69 types of Primes</span>. These Primes are: Balanced, Bell, Chen, Circular, Cousin, Cuban, Dihedral, Eisenstein, Emirp, Euclid, Factorial, Fermat, Fibonacci, Fortunate, Gaussian, Good, Happy, Harmonic, Higgs, Home, Irregular, Isolated, Leyland, Long, Lucas, Lucky, Mersenne, Repunit, Mills, Minimal, N4, Non-generous, Palindromic, Partition, Pell, Permutable, Perrin, Pierpoint, Pillai, Primeval, Primorial, Proth, Pythagorean, Quadruplet, Quartan, Ramanujan, Safe, Self, Sexy, Smarandache-Wellin, Solinas, Stern, Strobo-grammatic, Super-singular, Thabit, Two-sided, Triplet, Twin, Unique, Wagstaff, Weakly, Wilson, Wolstenholme and Woodall Primes.</h4>
      <br></br>
      <span style={{ fontFamily: 'Major Mono Display', fontSize: '14px', fontWeight: 600, marginLeft: '10%' }}>twitter: <a style={{ color: 'blue', textDecoration: 'none' }} href="https://twitter.com/indexit_eth" target='_blank' rel="noreferrer">@indexit_eth</a></span>
    </div>
  );
};

export default Algorithm;
