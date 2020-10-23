import React from 'react';
import { Button, Container, Col, Row, Form, Badge} from 'react-bootstrap';
import config from '../config';
import {send_amount,
        send_amount_sc, 
        get_decimals,
        get_name,
        get_totalSupply,
        get_symbol } from '../utils/sm_token';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { get_addresses, IsValidJSONString } from '../utils/common';

var fs = require('browserify-fs');

class Bulk extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          name:'',
          totalSupply:0,
          symbol:'',
          loading:false,
          token:'',
          decimals:0,
          json_wallets:'',
        }
        const { loading } = this.state;
        this.handleChange = this.handleChange.bind(this);
        this.send_amount = this.send_amount.bind(this);
    }
    async handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        if(event.target.name ==  'token'){
          const token = event.target.value;
          let decimals = await get_decimals(token);
          let symbol = await get_symbol(token);
          let name = await get_name(token);
          let totalSupply = await get_totalSupply(token);
          this.setState({decimals: decimals});
          this.setState({symbol: symbol});
          this.setState({name: name});
          this.setState({totalSupply: totalSupply});
        }
    }
    async send_amount(){
      let self = this;
      // Read all generated addresses
        let wallets = JSON.parse(this.state.json_wallets);
        self.setState({ loading: true });
        let addrs = [];
        let amounts = [];
        let total_amount = 0;
        for(let item in wallets){
          addrs.push(item)
          amounts.push(wallets[item]);
          total_amount += wallets[item];
        }
        // send total amount to SC
        let txid_sc = await send_amount_sc(this.state.token, config.sm_bridge, total_amount);
        if(txid_sc){
          toast('Amount successfully sent to Bridge SC', { appearance: 'success' })
        }
        // send tokens to addresses
        let txid_tx = await send_amount(this.state.token, addrs,amounts);
        self.setState({ loading: false });
        if(txid_sc){
          toast('Amount successfully sent to  wallets', { appearance: 'success' })
        }
    
    }
    render() {
     
        return (
          <Container> 
            <Row>
              <Col>
              <Form>
                <Form.Group as={Row} controlId="formToken">
                    <Form.Label column sm="4">
                      Import Your Token
                    </Form.Label>
                    <Col sm="6">
                      <Form.Control value={this.state.token} name="token" onChange={this.handleChange} placeholder="put your token here" />
                    </Col>
                    <Col sm="2">
                      <Form.Control value={this.state.decimals} name="decimals" onChange={this.handleChange} placeholder="decimals" />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="wallets.json">
                      <Form.Label column sm="4">Json Wallets</Form.Label>
                      <Col sm="8">
                      <Form.Control value={this.state.json_wallets} name="json_wallets" onChange={this.handleChange} as="textarea" rows={5} />
                      </Col>
                  </Form.Group>
                  {this.state.totalSupply &&
                  <Row>
                    <Col>
                       
                      <h6>
                      Name: <Badge variant="secondary">{this.state.name}</Badge>
                      </h6>
                    </Col>
                    <Col>
                    <h6>
                      Symbol: <Badge variant="secondary">{this.state.symbol}</Badge>
                      </h6>
                    </Col>
                    <Col>
                    <h6>
                    Total Supply: <Badge variant="secondary">{this.state.totalSupply}</Badge>
                    </h6>
                      
                    </Col>
                  </Row>
                  }
                  <Row>
                  <Col>
                      <Button onClick={this.send_amount} variant="primary">Send tokens</Button>{' '}
                    </Col>
                  </Row>
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