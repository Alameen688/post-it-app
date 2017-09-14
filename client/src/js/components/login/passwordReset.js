import React, { Component } from 'react';
import firebase from 'firebase';
import UserStore from '../../stores/UserStore';
import TextBox from '../commons/textbox.js';
import Button from '../commons/button.js';
import ViewActions from '../../actions/viewActions';


class PasswordReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
      // this._onChange = this._onChange.bind(this);
      this.resetPassword = this.resetPassword.bind(this);
    }
     resetPassword() {
console.log('Chill first!!')
        }
    render(){
        return(
          <div>
            <div className="modal fade exampleModal" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Reset Password</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <input type="text" className="form-control" id="emailAddress" />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={this.resetPassword}>Send message</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
}
export default PasswordReset;