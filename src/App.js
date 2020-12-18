import logo from './logo.svg';
import './App.css';
import React from 'react';
import Search from './Search';
import Chart from './Chart';

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {searchName: ""};
    this.onSelectStockSymbol = this.onSelectStockSymbol.bind(this);
  }

  onSelectStockSymbol(name){
    this.setState({searchName: name});
  }

  render(){

    return (
    <div className="App">
      <div>
        <header className="App-header">
          <div className="App-header-name">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              StockPrice
            </p>
          </div>
          <Search onSelectStockSymbol={this.onSelectStockSymbol}/>
        </header>
      </div>
      {(this.state.searchName)?<Chart searchName={this.state.searchName} />:""}
    </div>
    );
  }
}

export default App;
