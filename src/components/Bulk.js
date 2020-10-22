import React from 'react';
import { Button, Container, Col, Row, Form, ProgressBar} from 'react-bootstrap';
import config from '../config';
import { send_amount, send_amount_sc } from '../utils/sm_token';
import Loader from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';

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
        const { loading } = this.state;
        this.handleChange = this.handleChange.bind(this);
        this.send_amount = this.send_amount.bind(this);
    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    async send_amount(){
      let self = this;
      // Read all generated addresses
      fs.readFile(config.data_path+'/data.json', 'utf-8', async function(err, data) {
        self.setState({ loading: true });
        let addrs = [];
        for(let item of JSON.parse(data)){
          addrs.push(item.address)
        }
        // calculate total amount to send to SC
        let total_amount = (self.state.amount * addrs.length )
        // send total amount to SC
        let txid_sc = await send_amount_sc(config.sm_bridge, total_amount);
        if(txid_sc){
          toast('Amount Successfully send to Bidge SC', { appearance: 'success' })
        }
        // send tokens to addresses
        let txid_tx = await send_amount(addrs,self.state.amount);
        self.setState({ loading: false });
        if(txid_sc){
          toast('Amount Successfully send to  Wallets', { appearance: 'success' })
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
            <Row>
            <Col sm="4">
            </Col>
            <Col sm="4">
            {this.state.loading &&
              <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
            }
            </Col>
            <Col sm="4"></Col>
            </Row>
            
          </Container>
                  

        );
      }
}
export default Bulk;