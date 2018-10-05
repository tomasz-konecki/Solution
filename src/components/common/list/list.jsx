import React from 'react'
import './list.scss';
import _ from 'lodash';

class List extends React.PureComponent {
    state = {
        searchInput: {value: "", error: ""},
        sortOrder: "asc"
    }

    putModifieListOptionsInDom = (functionsToUse) => {
        if(functionsToUse){
            const shouldPutSearchBox = functionsToUse.find(item => item.name === "search");
            const shouldPutSort = functionsToUse.find(item => item.name === "sort");
            const { sortOrder, searchInput } = this.state;
            return (
                <div className="modifie-list-options">
                    {shouldPutSearchBox && 
                    <div className="search-box">
                        <input value={searchInput.value} type="text" onChange={e => this.searchByKeys(e)} placeholder="wpisz, aby wyszukać..." />
                        <i className="fa fa-search"></i>
                    </div>
                    }
                    {shouldPutSort && 
                    <div onClick={() => this.setState({sortOrder: sortOrder === "asc" ? "desc" : "asc"})} className="sort-box">
                        Sortuj <i className={`fa fa-${sortOrder === "asc" ? "arrow-down" : "arrow-up"}`}></i>
                    </div>
                    }
                </div>
            );
        }
        return null;
    }

    modifeList = (originalList, functionsToUse) => {
        if(functionsToUse){
            const shouldPutSearchBox = functionsToUse.find(item => item.name === "search");
            const shouldPutSort = functionsToUse.find(item => item.name === "sort");
            let modifiedElements = [];
          
            if(shouldPutSearchBox){
                const { searchInput } = this.state;
                modifiedElements = originalList.filter(element => {
                    return element[shouldPutSearchBox.searchBy].toUpperCase().search(searchInput.value.toUpperCase()) !== -1
                });
            }
            if(shouldPutSort){
                const { sortOrder } = this.state;
                modifiedElements = _.orderBy(modifiedElements, shouldPutSort.sortBy, sortOrder);
            }

            return modifiedElements;
        }
        
        return originalList;
    }

    searchByKeys = (e) => {
        this.setState({searchInput: {value: e.target.value, error: ""}})
    }

    putEmptyListComponentInDOM = () => {
        const { noItemsComponent: NoItemsComponent, noItemsComponentProps } = this.props;
        if(NoItemsComponent !== undefined){
            return <NoItemsComponent {...noItemsComponentProps} />
        }
        else{
            return (
                <div {...noItemsComponentProps} className="empty-list-content">
                    <span>Brak wyników</span>
                    <div>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )
        }
    }
    render(){
        const { listClass, paginationSettings, component: Component, componentProps, 
            listTitle, selectDataOptions, clickItemFunction, items, functionsToUse, shouldAnimateList  } = this.props;

        const modifiedItems = this.modifeList(items, functionsToUse);
        return (
            <React.Fragment>
                <nav className="list-nav">
                    {listTitle && <p>{listTitle}</p>}

                    {this.putModifieListOptionsInDom(functionsToUse)}
                </nav>
                <div className={`${listClass} ${shouldAnimateList ? "animated-list" : ""}`}>
                    {modifiedItems.length > 0 ? 
                        Component ? 
                        modifiedItems.map((item, index) => (
                            <Component clickItemFunction={() => clickItemFunction(item)} key={index} item={item} {...componentProps}  />
                        )) :
                        modifiedItems.map((item, index) => (
                            <div {...componentProps} key={index} >
                            </div>
                        ))
                        : 
                        this.putEmptyListComponentInDOM()
                    }
                    
                </div>
                {paginationSettings && 
                <div className="pagination">

                </div>
                }
                
            </React.Fragment>
            
        );
    }
}        
List.defaultProps = {
    listClass: "list"
}
export default List;
