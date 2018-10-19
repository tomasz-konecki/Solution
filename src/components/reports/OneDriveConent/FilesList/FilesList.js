import React from 'react'
import File from './File/File';
import FolderLoader from '../../../common/spinner/folder-loader';
import Button from '../../../common/button/button';
import { translate } from 'react-translate';
import './FilesList.scss';

const FilesList = ({folders, folderIsLoadingId, sortList, driveSortType, chooseFolderToCreateShareLink, t, ...content}) => {
    return (
    <ul className="current-folders">
        <Button 
            onClick={() => sortList(!driveSortType)}
            mainClass="files-btn" title={t("Sort")}>
            <i className={`fa ${driveSortType ? "fa-sort-alpha-up" : "fa-sort-alpha-down"}`}></i>
        </Button> 
        {folders.map(folder => {
            return (
                folderIsLoadingId === folder.id ? 
                <FolderLoader key={folder.id} /> : 
                <File {...content} folder={folder} key={folder.id} t={t} chooseFolderToCreateShareLink={chooseFolderToCreateShareLink} />
            );
        })}
    </ul> 
    );
        
}

export default translate("Files")(FilesList);