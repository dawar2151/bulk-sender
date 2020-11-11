import React from 'react';
import { 
  Container,
  Col,
  Tab,
  Tabs,
  Row
} from 'react-bootstrap';
import Web3 from 'web3';
import Generator from './Generator';
import Bulk from './Bulk';
import Balance from './Balance';
import {
    BrowserRouter as Router,
    Link,
    Switch,
  } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

class Panel extends React.Component{
    constructor(props) {
        super(props);
        this.state = { enabled: false, error: null };
        this.connectWeb3 = this.connectWeb3.bind(this);
        this.getAccess = this.getAccess.bind(this);
    };
    async connectWeb3(){
        if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
            try {
                // Request account access if needed
                await window.ethereum.enable();
                this.setState({enabled: true});
            } catch (error) {
                console.log('Access refused');
                return false;
                this.setState({enabled: false});
            }   
        }else{
            alert('install Metamsk')
        }
    }
    async getAccess(){
        await this.connectWeb3();
        this.setState({enabled: true})
    }
    
    render() {
        
        return (
          <Container>
              
            {this.state.enabled &&
            <AppBar position="static" style={{marginBottom: 20}}>
                <Toolbar>
                <IconButton edge="start"  color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6">
                Bulk Sender system
                </Typography>
                <Link  to="/generator" style={{marginLeft: 10}} color="inherit">Generator</Link>
                <Link  to="/bulk" style={{marginLeft: 10}} color="inherit">Bulk</Link>
                </Toolbar>
            </AppBar>
              
            }
            <Row>
            {!this.state.enabled &&
                <Button onClick={this.getAccess}>Connect Metamask</Button>
            }   
            </Row>
          </Container>
        );
      }
}
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
}));    
export default Panel;