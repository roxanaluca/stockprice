import React from 'react';
import './Chart.css';
import equal from 'fast-deep-equal'
import Label from './Label';
import Settings from './Settings';

class Chart extends React.Component {

  constructor(props) {
      super(props)
      this.canvasRef = React.createRef();
      this.state = {
        prices:[],
        startPosition:0,
        endPosition:-1,
        searchName:"",
        currentDate:"",
        currentPrice:"",
        currentAverage:"",
        message:"",
        heightMin:0.0,
        heigthMax:0.0,
        isAverageDisplayed: true
      };
      this.renderChart = this.renderChart.bind(this);
      this.drawLine = this.drawLine.bind(this);
      this.request = this.request.bind(this);
      this.getInfo = this.getInfo.bind(this);
      this.showPrice = this.showPrice.bind(this);
      this.hidePrice = this.hidePrice.bind(this);
  }

  drawLine(ctx, coords, color){
    if (coords.length> 2)
    {
      ctx.beginPath();
      ctx.moveTo(coords[0],coords[1])
      var i = 1;
      while (2*i<coords.length)
      {
        ctx.lineTo(coords[i*2],coords[i*2+1])
        i++;
      }
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = color
      ctx.stroke()
    }
  }

  getInfo(){
    var i=this.state.startPosition;
    var low = this.state.prices[i].close;
    var high = this.state.prices[i].close;
    var average = 0;
    var arrayCopy = this.state.prices;
    for (;i<this.state.endPosition;i++)
    {
      if (this.state.prices[i].close < low)
        low = this.state.prices[i].close;
      if (this.state.prices[i].close > high)
        high = this.state.prices[i].close;
      if (this.state.prices[i].close)
        average += this.state.prices[i].close;
      else
      {
        arrayCopy.splice(i,1)
        i = i - 1;
        this.setState({endPosition:this.state.endPosition-1})
      }
    }

    var diff = this.state.endPosition- this.state.startPosition;
    return [Math.floor(low),Math.ceil(high),average/diff ]
  }

  renderChart() {
    if (this.state.startPosition<this.state.endPosition){
      var canvas = this.canvasRef.current
      var context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height);
      var dim = this.getInfo()
      var diff = dim[1] - dim[0] + 1

      var inc = canvas.width/(this.state.endPosition-this.state.startPosition)
      var x = 0.0
      var y;
      var ArrayClose = []

      for (var i = this.state.endPosition-1;i>=this.state.startPosition;i--){
        y = canvas.height/diff * (dim[1] - this.state.prices[i].close);

        ArrayClose = ArrayClose.concat(x,y)
        x = x + inc;
      }

      this.setState({heightMin:dim[0],heightMax:dim[1]})
      this.drawLine(context, ArrayClose,"#000000")
      document.getElementById("currentPrice").style.display = "none";
      document.getElementById("currentDate").style.display = "none";
      document.getElementById("bullet").style.display = "none";
      if (this.state.isAverageDisplayed){
         y = canvas.height/diff * (dim[1] - dim[2])
         this.drawLine(context, [0.0,y,canvas.width,y], "#00FF00");
         document.getElementById("currentAverage").style.top = (y-5.0)+"px";
         this.setState({currentAverage:dim[2]})
       }
    }
  }

  showPrice(event){
    var canvas = event.target;
    var rect = canvas.getBoundingClientRect();
    var xMouse = event.clientX - rect.left;
    //get the position of the value accordingly to date
    var dif =(this.state.endPosition-this.state.startPosition);
    var index = Math.trunc(xMouse/rect.width * dif);
    var revindex = this.state.endPosition - index -1;
    var date = new Date(this.state.prices[revindex].date*1000);
    let monthName = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var dataString = date.getDate()+" "+monthName[date.getMonth()]+" " +date.getFullYear();
    var price = this.state.prices[revindex].close
    //recompute the (x,y) of the point
    var x = rect.height/(this.state.heightMax - this.state.heightMin + 1) * (price - this.state.heightMin +1.0)
    var y = index * rect.width/dif;
    document.getElementById("bullet").style.display = "inline-block";
    document.getElementById("bullet").style.bottom = (x+2.5)+"px";
    document.getElementById("bullet").style.left = (y-2.5)+"px";
    document.getElementById("currentPrice").style.display = "block";
    document.getElementById("currentDate").style.display = "block";
    document.getElementById("currentPrice").style.bottom = (x-3)+"px";
    document.getElementById("currentDate").style.left = (y-5)+"px";
    document.getElementById("currentAverage").style.display="none";

    this.setState({currentDate:dataString, currentPrice: price})
  }

  hidePrice(event){
    this.setState({currentDate:"",currentPrice:""})
    document.getElementById("bullet").style.display = "none";
    document.getElementById("currentPrice").style.display = "none";
    document.getElementById("currentDate").style.display = "none";
    document.getElementById("currentAverage").style.display="block";
  }

  request(searchName) {
    this.setState({message:"Please wait"})
    fetch("https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data?symbol="+searchName, {
       "method": "GET",
       "headers": {
         "x-rapidapi-key": "3a9ba90b6bmsh998df516fc42018p11bf88jsn6e473b2e1f6b",
         "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
       }
     })
     .then(response => response.json())
     .then(data => {
        if (data.prices)
        {
          this.setState({
              searchName:searchName,
              prices:data.prices,
              startPosition:0,
              endPosition:data.prices.length,
              message:""
            })
          this.renderChart()
        }
     })
     .catch(err => {
        this.setState({
          prices:[],
          startPosition:0,
          endPosition:-1,
          searchName:"",
          message:"No data found about this symbol/company",
          heightMin:0.0,
          heightMax:0.0
        })
     })
  }

  componentDidUpdate(prevProps,prevState){
    if (!equal(this.props.searchName,prevProps.searchName) &&
        !equal(this.state.searchName,this.props.searchName) &&
        this.props.searchName && !equal(prevState.message,"Please wait")) {
      this.request(this.props.searchName)
    }
  }

  componentDidMount() {
     this.request(this.props.searchName)
  }

  render(){
    return(
    <div>
      <h1>{this.state.searchName}</h1>
      {
        (this.state.prices && this.state.startPosition<this.state.endPosition) ?
      <div className="grid" >
        <div className="canvas">
          <canvas ref={this.canvasRef} onMouseMove={this.showPrice} onMouseOut={this.hidePrice} />
          <div id="bullet" className="dot"/>
        </div>
        <div className="part-right">
            <Label name="currentPrice" text= "Current Price" value = {this.state.currentPrice}/>
            <Label name="currentAverage" text= "Current Average" value = {this.state.currentAverage}/>
        </div>
        <div className="part-down">
            <Label name="currentDate" text= "Current date"  value = {this.state.currentDate}/>
        </div>
        <Settings dates={[
          this.state.prices[this.state.endPosition - 1].date,
          this.state.prices[this.state.startPosition].date
        ]} isAverageDisplayed={this.state.isAverageDisplayed} />
      </div>
      :
      <div>{this.state.message}</div>
    }
    </div>
  );
  }
}

export default Chart;
