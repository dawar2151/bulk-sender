import React from 'react';
import { ethers, Wallet } from "ethers";
import { Button, Container, Col, Row, Form, ProgressBar} from 'react-bootstrap';
var fs = require('browserify-fs');

class Balance extends React.Component{
    constructor(props){
        super(props);
    }
    
    render() {
     
        return (
          <Container> 
            <Row>
              <Col>
              <h1> account balance</h1>
              </Col>
              
            </Row>
          </Container>
        );
      }
}
export default Balance;