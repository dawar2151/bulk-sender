import React from 'react';
import { Button, Container, Col, Row, Form, Badge, Card} from 'react-bootstrap';
import config from '../config';
import {send_amount,
        send_amount_sc, 
        get_decimals,
        get_name,
        get_totalSupply,
        get_symbol,
        validate_address,
        getBigNumber, 
        get_current_account} from '../utils/sm_token';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { save_token } from '../services/tokens-service';
import { get_wallets } from '../services/wallets-service';

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
    async componentDidMount() {
      let data = await get_wallets({holder: get_current_account()});
      let json_wallets = {};
      for(let item of data){
        json_wallets[item.address] = 0;
      }
      this.setState({json_wallets: JSON.stringify(json_wallets)});

    }
    async handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        if(event.target.name ===  'token'){

          const token = event.target.value;
          if(validate_address(token)){
            let decimals = await get_decimals(token);
            let symbol = await get_symbol(token);
            let name = await get_name(token);
            let totalSupply = await get_totalSupply(token);
            this.setState({decimals: decimals});
            this.setState({symbol: symbol});
            this.setState({name: name});
            this.setState({totalSupply: totalSupply});
            localStorage.setItem('token', token);
            await save_token({
              holder: get_current_account(),
              address: token,
              name: name,
              decimals: decimals,
              totalSupply: totalSupply,
              symbol: symbol
            });
          } else{
            toast('token not valid', { appearance: 'error' })
          } 
        }
    }
    async send_amount(){
      let self = this;
      // Read all generated addresses
      try{
        let wallets = JSON.parse(this.state.json_wallets);
        self.setState({ loading: true });
        let addrs = [];
        let amounts = [];
        let total_amount = 0;
        for(let item in wallets){
          addrs.push(item);
          amounts.push(getBigNumber(wallets[item], this.state.decimals));
          total_amount += wallets[item];
        }
        let bn_total_amount = getBigNumber(total_amount, this.state.decimals);
        // send total amount to SC
        let txid_sc = await send_amount_sc(this.state.token, config.sm_bridge, bn_total_amount);
        if(txid_sc){
          toast('Amount successfully sent to Bridge SC', { appearance: 'success' })
        }
        // send tokens to addresses
        let txid_tx = await send_amount(this.state.token, addrs,amounts);
        self.setState({ loading: false });
        if(txid_tx){
          toast('Amount successfully sent to  wallets', { appearance: 'success' })
        }
      } catch (e) {
        
        toast('JSON not valid it should be : {address:amount,...}  ', { appearance: 'success' });
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