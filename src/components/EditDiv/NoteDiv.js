import React from 'react';

const OneNotes=({item})=>{
  return <p >
   <b>{item.fields.created + " "}</b>
  {item.fields.notes&&item.fields.notes}<br /> 
  {item.fields.attachments&&item.fields.attachments.map((attachment,i)=>{
      return (
      <a href={attachment.url} target="_blank" rel="noreferrer" i key={i}>
      { (attachment.thumbnails&&attachment.thumbnails.large)?
       <img src={attachment.thumbnails.large.url} width="210" alt='note photo'/>
       :"file"
        }  
      </a>)
  }) }
</p>
}

const ViewNotes =(props)=>{
    return <div style={{overflow:"auto", height:"650px"}}>
        {props.noteData.map(item=>{
            return <OneNotes item={item}  key={item.fields.id}/>
        })}
    </div>
}

export default ViewNotes;