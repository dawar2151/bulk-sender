import React from 'react';
import { Button, Container, Col, Row, Form, ProgressBar} from 'react-bootstrap';
import config from '../config';
import {get_balance, get_accounts, send_amount} from '../utils/sm_token';

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
        this.send_amount = this.send_amount.bind(this);
    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    async send_amount(){
      let self = this;
      console.log(this.state.amount);
      fs.readFile(config.data_path+'/data.json', 'utf-8', async function(err, data) {
        for(let item of JSON.parse(data)){
          let txid = await send_amount(item.address, self.state.amount);
        }
      });
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