import React from "react";

export default class Person extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                "img": "http://public.crunchbase.com/t_api_images/v1497335239/epay0pg43gwlapvbpbtx.png",
                "org": {
                    "Name": "Eric Young",
                    "Title": "Partner and Co-Founder",
                    "LinkedIn": "https://www.linkedin.com/in/eric-young-9ba618/"
                }
            }

        }
    }

    render() {
        return (
            <div className={"content"}>

            </div>
        );
    }

}