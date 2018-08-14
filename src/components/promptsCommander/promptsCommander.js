import React from 'react'
import './promptsCommander.scss';
import { connect } from 'react-redux';
import { changeShowGlobal } from '../../actions/progressBarActions';
const items = [
    {name: "Powiadomienie 1", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 2", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 3", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 4", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: false},
    {name: "Powiadomienie 5", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: false},
    {name: "Powiadomienie 6", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 7", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 8", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true}
]
class PromptsCommander extends React.Component{
    render(){
        const isGenerating = true;
        const { shouldShowGlobal, changeShowGlobal } = this.props;
        const menuClass = shouldShowGlobal ? "menu-expanded" : "menu-collapsed";
        const btnClass = shouldShowGlobal ? "btn-expanded" : "btn-collapsed";
        const btnAnimationClass = isGenerating ? shouldShowGlobal ? 
            "btn-exp-activated" : "btn-col-activated" : null;
        return (
            <React.Fragment>
                <div onClick={() => changeShowGlobal(!shouldShowGlobal)} className={`comunicates-window ${menuClass}`}>
                    <header>
                        <span>Powiadomienia</span>
                    </header>
                    <ul className="notifictions">
                        {items.map(i => {
                            return (
                                <li key={i.name}>
                                    <i className={`fa ${i.isShowed ? "fa-check" : "fa-times"}`}></i>
                                    <div className="not-content">
                                        <b>{i.name}</b> {i.content}
                                        <p>{i.date} <b>1000 dni temu</b></p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    
                    <footer>
                        <button className="showed-btn">
                            Odczytane <i className="fa fa-check"></i>
                        </button>
                        <button className="not-showed-btn">
                            Nieodczytane <i className="fa fa-times"></i>
                        </button>
                    </footer>
                </div> 
                
                <button title="Komunikaty" 
                    onClick={() => changeShowGlobal(!shouldShowGlobal)} 
                    className={`comunicates-btn ${btnClass} ${btnAnimationClass}`}>
                    <i className="fa fa-bell"></i>
                    {isGenerating && shouldShowGlobal && 
                        <article>
                            Aktualnie generuje raport dla: <b> Tomasza Kutergnogi</b>
                        </article>
                    }
                    <div/>
                </button>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        shouldShowGlobal: state.progressBarReducer.shouldShowGlobal
    };
  };
  const mapDispatchToProps = dispatch => {
    return {
        changeShowGlobal: (shouldShowGlobal) => dispatch(changeShowGlobal(shouldShowGlobal))
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(PromptsCommander);
  
