import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
import './App.css';
import { PrivateRoute } from './components/common/PrivateRoute';
import Login from './components/login/Login'
import Site from './components/site/Site'
import Location from './components/location/location'
import Register from './components/register/Register'
import NoPage from './components/NoPage'
import Pin from './components/pinPage/Pin';
import ProductLoader from './components/loadProduct/ProductLoader';
function App() {
  return ( <Router>
    <Routes>
     
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login/>} /> 
      <Route path="/site" element={<Site/>} /> 
      <Route path="/location" element={<Location/>} /> 
      <Route path="/pin" element={<Pin/>} />
      <Route path="/register" element={<Register/>} /> 
      <Route path="/prodcutloader" element={<ProductLoader/>} /> 
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
