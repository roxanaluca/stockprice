import logo from './logo.svg';
import './App.css';
import React from 'react';
import Search from './Search';

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

      <h1>{this.state.searchName}</h1>
    </div>
    );
  }
}

export default App;
