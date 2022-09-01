import { useNavigate } from "react-router-dom";
import './index.css';
import { homepage } from '../package.json';
import Minter from './Minter';

const Mobile = (props) => {
  let navigate = useNavigate();
  function isMobileDevice() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
  }
  const isMobile = isMobileDevice();
  const goToHome = () =>{
    let path = `/minter`
    navigate(path);
  }

  if (isMobile) {
    return (
      <div className="Mobile">
        <h6>you are accessing this app on mobile. open with metamask mobile to connect, or continue in browser without connecting.</h6>
        <div className="mobile-buttons">
          <button
            onClick={() => {location.href='https://metamask.app.link/dapp/' + homepage.split("://").pop() + '/#/minter'}}
            id="sampleButton"
            style= {{ marginBottom: '20px' }}
          >
            🦊 Open MetaMask
          </button>
          <br></br><br></br>
          <button
            onClick={goToHome}
            id="sampleButton"
            style= {{ marginBottom: '20px'}}
          >
            🌎 Continue in Browser
          </button>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    );
  } else {
    return (
      <Minter/>
    );
  }

};

export default Mobile;
