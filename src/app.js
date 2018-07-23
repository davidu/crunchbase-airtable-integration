import React, {Component} from "react";
import {TextField, FlatButton} from "material-ui";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        if (this.state.value === "") {
            toast.error("Type a valid value", {
                position: toast.POSITION.BOTTOM_LEFT
            });
        } else {
            let response = await axios.get(`https://api.crunchbase.com/v3.1/organizations/${this.state.value}?user_key=93486c676d74b7c40832d060c61d682e&page=1&sort_order=created_at%20DESC&items_per_page=250`).catch(e => {
                toast.error("item is not exist(don't forget to use the preamble!)", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
            });
            if (response.data) {
                let organization = response.data;
                let org = {
                    Name: organization.data.properties.name,
                    Description: organization.data.properties.description,
                    Location: organization.data.relationships.offices.item.properties.country === "Israel" ? "Israel" : "Foreign",
                    TotalFunding: organization.data.properties.total_funding_usd,
                    Website: this.findWebsite(organization.data.relationships.websites, "homepage"),
                    LinkedIn: this.findWebsite(organization.data.relationships.websites, "linkedin"),
                    Crunchbase: `https://www.crunchbase.com/organization/${this.state.value}`,
                    Categories: organization.data.relationships.categories.items.map(item => {
                        return item.properties.name
                    }).join(", "),
                    Investores: organization.data.relationships.investors.items.filter(item => {
                        return item.type === "Organization"
                    }).map(item => {
                        return item.properties.name
                    }).join(", "),
                    Founders: response.data.data.relationships.founders.items.map(item => {
                        return `${item.properties.first_name} ${item.properties.last_name}`
                    }).join(", ")
                }
                this.setState({organization: {img: organization.data.properties.profile_image_url, org}});
            }
        }
    }

    async sendRequest() {
        if (this.state.organization) {
            await axios.post('/data/row', {data: this.state.organization.org}).catch(e => {
                toast.error(e.response.data, {
                    position: toast.POSITION.BOTTOM_LEFT
                });
            }).then((e) => {
                if (e.status === 200) {
                    toast.success("Added To AirTable!", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                }
            });
        } else {
            toast.error("first select a company!", {
                position: toast.POSITION.BOTTOM_LEFT
            });
        }
    }

    changeText(e) {
        this.setState({value: e.target.value});
    }

    render() {
        const inputStyle = {
            position: "absolute",
            width: "20%",
            left: "30%",
            top: "5vh"
        }
        const {organization} = this.state;
        return (
            <div>
                <ToastContainer/>
                <div className="background"></div>
                <TextField
                    hintText="Type anything"
                    id="text-field-controlled"
                    value={this.state.value}
                    style={inputStyle}
                    onChange={this.changeText.bind(this)}
                />
                <FlatButton label="Search In CrunchBase" onClick={this.handleChange.bind(this)} style={{
                    position: "absolute",
                    width: "30%",
                    left: "50%",
                    top: "5vh"
                }}/>
                {
                    organization ?
                        <FlatButton label="Add To AirTable" onClick={this.sendRequest.bind(this)} style={{
                            position: "absolute",
                            width: "30%",
                            left: "70%",
                            top: "5vh"
                        }}/> : null
                }

                {organization ? <img src={organization.img}/> : null}
                <div className={"content"}>
                    {
                        organization ?
                            Object.keys(organization.org).map(item => {
                                return <div className={"row"} key={item}>
                                    <p className={"row20"}>{item}</p>
                                    <p className={"row80"}>{organization.org[item]}</p>
                                </div>
                            })
                            : null
                    }
                </div>
            </div>
        );
    }
}