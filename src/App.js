import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Container, Col, Row, Form, Tab, Tabs} from 'react-bootstrap';
import Generator from './components/Generator';
import Bulk from './components/Bulk';
import Balance from './components/Balance';
import Download from './components/Download';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div className="App">
     <Container>
       <Row>
         <Col>
         <h2>Bulk Sender system</h2>
            <Tabs defaultActiveKey="generator" id="uncontrolled-tab-example">
              <Tab className='tab' eventKey="generator" title="Address generator">
                <Generator />
              </Tab>
              <Tab className='tab' eventKey="bulk" title="Bulk send tokens">
                <Bulk />
              </Tab>
              <Tab className='tab' eventKey="balance" title="Addresses balance">
                <Balance />
              </Tab>
              <Tab className='tab' eventKey="download" title="Download wallets">
                <Download />
              </Tab>  
      </Tabs>
      </Col>
       </Row>
     </Container>
     <ToastContainer />
    </div>
  );
}

export default App;
