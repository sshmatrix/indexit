import './App.css';
import Minter from './Minter';
import Samples from './Samples';
import Algorithm from './Algorithm';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router basename="/">
          <Routes>
            <Route exact path='/' element={<Minter/>}/>
            <Route exact path='/samples' element={<Samples/>}/>
            <Route exact path='/algorithm' element={<Algorithm/>}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
