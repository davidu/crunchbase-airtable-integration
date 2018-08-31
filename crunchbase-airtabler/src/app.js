import React, {Component} from "react";
import {TextField, FlatButton, SelectField, MenuItem} from "material-ui";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KeySwitch from "./Components/KeySwitch";
import Company from "./Components/Company";
import VCFirm from "./Components/VCFirm";
import Person from "./Components/Person";
import axios from "axios";
import Loader from 'react-loaders'

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
            organizationType: undefined,
            key: "",
            organiztion: {},
            framework: "crunchbase",
            searched: false
        }
    }

    componentDidMount() {
        this.getKey();
    }

    changeSearched() {
        this.setState({searched: !this.state.searched});
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
            TotalFunding: (organization.data.properties.total_funding_usd).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            }),
            Website: this.findWebsite(organization.data.relationships.websites, "homepage"),
            LinkedIn: this.findWebsite(organization.data.relationships.websites, "linkedin"),
            Crunchbase: `https://www.crunchbase.com/organization/${this.state.value}`,
            Industries: organization.data.relationships.categories.items.map(item => {
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

    async getVentureCapitalFirmData(organization) {
        let items = "";
        for (let item of organization.data.relationships.investments.items) {
            let response = await axios.get(`${item.relationships.invested_in.properties.api_url}?user_key=${this.state.key}`);
            let categories = response.data.data.relationships.categories.items.map(item => {
                return item.properties.name
            }).reduce((x, y) => x.includes(y) ? x : [...x, y], []).join(",");
            items += categories + ", ";
        }
        items = items.substring(0, items.length - 2);
        items = items.split(',').reduce((x, y) => x.includes(y) ? x : [...x, y], []).join(", ");
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
            Industries: items
        }
        return item;
    }

    getPersonData(person) {
        return {
            Name: `${person.data.properties.first_name} ${person.data.properties.last_name}`,
            Company: person.data.relationships.primary_affiliation.item.relationships.organization.properties.name,
            Title: person.data.relationships.primary_affiliation.item.properties.title,
            LinkedIn: this.findWebsite(person.data.relationships.websites, "linkedin")
        }
    }

    async handleChange() {
        if (this.state.value === "") {
            toast.error("Type a valid value", {
                position: toast.POSITION.BOTTOM_LEFT
            });
        } else {
            this.setState({organization: undefined});
            this.changeSearched();
            let response = await axios.get(`https://api.crunchbase.com/v3.1/${this.state.organizationType === PEOPLE ? 'people' : 'organizations'}/${this.state.value}?user_key=${this.state.key}`).catch(e => {
                toast.error("item is not exist(don't forget to use the preamble!)", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                this.changeSearched();
            });
            if (response.data) {
                let org = await (this.state.organizationType === COMPANY ? this.getComapnyData(response.data) : (this.state.organizationType === VENTURE_CAPITAL_FIRM ? this.getVentureCapitalFirmData(response.data) : this.getPersonData(response.data)));
                this.setState({
                    organization: {img: response.data.data.properties.profile_image_url, org},
                    response: response.data
                }, this.changeSearched);
            }
        }
    }

    async sendRequest() {
        if (this.state.organization) {
            await axios.post('/data/row', {
                data: this.state.organization.org,
                type: this.state.organizationType
            }).catch(e => {
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

    getRightObject() {
        let { organization } = this.state;
        switch (this.state.organizationType) {
            case COMPANY:
                return <Company
                    toastSuccess={this.toastSuccess.bind(this)}
                    organization={organization}/>
            case VENTURE_CAPITAL_FIRM:
                return <VCFirm
                    toastSuccess={this.toastSuccess.bind(this)}
                    organization={organization}/>
            case PEOPLE:
                return  <Person
                    toastSuccess={this.toastSuccess.bind(this)}
                    organization={organization}/>
        }
    }

    render() {
        const {organization, searched} = this.state;
        console.log(JSON.stringify(organization));
        return (
            <div className={"app"}>
                <ToastContainer/>
                <div className={"app__headline"}>
                    <KeySwitch open={this.state.keySwitchOpen}
                               close={this.openKeySwitch.bind(this)}
                               toastSuccess={this.toastSuccess.bind(this)}
                               toastError={this.toastError.bind(this)}/>
                    <div style={{display: "flex", width: "80%", justifyContent: "space-between"}}>
                        <TextField
                            hintText="Type a VC firm, company, or person"
                            id="text-field-controlled"
                            value={this.state.value}
                            onChange={this.changeText.bind(this)}
                        />
                        <SelectField
                            hintText={"Choose"}
                            value={this.state.organizationType}
                            onChange={this.changeOrganization.bind(this)}
                        >
                            {
                                ALL_TYPES.map(i => {
                                    return <MenuItem value={i} primaryText={i}/>
                                })
                            }
                        </SelectField>
                        <div className={"btn"} onClick={this.handleChange.bind(this)}><p>Search</p></div>
                        <div className={"btn"} onClick={this.sendRequest.bind(this)}><p>Add</p></div>
                    </div>
                    <div className={"btn__key"} onClick={this.openKeySwitch.bind(this)}><p>🔑</p></div>

                    <img src="/img/logo.png" className={"logo"} alt=""/>
                </div>
                {
                    searched ? (
                        organization ? this.getRightObject() : <Loader type="square-spin" />
                    ) : organization ? this.getRightObject() : null


                }
            </div>
        );
    }
}