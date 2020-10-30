import React from 'react';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

import { 
  Container, 
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import  Panel from "./components/Panel";

  function App() {
    return (
      
      <div className="App">
        <Container>
          <Panel />
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
    );
}

export default App;
