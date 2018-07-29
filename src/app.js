import React, {Component} from "react";
import {TextField, FlatButton, SelectField, MenuItem} from "material-ui";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KeySwitch from "./Components/KeySwitch";
import axios from "axios";

const VENTURE_CAPITAL_FIRM = "Venture Capital Firm";
const COMPANY = "Company";
const PEOPLE = "People";
const ALL_TYPES = [VENTURE_CAPITAL_FIRM, COMPANY, PEOPLE];
const FUNDING_TYPES = {
    seed: "Seed",
    angel: "Angel",
    venture: "Venture",
    equity_crowdfunding: "Equity Crowdfunding",
    product_crowdfunding: "Product Crowdfunding",
    private_equity: "Private Equity",
    convertible_note: "Convertible Note",
    debt_financing: "Debt Financing",
    secondary_market: "Secondary Market",
    grant: "Grant",
    post_ipo_equity: "Post-IPO Equity",
    post_ipo_debt: "Post-IPO Debt",
    non_equity_assistance: "Non-Equity Assistance",
    undisclosed: "Undisclosed",
    corporate_round: "Corporate Round",
    initial_coin_offering: "Initial Coin Offering",
    post_ipo_secondary: "Post-IPO Secondary",
    series_a: "Series A",
    series_b: "Series B",
    series_c: "Series C",
    series_d: "Series D",
    series_e: "Series E",
    series_f: "Series F",
    series_g: "Series G",
    series_h: "Series H",
    series_i: "Series I",
    series_j: "Series J",
    series_unknown: "Venture - Series Unknown"
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            keySwitchOpen: false,
            organizationType: COMPANY,
            key: "",
            organiztion: {},
            framework: "crunchbase"
        }
    }

    componentDidMount() {
        this.getKey();
    }

    async getKey() {
        let response = await axios.get(`/key/${this.state.framework}`);
        this.setState({key: response.data})
    }

    findWebsite(websites, type) {
        let website = websites.items.find(website => {
            return website.properties.website_type === type
        });

        return website ? website.properties.url : "";
    }

    getComapnyData(organization) {
        return {
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
            Founders: organization.data.relationships.founders.items.map(item => {
                return `${item.properties.first_name} ${item.properties.last_name}`
            }).join(", ")
        }
    }

    getVentureCapitalFirmData(organization) {
        return {
            Name: organization.data.properties.name,
            Description: organization.data.properties.description,
            Location: organization.data.relationships.offices.item.properties.country === "Israel" ? "Israel" : "Foreign",
            "Investment Stage": organization.data.relationships.investments.items.map(inv => {
                let {funding_type, series} = inv.relationships.funding_round.properties;
                return FUNDING_TYPES[funding_type];
            }).reduce((x, y) => x.includes(y) ? x : [...x, y], []).join(", "),
            Website: this.findWebsite(organization.data.relationships.websites, "homepage"),
            LinkedIn: this.findWebsite(organization.data.relationships.websites, "linkedin"),
            Categories: organization.data.relationships.categories.items.map(item => {
                return item.properties.name
            }).join(", ")
        }
    }

    getPersonData(person) {
        return {
            Name: `${person.data.properties.first_name} ${person.data.properties.last_name}`,
            Title: person.data.relationships.primary_affiliation.item.properties.title,
            LinkedIn: this.findWebsite(person.data.relationships.websites, "linkedin")
        }
    }

    getTheInvestmentStage(data) {

    }

    async handleChange() {
        if (this.state.value === "") {
            toast.error("Type a valid value", {
                position: toast.POSITION.BOTTOM_LEFT
            });
        } else {
            console.log(this.state);
            let response = await axios.get(`https://api.crunchbase.com/v3.1/${this.state.organizationType === PEOPLE ? 'people' : 'organizations'}/${this.state.value}?user_key=${this.state.key}`).catch(e => {
                toast.error("item is not exist(don't forget to use the preamble!)", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
            });
            if (response.data) {
                let org = this.state.organizationType === COMPANY ? this.getComapnyData(response.data) : (this.state.organizationType === VENTURE_CAPITAL_FIRM ? this.getVentureCapitalFirmData(response.data) : this.getPersonData(response.data));
                this.setState({
                    organization: {img: response.data.data.properties.profile_image_url, org},
                    response: response.data
                });
            }
        }
    }

    async sendRequest() {
        if (this.state.organization) {
            await axios.post('/data/row', {data: this.state.organization.org, type: this.state.organizationType}).catch(e => {
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

    toastSuccess(message) {
        toast.success(message, {
            position: toast.POSITION.BOTTOM_LEFT
        });
    }

    toastError(message) {
        toast.error(message, {
            position: toast.POSITION.BOTTOM_LEFT
        });
    }

    changeText(e) {
        this.setState({value: e.target.value});
    }

    openKeySwitch() {
        this.setState({keySwitchOpen: !this.state.keySwitchOpen})
    }

    changeOrganization(event, index, value) {
        console.log(value);
        this.setState({
            organizationType: value,
        }, this.handleChange);
    }

    render() {
        const inputStyle = {
            position: "absolute",
            width: "20%",
            left: "10%",
            top: "5vh"
        }
        const {organization} = this.state;
        return (
            <div>
                <KeySwitch open={this.state.keySwitchOpen}
                           close={this.openKeySwitch.bind(this)}
                           toastSuccess={this.toastSuccess.bind(this)}
                           toastError={this.toastError.bind(this)}/>
                <ToastContainer/>
                <div className="background"></div>
                <TextField
                    hintText="Type anything"
                    id="text-field-controlled"
                    value={this.state.value}
                    style={inputStyle}
                    onChange={this.changeText.bind(this)}
                />
                <SelectField
                    floatingLabelText="Crunchbase Search"
                    value={this.state.organizationType}
                    style={{
                        position: "absolute",
                        fontSize: "1.6rem",
                        width: "20%",
                        left: "35%",
                        top: ".69vh"
                    }}
                    onChange={this.changeOrganization.bind(this)}
                >
                    {
                        ALL_TYPES.map(i => {
                            return <MenuItem value={i} primaryText={i} />
                        })
                    }
                </SelectField>
                <FlatButton label="Search In CrunchBase" onClick={this.handleChange.bind(this)} style={{
                    position: "absolute",
                    width: "20%",
                    left: "55%",
                    top: "5vh"
                }}/>
                {
                    organization ?
                        <FlatButton label="Add To AirTable" onClick={this.sendRequest.bind(this)} style={{
                            position: "absolute",
                            width: "20%",
                            left: "70%",
                            top: "5vh"
                        }}/> : null
                }
                <FlatButton label="🔑" onClick={this.openKeySwitch.bind(this)} style={{
                    position: "absolute",
                    width: "1%",
                    left: "95%",
                    top: "5vh"
                }}/>
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