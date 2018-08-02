import React from "react";

export default class Company extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: {
                "img": "/img/a.png",
                "org": {
                    "Name": "Grove",
                    "Description": "Grove is a personal trainer for the client's moneyThe company assesses where you are today and create a plan to make the client confident about their money. Through proprietary software combined with a team of Certified Financial Planners, Grove is able to offer personalized advice at a fraction of the price of traditional financial advisors.",
                    "Location": "Foreign",
                    "TotalFunding": 10100000,
                    "Website": "https://hellogrove.com",
                    "LinkedIn": "https://www.linkedin.com/company/usegrove/",
                    "Crunchbase": "https://www.crunchbase.com/organization/grove-5",
                    "Categories": "Financial Services, Finance, Advice, FinTech",
                    "Investores": "First Round Capital,  defy.vc, Next Play Capital, Fuel Capital, Lowercase Capital, Financial Solutions Lab, Tusk Ventures, Compound",
                    "Founders": "Chris Hutchins,  Chris  Doyle"
                }
            }
        }
    }

    render() {
        let {data} = this.state;
        return (
            <div className={"content"}>
                div.content
                <div className={"content__img"}>
                    <img src={data.img} alt=""/>
                </div>
                <div className={"content__data"}>
                    <h1>{ data.org.Name }</h1>
                    <p className={"content__data_description"}>{data.org.Description}</p>
                    <p className={"content__data_property"}>Location: </p><p className={"content__data_field"}>{data.org.Location}</p>
                </div>
            </div>

        );
    }
}