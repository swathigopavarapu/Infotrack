import './App.css';
import Login from './Components/Login'
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './Components/Home';

function App() {
  return (
    <>
          <Routes>
            <Route path='/'  element={<Login />} />
            <Route path="home" element={<Home />} />            
          </Routes>
      
    </>
  );
}

export default App;
