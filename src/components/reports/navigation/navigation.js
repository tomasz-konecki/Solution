import React from 'react'

const navigation = ({addListLength, baseListLength, valueToSearch, searchInTeamList, openReportsModals}) => (
    <header>
        <h1>Generowanie raportów</h1>
        <nav>
            <div>
                <b><i className="fa fa-users"></i>{addListLength}</b>
                <b><i className="fa fa-search"></i>{baseListLength}</b>
            </div>
            <div className="searcher-container">
                <input value={valueToSearch}
                    onChange={searchInTeamList} type="text"
                    placeholder="wpisz nazwę drużyny..." />
            </div>
            <button disabled={addListLength > 0 ? false : true}
                onClick={openReportsModals} className="generate-raport-btn">
                <i className="fa fa-plus"></i>
                Generuj raport
            </button>

        </nav>
    </header>
);
export default navigation;