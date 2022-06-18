import { useNavigate } from "react-router-dom";

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
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <h2 style={{ marginTop: '10px', marginLeft: '5px' }}>💡 CLUBS SO FAR</h2>
      <h4 style={{ marginTop: '2px', marginLeft: '60px' }}>999, 10k, 100k, 24h & 0xdigit</h4>
      <h2 style={{ marginTop: '20px', marginLeft: '5px' }}>💡 CLUBS COMING SOON</h2>
      <h4 style={{ marginTop: '2px', marginLeft: '60px' }}>Arabic Digits</h4>
      <h2 style={{ marginTop: '10px', marginLeft: '5px' }}>💡 ABOUT THE TRAITS</h2>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 INDEX</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> If a digit is odd and prime, it is assigned Index 1 (highest), otherwise it is assigned Index 0 (lowest). If a digit is even but its half is a prime, then it is assigned Index 0.5 (mid-tier), otherwise it is assigned Index 0 (lowest). </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 ODD</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> If a digit is odd. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 EVEN</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> If a digit is odd. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 PALINDROME</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> If a digit is a palindrome. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 PRIME</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> If a digit is prime. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 PRIME COUNT</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> Number of prime types/families that the digit is member of. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 PRIME FORM</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> An abbreviation showing the different prime memberships in the form N<sub>K</sub>, where N is the initial of prime family name, and C is the number of memberships corresponding to N. For instance, if a prime is of type Bell, Balanced, Chen but not Higgs, then it will have a form of B<sub>2</sub>C<sub>1</sub>H<sub>0</sub>. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 REPEATING</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> Ratio between maximum repetitions of a character (after removing '0x' and 'h', if applicable) and the length of ENS name, i.e. 02323.eth → 0.4, 01234 → 0.2 (lowest), 0000.eth → 1.0 (highest) etc. Ratio is rounded to one decimal. Note: for 0xdigit and 24h clubs, '0x' and 'h' are removed before calculating the numerator, i.e. 0x0000.eth → 0.7, 23h21.eth → 0.4 etc.</h4>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 ALTERNATING</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> If the name has strictly alternating characters (after removing '0x' and 'h', if applicable), e.g. 01010.eth, 0x7575.eth, 13h13.eth, 121.eth etc. </h4>
      <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>📋 INCREMENTING</h3>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> If the difference between successive characters is a positive or negative but constant number (after removing '0x' and 'h', if applicable), e.g. 321.eth, 1357.eth, 0x2468.eth, 23h45.eth, 97531.eth etc. </h4>
      <h2 style={{ marginTop: '10px', marginLeft: '5px' }}>💡 TYPES OF PRIMES</h2>
      <h4 style={{ marginTop: '10px', marginLeft: '100px' }}> The algorithm checks for whether the number is even, odd, palindrome and 69 types of primes. These primes are: Balanced, Bell, Chen, Circular, Cousin, Cuban, Dihedral, Eisenstein, Emirp, Euclid, Factorial, Fermat, Fibonacci, Fortunate, Gaussian, Good, Happy, Harmonic, Higgs, Home, Irregular, Isolated, Leyland, Long, Lucas, Lucky, Mersenne, Repunit, Mills, Minimal, N4, Non-generous, Palindromic, Partition, Pell, Permutable, Perrin, Pierpoint, Pillai, Primeval, Primorial, Proth, Pythagorean, Quadruplet, Quartan, Ramanujan, Safe, Self, Sexy, Smarandache-Wellin, Solinas, Stern, Strobo-grammatic, Super-singular, Thabit, Two-sided, Triplet, Twin, Unique, Wagstaff, Weakly, Wilson, Wolstenholme and Woodall Primes.</h4>
    </div>
  );
};

export default Algorithm;
