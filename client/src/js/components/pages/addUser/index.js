import React, { Component } from 'react';
import superagent from 'superagent';
import Button from '../../commons/button.js';
import Navigator from '../../navigation';
import UserList from './userList';

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            isFetchingData: false,
            fetchMessage: ''
        }
        this.fetchUsers = this.fetchUsers.bind(this);
        // this.fetchGroups = this.fetchGroups.bind(this);
    }
    getCurrentUser(arr){
        // Gets loggedIn user's details
        const currentUserId = localStorage.getItem('uid');
        Object.entries(arr).forEach(([key, value]) => {
            if (value['id'] === currentUserId){
                localStorage.setItem('currentUser', JSON.stringify(value['groups']));
            }

        });

    }
    
    
    fetchUsers() {
        this.setState({
            isFetchingData: true
        });
        superagent
            .get(`https://postitdanny.herokuapp.com/getUsers`)
            .end(
                (error, response) => {
                    if (error) {
                        console.log(error);
                        this.setState({
                            isFetchingData: false,
                            fetchMessage: 'Error Fetching Data'
                        });
                        return;
                    }
                    // this.getCurrentUser(JSON.parse(response.text));
                    this.setState({
                        isFetchingData: false,
                        userList: JSON.parse(response.text),
                        fetchMessage: 'Successfully Loaded'
                    });
                }
            )
    }
    render() {
        const { userList, isFetchingData, fetchMessage } = this.state;

        if ( isFetchingData ){
            return <span>Loading!!</span>
        }
        return (
    <div className="page">
            <Navigator/>
            <div className="page-content">
                <div className="trey">
            <Button value="Get Users" onClick={this.fetchUsers} />
            { fetchMessage }
            <UserList userList={userList}/>
        </div>
    </div>
</div>)
    }
}
export default AddUser;
