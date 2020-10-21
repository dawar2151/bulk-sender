import React from 'react';
import { Button, Container, Col, Row, Form, ProgressBar} from 'react-bootstrap';
import config from '../config';
import { send_amount } from '../utils/sm_token';
import Loader from 'react-loader-spinner'
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
      console.log(this.state.amount);
      fs.readFile(config.data_path+'/data.json', 'utf-8', async function(err, data) {
        self.setState({ loading: true });
        for(let item of JSON.parse(data)){
          let txid = await send_amount(item.address, self.state.amount);
          console.log(txid);
        }
        self.setState({ loading: false });
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