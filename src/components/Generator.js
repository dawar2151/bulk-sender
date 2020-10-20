import React from 'react';
import { ethers, Wallet } from "ethers";
import { Button, Container, Col, Row, Form, ProgressBar} from 'react-bootstrap';
import config from '../config';
var fs = require('browserify-fs');
/*
interface Wallet{
    publicKey: String;
    address: String;
}
*/
class Generator extends React.Component{
    constructor(props){
        super(props);
        this.state = {nbr_address:0, current_value:0, loading: false}
        this.handleChange = this.handleChange.bind(this);
        this.generate_addresses = this.generate_addresses.bind(this);
        this.write_data = this.write_data.bind(this);
    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    async write_data(){
      let wallets = [];
        let wallet;
        for(let i = 1; i <= this.state.nbr_address; i++){
          wallet =  ethers.Wallet.createRandom();
          this.setState({current_value: (i*100)/this.state.nbr_address});
          console.log(this.state.current_value);
          wallets.push(
            {
              address: wallet.address,
              privateKey: wallet.privateKey
            }
          );
          
        }
        fs.mkdir(config.data_path, function() {
          fs.writeFile(config.data_path+'/data.json', JSON.stringify(wallets), function() {
              fs.readFile(config.data_path+'/data.json', 'utf-8', function(err, data) {
                  console.log(data);
              });
          });
      });
       return wallets;
    }
    async generate_addresses(event){
        event.preventDefault();
        this.setState({ loading: true });
        console.log(this.state.loading)
        const data = await this.write_data();
        this.setState({ loading: false });
    }
    render() {
        let progressInstance ;
        if(this.state.current_value > 0){
          progressInstance = <ProgressBar animated now={this.state.current_value} label={`${this.state.current_value}%`} />;
        }
        return (
          <Container> 
            <Row>
              <Col>
              <Form>
                  <Form.Group as={Row} controlId="formNbraddresses">
                    <Form.Label column sm="4">
                      Number of addresses
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control value={this.state.nbr_address} name="nbr_address" onChange={this.handleChange} placeholder="" />
                    </Col>
                    <Col sm="4">
                      <Button onClick={this.generate_addresses} variant="primary">Generate</Button>{' '}
                    </Col>
                  </Form.Group>
                </Form>
              </Col>
              
            </Row>
            <Row>
            <Col sm="12">
                {progressInstance}
              </Col>
            <Col sm="6">
                {this.state.loading &&
                  <h3>waiting...</h3>
                }
              </Col>
              </Row>
          </Container>
        );
      }
}
export default Generator;