import React from 'react'
import './list.scss';
import _ from 'lodash';

class List extends React.PureComponent {
    state = {
        searchInput: {value: "", error: ""},
        sortOrder: "asc",
        currentFilteringBy: {value: null, description: "Bez filtrowania"},
        showFilterDetails: false
    }

    togleFilterDetails = () => {
        const { showFilterDetails } = this.state;
        this.setState({showFilterDetails: !showFilterDetails});
    }

    selectFilterCategory = (e, currentFilteringBy) => {
        e.stopPropagation();
        this.setState({currentFilteringBy});
    }


    putModifieListOptionsInDom = (functionsToUse, numberOfItems) => {
        if(functionsToUse){
            const shouldPutSearchBox = functionsToUse.find(item => item.name === "search");
            const shouldPutSort = functionsToUse.find(item => item.name === "sort");
            const shouldFilter = functionsToUse.find(item => item.name === "filter");
            let filterCategories = null;
            if(shouldFilter)
                filterCategories = [{value: null, description: "Bez filtrowania"}, ...shouldFilter.posibleValues];

            const { sortOrder, searchInput, currentFilteringBy, showFilterDetails } = this.state;
            return (
                <div className="modifie-list-options">
                    {shouldPutSearchBox && 
                    <div className="search-box">
                        <input value={searchInput.value} type="text" onChange={e => this.searchByKeys(e)} placeholder="wpisz, aby wyszukać..." />
                        <i className="fa fa-search"></i>
                        <span className="items-counter">{numberOfItems}</span>
                    </div>
                    }
                    {shouldPutSort && 
                    <div onClick={() => this.setState({sortOrder: sortOrder === "asc" ? "desc" : "asc"})} className="sort-box">
                        Sortuj <i className={`fa fa-${sortOrder === "asc" ? "arrow-down" : "arrow-up"}`}></i>
                    </div>
                    }
                    {shouldFilter && 
                    <div onClick={this.togleFilterDetails} className="filter-box">
                        Filtr <i className="fa fa-cogs"></i>
                        <span className="items-counter">{numberOfItems}</span>
                        {showFilterDetails && 
                            <div className="filter-sugestions">
                                {filterCategories.map(category => (
                                    <div onClick={e => this.selectFilterCategory(e, category)} className={currentFilteringBy.description === category.description ? "selected-category" : ""} key={category.value}>{category.description}</div>
                                ))}
                            </div>
                        }
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
            const shouldFilter = functionsToUse.find(item => item.name === "filter");
            let modifiedElements = [];
            const { currentFilteringBy } = this.state;
          
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
   
            if(shouldFilter){
                const listToUse = modifiedElements.length > 0 ? modifiedElements : originalList;
                if(currentFilteringBy.value === null)
                    return listToUse;


                modifiedElements = listToUse.filter(element => {
                   return element[shouldFilter.filterBy] === currentFilteringBy.value
               });

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
    stopEventPropagationer = (item, operationName, e) => {
        const { clickItemFunction } = this.props;
        if(e !== undefined){
            e.stopPropagation();
        }
        clickItemFunction(item, operationName);
    }

    render(){
        const { listClass, paginationSettings, component: Component, componentProps, 
            listTitle, selectDataOptions, items, functionsToUse, shouldAnimateList  } = this.props;

        const modifiedItems = this.modifeList(items, functionsToUse);
        return (
            <React.Fragment>
                <nav className="list-nav">
                    {listTitle && <p>{listTitle}</p>}

                    {this.putModifieListOptionsInDom(functionsToUse, modifiedItems.length)}
                </nav>
                <div className={`${listClass} ${shouldAnimateList ? "animated-list" : ""}`}>
                    {modifiedItems.length > 0 ? 
                        Component ? 
                        modifiedItems.map((item, index) => (
                            <Component clickItemFunction={(e, operationName) => this.stopEventPropagationer(item, operationName, e)} key={index} item={item} {...componentProps}  />
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
