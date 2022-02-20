import React from "react";

function NewPostInfo(props) {
  return(
    <div className="new-post-info">
      <label>
        Post name: 
        <input onChange={(e) => props.handleInputChange(e)} name={'newPostName'} placeholder="E.g. 'Bakery'"></input>
      </label>
      
      <label>
        Hint: 
        <input onChange={(e) => props.handleInputChange(e)} name={'newHint'} maxLength={500} placeholder={"Max 500 characters"}></input>
      </label>

      <button onClick={() => props.handleSavePost()}>Save post</button>
    </div>
  )
}

export default NewPostInfo;