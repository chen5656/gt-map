import React, {
    useState,
    useRef,
    useEffect,
    useContext
} from 'react';

import Button from '@material-ui/core/Button';

import { PickerOverlay } from 'filestack-react';
import {insertNewToAirTable} from '../../service/airtable/airtableFunctions';
import {  NotesContext} from '../../context/GlobalState';


const NewNoteForm =({serviceId})=>{
    const txtNode = useRef(null);
    const [attachments,setAttachment]=useState([]);
    const [showFileStack,setFileStackOn]=useState(false);
    const {  refreshNotes } = useContext(NotesContext);


    function showUpload(){
        setFileStackOn(!showFileStack);
        
    }
    function submitAttachment(res){
        if(res.filesUploaded.length>0){
            setAttachment([...attachments, {
                name:res.filesUploaded[0].filename,
                url:res.filesUploaded[0].url,
            }])
        }       
    }

    function submitNotes(event){
        var notesDetails=txtNode.current.value;
        var attachment =  attachments.map(item=>{
            return {"url":item.url};            
        });
        //insertNewToAirTable
        let data = {
            "records": [
              {
                "fields": {
                  notes: notesDetails,
                  attachments: attachment,
                  service_schedule: [serviceId],
                }
              }]
          }
        insertNewToAirTable( "service_notes", data).then((result)=>{            
            refreshNotes();
            clearNotesInfo();
        })        
        event.preventDefault();
    }

    function clearNotesInfo(){

        setFileStackOn(false);
        txtNode.current.value='';
        setAttachment([]);
    }

    // return <form className="editbox" onSubmit={submitNotes}>
    return <div  style={{paddingTop:"10px"}}>
        <h2 className="esri-widget__heading">Add Notes</h2>
        <textarea  rows="4" style={{width:"100%"}} ref={txtNode}></textarea>
        <div>
            <button onClick={showUpload}>Upload Attachments</button>
            {showFileStack&& 
            <PickerOverlay 
            pickerOptions ={{fromSources:['local_file_system', 'url','googledrive'] }}
             apikey={"AeHONhRgnTmmlsmAyn09gz"} 
              onSuccess={submitAttachment}/>
             }
            <div>
                {attachments.map(item=>{
                    return (<span key={item.name}>
                        <a href={item.url}  target='_blank'>{item.name.slice(0,8)}</a>, 
                    </span>)
                })}
            </div>
        </div>
        <Button variant="contained" color="primary"  onClick={submitNotes} style={{margin:5}}>Submit</Button>
    </div>
}

export default NewNoteForm;