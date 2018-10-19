import React from 'react';
import SmallSpinner  from '../../../../common/spinner/small-spinner';
import { prepareToLongStringToShow } from '../../../../../services/methods';
import DetailExpander from '../../../../common/detail/detail';

const file = ({folder, openFolder, editFolderError, isDeletingOrEditingFolder, 
    onSubmit, currentOpenedFileDetailId, showDeleteFolderModal, onStateChange,
    onEditFolder, onChangeFolderName, currentOpenedFolderToEditId, 
    enableFolderEdit, editFolderName, closeEditingFolderName, onFileClick, 
    chooseFolder, choosenFolder, extendId, extendDetailName, chooseFolderToCreateShareLink, t }) => {


    let parentPath = null
    if(folder.parentPath)
        parentPath = prepareToLongStringToShow(11, folder.parentPath);

    return (
    <li onDoubleClick={folder.type !== "file" ? () => openFolder(folder) : null}
    className={choosenFolder ? folder.id === choosenFolder.id ? "selected-folder" : null : null}

        onClick={folder.type === "file" ? 
            folder.size ? 
            () => onFileClick(folder.id) : 
            () => window.open(folder.webUrl)
            : null}
        key={folder.name}>

        {(currentOpenedFolderToEditId === folder.id && folder.type !== "file") ? 
            <form onSubmit={e => onEditFolder(e, folder.name)}>

                <input className={editFolderError ? "input-error" : null}
                type="text" value={editFolderName} 
                onChange={e => onChangeFolderName(e, folder.name)} />

                { isDeletingOrEditingFolder && <SmallSpinner /> } 
                
                { isDeletingOrEditingFolder || <i title={t("Confirm")} onClick={e => onEditFolder(e, folder.name)} className="fa fa-check"/> }
                { isDeletingOrEditingFolder || <i title={t("Deny")} onClick={closeEditingFolderName} className="fa fa-times"/> }
                
            </form> 
            : 
            <span>{folder.name}</span>
        }
        
        { folder.type !== "file" &&  <i onClick={() => openFolder(folder)} className="fa fa-folder-open" title={t("OpenFolder")}/> } 

        { folder.type !== "file" && <i onClick={() => chooseFolder(folder)} className="fa fa-cloud-upload-alt" title={t("ChooseFolderToGenerate")}/> }

        {
            folder.type !== "file" && 
            <div className="folders-icons">
                <i title={t("DeleteFolder")} onClick={() => showDeleteFolderModal(folder.id)} className="fa fa-trash"/>
                
                <i title={t("Edit")} onClick={() => enableFolderEdit(folder.id, folder.name)} className="fa fa-pen-square"/>

                <i title={t("ChooseFolderForLink")} onClick={e => chooseFolderToCreateShareLink(folder, e)} className="fa fa-share-alt-square"/>
            </div>
        }
        
        
        {folder.type === "file" && 
            <i title={t("ChooseFolderForLink")} onClick={e => chooseFolderToCreateShareLink(folder, e)} className="fa fa-share-alt-square"/> 
        }
       
      
        {(folder.id === currentOpenedFileDetailId && folder.type === "file") && 
            <div className="file-details">
                <p><b>{t("Type")}</b><span>{folder.type}</span></p>
                <p><b>{(t("Size"))}</b><span>{folder.size}</span></p>

                {parentPath && 
                <DetailExpander extendDetailName={extendDetailName} 
                    currentId={folder.id}
                    extend={extendId === folder.id ? true : false}
                    originalName={folder.parentPath}>
                    <b>{t("Path")}</b><span>{parentPath}</span>
                </DetailExpander>
                }
                

                <span onClick={() => window.open(folder.webUrl)}>{t("Open")}</span>
            </div>
        }
        

    </li>
    );
}

export default file;