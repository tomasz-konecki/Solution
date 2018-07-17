import React from 'react'
import File from './File/File';
import FolderLoader from '../../../common/spinner/folder-loader';

const FilesList = ({folders, folderIsLoadingName, ...content}) => (
    <ul className="current-folders">
        {folders.map(folder => {
            return (
                folderIsLoadingName === folder.name ? 
                <FolderLoader key={folder.name} /> : 
                <File {...content} folder={folder} key={folder.name} />
            );
        })}
    </ul> 
);

export default FilesList;