import React from 'react';
import SmallSpinner  from '../../../../common/spinner/small-spinner';
import { prepareToLongStringToShow } from '../../../../../services/methods';
import DetailExpander from '../../../../common/detail/detail';

const file = ({folder, openFolder, editFolderError, isDeletingOrEditingFolder, 
    onSubmit, currentOpenedFileDetailId, showDeleteFolderModal, onStateChange,
    onEditFolder, onChangeFolderName, currentOpenedFolderToEditId, 
    enableFolderEdit, editFolderName, closeEditingFolderName, onFileClick, 
    chooseFolder, choosenFolder, extendId, extendDetailName }) => {


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
                
                { isDeletingOrEditingFolder ||
                    <i onClick={e => onEditFolder(e, folder.name)} 
                    className="fa fa-check"></i>
                }
                { isDeletingOrEditingFolder || 
                    <i onClick={closeEditingFolderName} className="fa fa-times"></i>
                }
                
            </form> 
            : 
            <span>{folder.name}</span>
        }
        
        {folder.type !== "file" && 
        <i onClick={() => openFolder(folder)} className="fa fa-folder-open"></i>
        }

        {folder.type !== "file" && 
            <i onClick={() => chooseFolder(folder)} className="fa fa-cloud-upload-alt"></i>
        }

        {
            folder.type !== "file" && 
            <div className="folders-icons">
                <i onClick={() => showDeleteFolderModal(folder.id)} className="fa fa-trash"></i>
                
                <i onClick={() => enableFolderEdit(folder.id, folder.name)}
                    className="fa fa-pen-square"></i>
            </div>
        }

        {(folder.id === currentOpenedFileDetailId && folder.type === "file") && 
            <div className="file-details">
                <p><b>Typ</b><span>{folder.type}</span></p>
                <p><b>Rozmiar</b><span>{folder.size}</span></p>

                {parentPath && 
                <DetailExpander extendDetailName={extendDetailName} 
                    currentId={folder.id}
                    extend={extendId === folder.id ? true : false}
                    originalName={folder.parentPath}>
                    <b>Ścieżka</b><span>{parentPath}</span>
                </DetailExpander>
                }
                
                <span onClick={() => window.open(folder.webUrl)}>Otwórz</span>
            </div>
        }
        

    </li>
    );
}

export default file;