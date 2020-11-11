import React from 'react';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import ParticleComponent from "./components/ParticleComponent";

import { 
  Container, 
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import  Panel from "./components/Panel";
import Generator from './components/Generator';
import Bulk from './components/Bulk';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

  function App() {
    return (
      
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#3f51b5"
        }}
      >
        <ParticleComponent />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",

          }}
        >
          <Container>
            <Panel />
            <Switch>
              <Route path="/generator">
                <Generator />
              </Route>
              <Route path="/bulk">
                <Bulk />
              </Route>
            </Switch>
        </Container>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </div>
        
      </div>
    
    );
}

export default App;
