import React from 'react';

function Settings(props){

  const handleDate = (event) =>
  {

  }

  const verifyDate = (event) =>
  {

  }

  var d1 = new Date(props.dates[0])
  var d2 = new Date(props.dates[1])
  let monthName = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  var dataString1 = d1.getDate()+" "+monthName[d1.getMonth()]+" " +d1.getFullYear()
  var dataString2 = d2.getDate()+" "+monthName[d2.getMonth()]+" " +d2.getFullYear()
  return (
    <form onSubmit={handleDate}>
    <div>
      <label> StartDate</label>
      <input type="text" onChange={verifyDate} value={dataString1} />
    </div>
    <div>
      <label> EndDate </label>
      <input type="text" onChange={verifyDate} value={dataString2} />
    </div>
    <div>
      <label> Displays average </label>
      <input type="button" value={(props.isAverageDisplayed)?"ON":"OFF"}/>
    </div>
    <input type="submit" />
    </form>)
}

export default Settings;
