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
        this.handleChange = this.handleChange.bind(this);
        this.send_amount = this.send_amount.bind(this);
    }
    /**
     * Load On init Component saved wallets for connected MetaMask account
     */
    async componentDidMount() {
      let data = await get_wallets({holder: get_current_account()});
      let json_wallets = {};
      for(let item of data){
        json_wallets[item.address] = 0;
      }
      this.setState({json_wallets: JSON.stringify(json_wallets)});

    }
    /**
     * Set component state
     * @param {*} event 
     */
    async handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        if(event.target.name ===  'token'){

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
          } else{
            toast('Invalid Token!', { appearance: 'error' })
          } 
        }
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
        console.log(addresses);
        let bn_total_amount = getBigNumber(total_amount, this.state.decimals);
        // send total amount to SC
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
        console.log(birdges);
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
                      <Form.Label column sm="4">Addresses with Balances in</Form.Label>
                      <Col sm="8">
                      <Form.Control value={this.state.json_wallets} name="json_wallets" placeholder='Example: { "0xebA77334af32eA44b53E1b494Ee918c07878DAcE":12,"0x1bA77334af32eA44b53E1b494Ee918c07878DAcE":13}' onChange={this.handleChange} as="textarea" rows={5} />
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
                  {this.state.totalSupply &&
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