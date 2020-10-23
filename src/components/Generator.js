import React from 'react';
import { Button, Container, Col, Row, Form, Card} from 'react-bootstrap';
import config from '../config';
import Loader from 'react-loader-spinner';
import { generate_wallets } from '../utils/sm_token';
import {  toast } from 'react-toastify';
import { get_addresses } from '../utils/common';
var fs = require('browserify-fs');
class Generator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          nbr_address:0,
          json_wallets:'',
          csv_wallets:'',
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
                  self.setState({json_wallets: JSON.stringify(data)})
                  self.setState({csv_wallets: get_addresses(wallets)});
                  toast('Wallets successfully generated', { appearance: 'success' })
              });
          });
      });
    }
    render() {
        return (
          <Container>
            <Row>
              <Card>
                <Card.Body>
                  <Card.Title>Generate ETH addresses</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                  <Card.Text>
                    Please provide a count for the generation new ETH addresses.
                    You can generate up to 100 new ETH addresses per time.
                    On output you will receive json list with addresses and corresponding private key
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row> 
            <Row>
              <Col>
              <Form>
                  <Form.Group as={Row} controlId="formNbraddresses">
                    <Form.Label>
                      Count
                    </Form.Label>
                      <Form.Control value={this.state.nbr_address} name="nbr_address" onChange={this.handleChange} placeholder="" />
                      <Button className="btn-generate" onClick={this.generate_addresses} variant="primary">Generate</Button>
                  </Form.Group>
                  {this.state.json_wallets &&
                    <Form.Group as={Row} controlId="wallets.json">
                      <Form.Label>Json Wallets</Form.Label>
                      <Form.Control value={this.state.json_wallets} as="textarea" rows={3} />
                    </Form.Group>
                  }
                  {this.state.csv_wallets &&
                    <Form.Group as={Row} controlId="wallets.csv">
                      <Form.Label>Array addresses</Form.Label>
                      <Form.Control as="textarea" value={this.state.csv_wallets} rows={3} />
                    </Form.Group>
                  }
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