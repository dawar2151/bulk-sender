import React from 'react';
import { Button, Container,Table, Col, Row, Form, ProgressBar} from 'react-bootstrap';
import {get_balance, get_current_account, parseBalance} from '../utils/sm_token';
import config from '../config';
import Loader from 'react-loader-spinner'
var fs = require('browserify-fs');

class Balance extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            addresses: [],
            master_balance:''
        };
        const { loading } = this.state;
        this.get_balances = this.get_balances.bind(this);
        this.get_master_balance = this.get_master_balance.bind(this);
      }
    async get_balances(){
        let self = this;
        let list = []
        fs.readFile(config.data_path+'/data.json', 'utf-8', async function(err, data) {
            self.setState({ loading: true });
            for(let item of JSON.parse(data)){
                let balance = await get_balance(item.address);
                let parsed_balance = await await parseBalance(balance);
                list.push({
                    address: item.address,
                    balance: parsed_balance
                })
            }
            self.setState({ loading: false });
            await self.setState({addresses: list});
        });
    }
    async get_master_balance(){
        let balance = await get_balance(get_current_account());
        let parsed_balance = await parseBalance(balance);
        this.setState({master_balance: parsed_balance})
    }
    renderTableData() {
        return this.state.addresses.map((addr, index) => {
           const { address, balance } = addr //destructuring
           return (
              <tr key={address}>
                 <td>#</td>
                 <td>{address}</td>
                 <td>{balance}</td>
              </tr>
           )
        })
     }
    render() {
        let current_account = get_current_account()
        return (
          <Container> 
            <Row>
              <Col md="6">
              <h1> accounts balances</h1>
              </Col>
              <Col md="6">
                <h5> current account: {current_account}</h5>
                <p>balance:{this.state.master_balance} </p>
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
            <Row style={{margin:20}}>
                <Col>
                    <Button onClick={this.get_balances}>get Accounts Balances</Button>
                </Col>
                <Col>
                    <Button onClick={this.get_master_balance}>get Master Balance</Button>
                </Col>
            </Row>
            <Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Address</th>
                    <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                   {this.renderTableData()}
                </tbody>
                </Table>
            </Row>
          </Container>
        );
      }
}
export default Balance;