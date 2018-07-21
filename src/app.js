import React, { Component } from "react";
import { TextField, FlatButton } from "material-ui";
import axios from "axios";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            organiztion: {}
        }
    }

    findWebsite(websites, type) {
        let website = websites.items.find(website => {
            return website.properties.website_type === type
        });

        return website ? website.properties.url : "";
    }

    async handleChange() {
        let response = await axios.get(`https://api.crunchbase.com/v3.1/organizations/${this.state.value}?user_key=93486c676d74b7c40832d060c61d682e&page=1&sort_order=created_at%20DESC&items_per_page=250`);
        let organization = response.data;
        let org = {
            Name: organization.data.properties.name,
            Description: organization.data.properties.description,
            Location: organization.data.relationships.offices.item.properties.country === "Israel" ? "Israel" : "Foreign",
            TotalFunding: organization.data.properties.total_funding_usd,
            Website: this.findWebsite(organization.data.relationships.websites, "homepage"),
            LinkedIn: this.findWebsite(organization.data.relationships.websites, "linkedin"),
            Crunchbase: `https://www.crunchbase.com/organization/${this.state.value}`,
            Categories: organization.data.relationships.categories.items.map(item => { return item.properties.name} ).join(", "),
            Investores: organization.data.relationships.investors.items.filter(item => {return item.type === "Organization"}).map(item => {return item.properties.name}).join(", ")
        }
        let request = await axios.post('/data/row', {data: org});
    }

    changeText(e) {
        this.setState({value: e.target.value});
    }

    render() {
        const inputStyle = {
            position: "absolute",
            width: "20%",
            left: "40%",
            top: "5vh"
        }
        return (
            <div>
                <div className="background"></div>
                <TextField
                    hintText="Type anything"
                    id="text-field-controlled"
                    value={this.state.value}
                    style={inputStyle}
                    onChange={this.changeText.bind(this)}
                />
                <FlatButton label="Default" onClick={this.handleChange.bind(this)} style={{
                    position: "absolute",
                    width: "20%",
                    left: "60%",
                    top: "5vh"
                }}/>
                <div className={"content"}>
                </div>
            </div>
        );
    }
}