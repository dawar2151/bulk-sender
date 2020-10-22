import React from 'react';
import { Button, Container, Col, Row, Form, ProgressBar} from 'react-bootstrap';
import config from '../config';
import Loader from 'react-loader-spinner';
import { generate_wallets } from '../utils/sm_token';
var fs = require('browserify-fs');
class Generator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          nbr_address:0,
          current_value:0
        }
        const { loading } = this.state;
        this.handleChange = this.handleChange.bind(this);
        this.generate_addresses = this.generate_addresses.bind(this);
    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    async generate_addresses(event){
      let self = this;
      self.setState({ loading: true });
      let wallets =  await generate_wallets(this.state.nbr_address);
        fs.mkdir(config.data_path, function() {
          fs.writeFile(config.data_path+'/data.json', JSON.stringify(wallets), function() {
              fs.readFile(config.data_path+'/data.json', 'utf-8', function(err, data) {
                  console.log(data);
                  self.setState({ loading: false });
              });
          });
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
                      Number of addresses
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control value={this.state.nbr_address} name="nbr_address" onChange={this.handleChange} placeholder="" />
                    </Col>
                    <Col sm="4">
                      <Button onClick={this.generate_addresses} variant="primary">Generate</Button>
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
export default Generator;