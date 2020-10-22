import React from 'react';
import { Button, Container, Col, Row} from 'react-bootstrap';
import config from '../config';
var fs = require('browserify-fs');

class Download extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
        };
      }
    /**
     * download wallets
    */  
    download(){
        fs.readFile(config.data_path+'/data.json', 'utf-8', function(err, data) {
            let exportName = 'wallets'; 
            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            let downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", exportName + ".json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    }
    render() {
        return (
          <Container> 
            <Row>
              <Col md="12">
              <h1> Download Wallets</h1>
              </Col>
            </Row>
            <Row style={{margin:20}}>
                <Col>
                    <Button onClick={this.download}>Save wallets</Button>
                </Col>
            </Row>
          </Container>
        );
      }
}
export default Download;