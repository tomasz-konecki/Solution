import React from 'react'
import Modal from 'react-responsive-modal';
import Spinner from '../../common/spinner/spinner';
import './modal.scss';
import ServerError from '../../common/serverError/serverError';
import Button from '../../common/button/button';
const generateReportModal = ({shouldOpenModal, closeModal, generateShareLinkStatus, generateShareLinkErrors,
    generatedShareLink, fileToShare, path, copyLink}) => (
    <Modal
    key={1}
    open={shouldOpenModal}
    classNames={{ modal: "modal-gen-link Modal" }}
    contentLabel="Generate link modal"
    onClose={closeModal}
    >
    {fileToShare && 
    <React.Fragment>
        <header>
            <h3>{generateShareLinkStatus === null ? "Tworzenie linku do udostępnienia" : "Stworzony link do udostępnienia"}</h3>    
        </header>
        {generateShareLinkStatus !== null ?
            generateShareLinkStatus ? 
            <div className="gen-link-modal-container">
                <article>
                    <p>Własnie stworzono link do udostępniania pliku: <b>{fileToShare.name}</b></p>
                    <div>
                        <figure>
                            <i className={`fa ${fileToShare.type === "folder" ? "fa-folder" : "fa-file"}`}></i>
                            <span>Otwórz w 
                                <i className={`fab ${path.search("/onedrive") !== -1 ?
                                "fa-windows" : "fa-google-drive"}`}>
                                </i>
                            </span>
                        </figure>
                        <div>
                            <p><span>Identyfikator: </span><b>{fileToShare.id}</b></p>
                            <p><span>Nazwa: </span><b>{fileToShare.name}</b></p>
                            {fileToShare.size && 
                                <p><span>Rozmiar: </span><b>{fileToShare.size}</b></p>
                            }
                            {fileToShare.parentPath && 
                                <p><span>Ścieżka: </span><b>{fileToShare.parentPath}</b></p>
                            }
                        </div>
                    </div>
                </article>
                <div>
                    <span>
                        {generatedShareLink}
                    </span>
                    <Button onClick={copyLink}
                    mainClass="option-btn option-dang">
                        Skopiuj link <i className="fa fa-copy"></i>
                    </Button>
                </div>
            </div> : 

            <ServerError errorClass="whole-page-error"
            message={generateShareLinkErrors[0]}/> : 
            <Spinner />
        }
    </React.Fragment>
    }
    
    
  </Modal>

);

export default generateReportModal;