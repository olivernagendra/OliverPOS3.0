import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
import './App.css';
import Login from './components/login/Login'
import Site from './components/site/Site'
import Location from './components/location/Location'
import Register from './components/register/Register'
import NoPage from './components/NoPage'
import Pin from './components/pinPage/Pin';
import ProductLoader from './components/loadProduct/ProductLoader';
import Cashmanagement from './components/cashmanagement/Cashmanagement';
import { initDB } from "react-indexed-db";
import { DBConfig } from "./DBConfig";
import Dashboard from './components/dashboard/Dashboard';
import OpenRegister from './components/cashmanagement/OpenRegister';
import Closeregister from './components/cashmanagement/Closeregister';
import Customercreate from './components/customer/Customercreate';
import CustomerView from './components/customer/Customerview';
import Checkout from './components/checkout/Checkout';
import ActivityView from './components/activity/ActivityView';

import Refund from './components/refund/Refund';
initDB(DBConfig);
function App() {

  const authenticateComponent = (component) => {
    let isAuth = JSON.parse(localStorage.getItem('clientDetail'));
    if (!isAuth || isAuth !== null) {
      return component
    } else {
      return <Login />
    }
  }
  return (
    <Router>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/site" element={authenticateComponent(<Site />)} />
        <Route path="/location" element={authenticateComponent(<Location />)} />
        <Route path="/register" element={authenticateComponent(<Register />)} />
        <Route path="/pin" element={authenticateComponent(<Pin />)} />
        <Route path="/productloader" element={authenticateComponent(<ProductLoader />)} />
        <Route path="/home" element={authenticateComponent(<Dashboard />)} />
        <Route path="/cashdrawer" element={authenticateComponent(<Cashmanagement />)} />
        <Route path="/openregister" element={authenticateComponent(<OpenRegister />)} />
        <Route path="/closeregister" element={authenticateComponent(<Closeregister />)} />
        <Route path="*" element={authenticateComponent(<NoPage />)} />
        <Route path="/customers" element={authenticateComponent(<CustomerView />)} />
        <Route path="/checkout" element={authenticateComponent(<Checkout />)} />
        <Route path='/transactions' element={authenticateComponent(<ActivityView />)} />
        <Route path='/refund' element={authenticateComponent(<Refund />)} />
      </Routes>
    </Router>

  );
}

export default App;
