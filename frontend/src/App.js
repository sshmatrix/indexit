import './App.css';
import Minter from './Minter';
import Mobile from './Mobile';
import Samples from './Samples';
import Algorithm from './Algorithm';
import { HashRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  function isMobileDevice() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
  }
  const isMobile = isMobileDevice();

  return (
    <div className="App">
      <Router basename="/">
          <Routes>
            <Route exact path='/' element={<Mobile/>}/>
            <Route exact path='/minter' element={<Minter/>}/>
            <Route exact path='/samples' element={<Samples/>}/>
            <Route exact path='/algorithm' element={<Algorithm/>}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
