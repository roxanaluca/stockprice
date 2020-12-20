import React,{useState} from 'react';

const Settings =(props) =>{

  const changePropsToText = (value)=>{
    var d1 = new Date(value*1000)
    let monthName = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    var dataString = d1.getDate()+" "+monthName[d1.getMonth()]+" " +d1.getFullYear()
    return dataString
  }

  const [startDateValue, setStartDateValue] = useState(changePropsToText(props.date.start))
  const [endDateValue, setEndDateValue] = useState(changePropsToText(props.date.end))
  const [buttonState, setButtonStateValue] = useState(props.buttonState)
  const [startSpanDisplay, setStartSpanDisplay] = useState("none")
  const [endSpanDisplay,setEndSpanDisplay] = useState("none")
  const [messageDisplay, setMessageDisplay] = useState("none")

  const handleDate = (event) =>{
     event.preventDefault();
      if (endSpanDisplay === "none" &&
          startSpanDisplay === "none") {
          var start =new Date(startDateValue).getTime()/1000;
          var end = new Date(endDateValue).getTime()/1000;
          setMessageDisplay("none");
          props.updateChart(start,end,buttonState)
      }
      else setMessageDisplay("block");
  }

  const verifyDate = (event)=> {
    var data =new Date(event.target.value)
    if (data instanceof Date && !isNaN(data))
      if (event.target.id==="startDate")
      {
        setStartDateValue(event.target.value)
        setStartSpanDisplay("none")
      }
      else{
        setEndDateValue(event.target.value)
        setEndSpanDisplay("none")
      }
    else if (event.target.id==="endDate"){
        setEndDateValue(event.target.value)
        setEndSpanDisplay("block")
      }
      else {
        setStartDateValue(event.target.value)
        setStartSpanDisplay("block")
    }
  }

  const changeButtonValue = (event)=> {
    if (buttonState)
      setButtonStateValue(false);
    else setButtonStateValue(true);
  }

  const getCurrentValues =() =>{
    setStartDateValue(changePropsToText(props.date.start));
    setEndDateValue(changePropsToText(props.date.end));
    setStartSpanDisplay("none")
    setEndSpanDisplay("none")
    if (props.isAverageDisplayed)
      setButtonStateValue(props.isAverageDisplayed)
    setMessageDisplay("none");
  }

  return (
  <div>
    <h3>Settings</h3>
    <div id="settings-message" style={{display:messageDisplay}}>Please check the dates</div>
    <form onSubmit={handleDate} onReset={getCurrentValues}>
    <div>
      <label> StartDate</label>
      <input id="startDate" type="text" onChange={verifyDate} value={startDateValue}/>
      <span style={{display:startSpanDisplay}}>*</span>
    </div>
    <div>
      <label> EndDate </label>
      <input id="endDate" type="text" onChange={verifyDate} value={endDateValue}/>
      <span style={{display:endSpanDisplay}}>*</span>
    </div>
    <div>
      <label> Displays average </label>
      <input type="button" onClick={changeButtonValue} value={buttonState?"ON":"OFF"}/>
    </div>
    <input type="submit" value="Send"/>
    <input type="reset" />
    </form>
  </div>
  )
}

export default Settings;
