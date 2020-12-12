import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleDoubleRight} from '@fortawesome/fontawesome-free-solid';

function Suggestion(props)
{
  if (props.data)
    return (
      <div onClick={()=> props.activateFunction(props.data.symbol)}>
      <FontAwesomeIcon icon={faAngleDoubleRight}/>
      <span>{props.data.longname}<br/>{props.data.symbol}</span>
      </div>
    );
}
export default Suggestion;
