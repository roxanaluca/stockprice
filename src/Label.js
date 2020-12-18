import React from 'react';

function Label(props)
{
  return (
  <div id={props.name}>
    <div> {props.text}</div>
    <div>{props.value}</div>
  </div>);

}

export default Label;
