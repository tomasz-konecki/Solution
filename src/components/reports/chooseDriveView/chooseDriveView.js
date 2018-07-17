import React from 'react'
import './chooseDriveView.scss';
import Icon from '../../common/Icon';
const chooseDriveView = ({selectOneDrive, selectGDrive, goToNonePage}) => (
    <div className="choose-drive-content">   
        <div onClick={selectGDrive} className="btn-container">
            <p>Google Drive</p>
            <i className="fab fa-google-drive"></i>
        </div>
        <div onClick={selectOneDrive} className="btn-container">
            <p>One Drive</p>
            <i className="fab fa-windows"></i>
        </div>
        <button onClick={goToNonePage} className="come-back-btn">Wróć</button>
    </div>
);

export default chooseDriveView;