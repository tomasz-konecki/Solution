import React from "react";
import PropTypes from "prop-types";
import Icon from "../../../common/Icon";

const SkypeId = (props) => {
    const icon = props.hasId ? 
        <Icon icon="skype" iconType="fab" />
        :
        <img
            src="/public/img/skypeforbusiness.jpeg"
            className="businessSkypeIcon"
        />;
    const id = props.hasId ? props.employee.skypeId : "Skype For Business";

    return(
        <a
            title={props.title}
            className="skype col"
            href={props.href}
        >
            {icon}
            <span className="skypeId">{id}</span>
        </a>
    );
}
SkypeId.propTypes = {
    employee: PropTypes.object,
    hasId: PropTypes.bool.isRequired
};

  export default SkypeId;