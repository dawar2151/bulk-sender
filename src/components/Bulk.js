import React from 'react';
import { ethers, Wallet } from "ethers";
import { Button, Container, Col, Row, Form, ProgressBar} from 'react-bootstrap';
var fs = require('browserify-fs');
/*
interface Wallet{
    publicKey: String;
    address: String;
}
*/
class Bulk extends React.Component{
    constructor(props){
        super(props);
        this.state = {amount:0}
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    send_amount(){
      console.log(this.state.amount);
    }
    render() {
     
        return (
          <Container> 
            <Row>
              <Col>
              <Form>
                  <Form.Group as={Row} controlId="formNbraddresses">
                    <Form.Label column sm="4">
                      Amount
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control value={this.state.amount} name="amount" onChange={this.handleChange} placeholder="" />
                    </Col>
                    <Col sm="4">
                      <Button onClick={this.send_amount} variant="primary">Send tokens</Button>{' '}
                    </Col>
                  </Form.Group>
                </Form>
              </Col>
              
            </Row>
          </Container>
        );
      }
}
export default Bulk;