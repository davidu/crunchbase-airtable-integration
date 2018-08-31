import React from "react";
import CopyToClipboard from 'react-copy-to-clipboard';

export default class Company extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let {organization} = this.props;
        return (
            <div className={"content"}>
                <div>
                    <div className={"content__img"}>
                        <img src={organization.img} alt=""/>
                    </div>
                    <div className={"content__data"}>
                        <div>
                        <CopyToClipboard text={organization.org.Name}>
                            <h1 onClick={(() => {
                                this.props.toastSuccess("Copied Name")
                            }).bind(this)}>{organization.org.Name}</h1>
                        </CopyToClipboard>
                        <CopyToClipboard text={organization.org.Description}>
                            <p className={"content__data_description"} onClick={(() => {
                                this.props.toastSuccess("Copied Description")
                            }).bind(this)}>{organization.org.Description}</p>
                        </CopyToClipboard>
                        </div>
                        <div>
                            <p className={"content__data_property"}>Location: </p>
                            <CopyToClipboard text={organization.org.Location}>
                                <p className={"content__data_field"} onClick={(() => {
                                    this.props.toastSuccess("Copied Location")
                                }).bind(this)}>{organization.org.Location}</p>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
                <div className={"content__other"}>
                    {
                        ["TotalFunding", "Industries", "Investores", "Founders"].map(item => {
                            return <div className={"content__other_item"}>
                                <p className={"content__data_property"}>{`${item}:`}</p>
                                <CopyToClipboard text={organization.org[item]}>
                                    <p className={"content__data_field"} onClick={(() => {
                                        this.props.toastSuccess(`Copied ${item}`)
                                    }).bind(this)}>{organization.org[item]}</p>
                                </CopyToClipboard>
                            </div>
                        })
                    }
                </div>
                <div className={"content__websites"}>
                    {
                        ["Website", "LinkedIn"].map(item => {
                            return <div className={"content__other_item"}>
                                <p className={"content__data_property"}>{`${item}:`}</p>
                                <CopyToClipboard text={organization.org[item]}>
                                    <p className={"content__data_field"} onClick={(() => {
                                        this.props.toastSuccess(`Copied ${item}`)
                                    }).bind(this)}>{organization.org[item]}</p>
                                </CopyToClipboard>
                            </div>
                        })
                    }
                </div>
            </div>

        );
    }
}