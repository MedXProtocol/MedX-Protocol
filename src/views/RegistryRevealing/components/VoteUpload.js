import React from 'react'
import { Modal } from 'react-bootstrap';
import 'react-virtualized/styles.css';
import { claimVoterReward, updateStatus, waitForTxComplete, revealVote, getAllPolls, getAllListings } from '../../../utils/web3-util';
import spinner from '../../../img/spinner.gif';


class VoteUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spinnerDisplayString: 'block',
      errorString: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.state.show) {
      this.setState({ showModal: nextProps.show });
    }
  }

  handleCloseClick = (e) => {
    e.preventDefault();
    this.setState({ errorString: '' });
    this.setState({ showModal: false });
  }

  handleUploadClick = async () => {

    this.setState({ errorString: '' });

    var files = document.getElementById('selectFiles').files;
    console.log(files);
    if (files.length <= 0) {
      return false;
    }

    var fr = new FileReader();

    fr.onload = function (e) {
      console.log(e);
      try {
        var result = JSON.parse(e.target.result);
        localStorage.setItem("vote" + result.pollID, JSON.stringify(result));
        if (result && result.pollID && result.voteChoice && result.salt && this.props.callback){
          this.props.callback(result.pollID);
        }
        else{
          this.setState({ errorString: 'An error occurred. Please try again.' });  
        }
      }
      catch (e) {
        this.setState({ errorString: 'An error occurred. Please try again.' });
      }

    }.bind(this);

    try {
      fr.readAsText(files.item(0));
    }
    catch (e) {
      this.setState({ errorString: 'An error occurred. Please try again.' });
    }
  };

  render() {
    return (
      <Modal show={this.state.showModal}>
        <Modal.Body>
          <div className="row">
            <div className="col text-center">
              <h4>Please upload a vote file.</h4>
              <p>Your vote file contains the information required to reveal your vote and claim your tokens.</p>
              <label className="btn btn-primary">
                Upload...<input id="selectFiles" onChange={this.handleUploadClick} type="file" className="btn btn-default" style={{ display: 'none' }} />
              </label>
              <br />
              <br />
              <p style={{ color: 'red' }}>{this.state.errorString}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={this.handleCloseClick} type="button" className="btn btn-default">Close</button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default VoteUpload;
