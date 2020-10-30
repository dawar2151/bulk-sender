/**
 * This Component
 * Load stored wallets
 * Save entered token
 * Send total amounts to Bridge smart contract
 * Send bulk tokens to loaded wallets from bridge smart contract 
 */
import React from 'react';
import { Button, Container, Col, Row, Form, Badge, Card} from 'react-bootstrap';
import config from '../config';
import {
  send_amount,
  send_amount_sc, 
  get_decimals,
  get_name,
  get_totalSupply,
  get_symbol,
  validate_address,
  getBigNumber, 
  get_current_account
} from '../utils/sm_token';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { save_token } from '../services/tokens-service';
import { get_wallets } from '../services/wallets-service';
import { save_bulk_bridges } from '../services/bridges-service';
import { parse_transactions } from '../utils/common';

import DatePicker from 'react-datepicker';

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
          typeAmounts:'common',
          amount:0,
          startDate: new Date(),
          limit: 50
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleLimit = this.handleLimit.bind(this);
        this.send_amount = this.send_amount.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    async componentDidMount(){
      await this.loadWallets(parseInt(0));// load common amounts
    }
    /**
     * Load On init Component saved wallets for connected MetaMask account
     */
    getRandom(){
      return Math.floor(Math.random() * (+config.end_common_amounts + 1 - +config.start_common_amounts)) + +config.start_common_amounts;
    }
    parseDate(date){
      return new Date(date).toISOString().split('T')[0];
    }
    async loadWallets(amount) {
      console.log()
      let data = await get_wallets({holder: get_current_account(), created_at: this.parseDate(this.state.startDate), limit: this.state.limit});//load wallets from database
      let json_wallets = {};
      for(let item of data){
        if(amount === 0 ){//Common amount
          json_wallets[item.address] = this.getRandom()
        }else
        json_wallets[item.address] = amount;
      }
      this.setState({json_wallets: JSON.stringify(json_wallets)});  // set couple (wallets, values) input 

    }
    /**
     * Set component state
     * @param {*} event 
     */
    async handleLimit(event){
      await this.setState({[event.target.name]: event.target.value});
      this.loadWallets(parseInt(0));
    }
    async handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        if(event.target.name === "typeAmounts"){
          if(event.target.value === "common"){
            this.loadWallets(parseInt(0));
          }
          
        }
        if(event.target.name === "amount"){
           this.loadWallets(parseInt(event.target.value));
        }   
        if(event.target.name ===  'token'){                       // save token if new

          const token = event.target.value;
          if(validate_address(token)){

            let decimals = await get_decimals(token);             // get token's decimals
            let symbol = await get_symbol(token);                 // get token's symbol
            let name = await get_name(token);                     // get token's name
            let totalSupply = await get_totalSupply(token);       // get token's totalSupply
            
            this.setState({                                       // update token state
              decimals: decimals, 
              symbol: symbol, 
              name: name, 
              totalSupply: totalSupply
            });
                                                                  
            localStorage.setItem('token', token);                 // save token state
            await save_token({                                    // save token in database
              holder: get_current_account(),
              address: token,
              name: name,
              decimals: decimals,
              totalSupply: totalSupply,
              symbol: symbol
            });
            this.loadWallets(parseInt(0));
          } else{
            toast('Invalid Token!', { appearance: 'error' })
          } 
        }
    }
    async setStartDate(date){
      await this.setState({startDate: date});
      await this.loadWallets(0);
    }
    /**
     * parse wallets and amounts to send
     * send total amount to Bridge smart contract
     * send amounts from Bridge smart contract to wallets
     * save all transactions logs in database
     */
    async send_amount(){
      let self = this;
      let addresses = [];
      let amounts = [];
      let total_amount = 0;
      let wallets
      try{
         wallets = JSON.parse(this.state.json_wallets);                                               // Read loaded wallets and amounts
      } catch (e) {
        console.log(e);
        toast('JSON not valid it should be : {address:amount,...}');
      };
      try{
        self.setState({ loading: true });
        for (let [address, value] of Object.entries(wallets)) {                                         // Parse addresses and amounts to two deparated arrays
          addresses.push(address);
          amounts.push(getBigNumber(value, this.state.decimals));
          total_amount += value;
        }

        let bn_total_amount = getBigNumber(total_amount, this.state.decimals);
        let txid_bridge = await send_amount_sc(this.state.token, config.sm_bridge, bn_total_amount);    // send total tokens to bridge SC
        if(txid_bridge){
          toast('Amount successfully sent to Bridge SC', { appearance: 'success' })
        }
        
        let txid = await send_amount(this.state.token, addresses,amounts);                              // send tokens from SC to wallets
        self.setState({ loading: false });
        if(txid){
          toast('Amount successfully sent to  wallets', { appearance: 'success' })
        }
        
        const birdges = await parse_transactions( txid_bridge,                                          // parse sent tokens transactions to database models 
                                                txid, 
                                                bn_total_amount, 
                                                amounts, 
                                                addresses 
                                                );
        await save_bulk_bridges(birdges);

      } catch (e) {
        console.log(e);
        toast('Something went wrong !');
        return false;
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
                      Token address
                    </Form.Label>
                    <Col sm="6">
                      <Form.Control value={this.state.token} name="token" onChange={this.handleChange} placeholder="put your token here" />
                    </Col>
                    <Col sm="2">
                      <Form.Control value={this.state.decimals} name="decimals" onChange={this.handleChange} placeholder="decimals" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="4">
                      Date
                    </Form.Label>
                    <div key="inline-radio"  sm="4" className="datepicker">
                      <DatePicker selected={this.state.startDate} dateFormat="yyyy-MM-dd" name="startDate" onChange={date => this.setStartDate(date)} />
                    </div>
                </Form.Group> 
                <Form.Group as={Row}>
                <Form.Label column sm="4">
                      Limit
                    </Form.Label>
                    <Col sm="2">
                      <Form.Control as="select" value={this.state.limit} name="limit" onChange={this.handleLimit}>
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                        <option>150</option>
                        <option>200</option>
                      </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="4">
                      Select amount type
                    </Form.Label>
                    <div key="inline-radio" className="radioAmount" onChange={this.handleChange} sm="8">
                      <Form.Check inline label="Common" checked={this.state.typeAmounts == 'common'} value="common" name="typeAmounts" type="radio" id="inline-radio-2" />
                      <Form.Check inline label="Custom" value="custom" name="typeAmounts" type="radio" id="inline-radio-1" />
                    </div>
                </Form.Group>
                {this.state.typeAmounts === 'custom' &&
                <Form.Group as={Row} controlId="formNbraddresses">
                    <Form.Label column sm="4">
                      Amount
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control value={this.state.amount} name="amount" onChange={this.handleChange} placeholder="" />
                    </Col>
                </Form.Group> 
                }  
                <Form.Group as={Row} controlId="wallets.json">
                      <Form.Label column sm="4">Addresses with Balances in</Form.Label>
                      <Col sm="8">
                      <Form.Control value={this.state.json_wallets} name="json_wallets" placeholder='Example: { "0xebA77334af32eA44b53E1b494Ee918c07878DAcE":12,"0x1bA77334af32eA44b53E1b494Ee918c07878DAcE":13}' onChange={this.handleChange} as="textarea" rows={5} />
                      </Col>
                </Form.Group>
                {this.state.totalSupply !== 0 &&
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
                  {this.state.totalSupply !== 0 &&
                    <Row>
                      <Col>
                    <Card>
                      <Card.Body>
                        <Card.Title>Network Speed up</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                        <Card.Text>
                          To speed up the transactions you can rise the (Gas Price) in Metamask confirm transactions.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    </Col>
                    </Row> 
                  }
                  <Row>
                  <Col>
                      <Button className="btn-generate" onClick={this.send_amount} variant="primary">Send tokens</Button>{' '}
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