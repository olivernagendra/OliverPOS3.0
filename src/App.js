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
import Location from './components/location/Location'
import Register from './components/register/Register'
import NoPage from './components/NoPage'
import Pin from './components/pinPage/Pin';
import ProductLoader from './components/loadProduct/ProductLoader';
import Cashmanagement from './components/cashmanagement/Cashmanagement';
import Home from './components/homePage/Home';
import OpenRegister from './components/openregister/OpenRegister';
import { indexDatabase } from './components/indexDb';
import { initDB } from "react-indexed-db";
import { DBConfig } from "./DBConfig";

initDB(DBConfig);
function App() {

  // const customerData = [
  //   { WPID: "111-11-1111", name: "Pranav", age: 10, email: "pranav@company.com" },
  //   { WPID: "222-22-2222", name: "nagendra", age: 24, email: "nagendra@home.org" }
  // ];
  // { WPID: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  //   { WPID: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
  //indexDatabase("2323223", customerData);
  return (<Router>

    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/site" element={<Site />} />
      <Route path="/location" element={<Location />} />
      <Route path="/pin" element={<Pin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/productloader" element={<ProductLoader />} />
      <Route path="/cashdrawer" element={<Cashmanagement />} />
      <Route path="/home" element={<Home />} />
      <Route path="/openregister" element={<OpenRegister />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  </Router>

  );
}

export default App;
