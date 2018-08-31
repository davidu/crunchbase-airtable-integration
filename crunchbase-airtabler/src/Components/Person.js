import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

export default class Person extends React.Component {
    constructor(props) {
        super(props);
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
                        <CopyToClipboard text={organization.org.Name}>
                            <h1 onClick={(() => {
                                this.props.toastSuccess("Copied Name")
                            }).bind(this)}>{organization.org.Name}</h1>
                        </CopyToClipboard>
                        <div style={{marginTop: "1rem"}}>
                            {
                                ["Company", "Title", "LinkedIn"].map(item => {
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
                </div>
            </div>

        );
    }

}