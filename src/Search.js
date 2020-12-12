import './Search.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import {faSearch} from '@fortawesome/fontawesome-free-solid';
import Suggestion from './Suggestion';

class Search extends React.Component{

   constructor(props) {
    super(props);
    this.state = {searchText: "", displayError: false,suggestions:[]};

    this.handleText = this.handleText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  handleText(event) {
      this.setState({
        searchText: event.target.value,
        displayError:false
      })
  }

  changeText(name) {
    this.setState({searchText: name,suggestions:[]});
    document.forms[0].getElementsByTagName("input")[0].value = name;
    this.props.onSelectStockSymbol(name);
  }

  handleSubmit(event){
    event.preventDefault();
    if (this.state.searchText)
    fetch("https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q="+this.state.searchText, {
  	   "method": "GET",
  	   "headers": {
  		   "x-rapidapi-key": "3a9ba90b6bmsh998df516fc42018p11bf88jsn6e473b2e1f6b",
  		   "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
  	   }
     })
     .then(response => response.json())
     .then(data => {
        this.response(data.quotes)
     })
     .catch(err => {
  	   this.setState({displayError:true})
     })
  }

  response(data)
  {
    if (!data)
    {
       this.setState({displayError:true})
       return;
     }
    if (data.length === 1 || this.state.searchText === data[0].symbol)
    {
      this.setState({suggestions:[]})
      this.props.onSelectStockSymbol(this.state.searchText);
    }
    else
    {
      this.props.onSelectStockSymbol("");
      this.setState({suggestions:data})
    }
    console.log(data)
  }

  render(){

    var suggestion = "";
    if (!this.state.displayError && this.state.suggestions.length>0)
      suggestion = (
      <div className="suggestions">
       <div> Please select one of the following companies:</div>
       <div className="suggestions-list">
       {
         this.state.suggestions.map(
           (item, key) => <Suggestion data={item} key={key} activateFunction={this.changeText}></Suggestion>
         )
       }
       </div>
      </div>
       );
    else if (this.state.displayError)
      suggestion = (<div className="suggestions"> "There is no company/ stock symbol found"</div>);

    return (
    <div>
      <form onSubmit={this.handleSubmit} >
        <input type="text" onChange={this.handleText}/>
        <button>
          <FontAwesomeIcon icon={faSearch}/>
          </button>
      </form>
        {suggestion}
    </div>
  );
  }
}

export default Search;
