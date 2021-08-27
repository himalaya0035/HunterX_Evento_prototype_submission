import React from 'react'

function ShowMessage({msg,type}) {
    return (
        <div style={{display:"flex"}}>
           <i className="fa fa-exclamation-triangle" style={{marginRight:"5px",color:"#c91f26"}}></i><p style={type == 'Error' ? {color:"#c91f26"} : {color:"green"}}>{msg}</p>
        </div>
    )
}

export default ShowMessage
