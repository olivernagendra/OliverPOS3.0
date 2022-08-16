import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import APICall from './APICall';
import Login from './components/Login'
import Site from './components/Site'
import NoPage from './components/NoPage'
function App() {
  return ( <Router>
    <Routes>
     
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login/>} /> 
      <Route path="/site" element={<Site/>} /> 
      <Route path="*" element={<NoPage/>} />
    </Routes>
</Router>
    // <div className="App">
    // <header className="App-header"> 
     
       
    //   </header> 
    // </div>
  );
}

export default App;
