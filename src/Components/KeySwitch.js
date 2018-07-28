import React, {Component} from "react";
import {Dialog, FlatButton, TextField, Toggle} from 'material-ui';
import axios from "axios";

const AIRTABLE = "Airtable";
const CRUNCHBASE = "Crunchbase";

export default class KeySwitch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            workingKey: false,
            framework: CRUNCHBASE
        }
    }

    async testKey(key) {
        if (this.state.framework === CRUNCHBASE) {
            let response = await axios.get(`https://api.crunchbase.com/v3.1/organizations/grove-5?user_key=${this.state.value}`)
                .catch(err => {
                    this.props.toastError("key is not working")
                })
                .then(res => {
                    if (res) {
                        this.props.toastSuccess("valid key!");
                        this.changeWorkingKey(true)
                    }
                });
        } else {
            let response = await axios.get(`https://api.airtable.com/v0/appoxnXQ7asCyquMr/VC%20Funds?maxRecords=3&view=Main%20View&api_key=${this.state.value}`)
                .catch(err => {
                    this.props.toastError("key is not working")
                })
                .then(res => {
                    if (res) {
                        this.props.toastSuccess("valid key!");
                        this.changeWorkingKey(true)
                    }
                });
        }
    }

    changeText(e) {
        this.setState({value: e.target.value});
        if (this.state.workingKey) {
            this.changeWorkingKey();
        }
    }

    changeWorkingKey(value) {
        this.setState({workingKey: value || !this.state.workingKey});
    }

    switchAPIKey() {
        this.setState({framework: this.state.framework === CRUNCHBASE ? AIRTABLE : CRUNCHBASE});
    }

    async saveKey() {
        if (!this.state.workingKey) {
            this.props.toastError("Key is not valid, try again..")
        } else {
            let response = await axios.put('/key/update', {key: this.state.value, framework: this.state.framework.toLowerCase()});
            this.props.toastSuccess("Key is updated.");
            this.props.close();
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.props.close}
            />,
            <FlatButton
                label="Test Key"
                primary={true}
                keyboardFocused={true}
                onClick={this.testKey.bind(this)}
            />,
            <FlatButton
                label="Save"
                primary={true}
                onClick={this.saveKey.bind(this)}
            />,
        ];
        return <Dialog
            title={`Switch Your API Key For ${this.state.framework}.`}
            actions={actions}
            modal={false}
            open={this.props.open}
            onRequestClose={this.props.close}
        >
            <Toggle
                onToggle={this.switchAPIKey.bind(this)}
                style={{
                    position: "absolute",
                    left: "90%",
                    top: "15%"
                }}
            />
            <TextField
                hintText="Insert New Key"
                id="text-field-controlled2"
                value={this.state.value}
                onChange={this.changeText.bind(this)}
            />
        </Dialog>
    }
}