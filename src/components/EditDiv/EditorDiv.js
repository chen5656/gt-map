import React, {
    useState,
    useRef,
    useEffect,
    useContext
} from 'react';

import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';

import AttachmentIcon from '@material-ui/icons/Attachment';
import AppleIcon from '@material-ui/icons/Apple';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIcon from '@material-ui/icons/Assignment';

import FeatureForm from '@arcgis/core/widgets/FeatureForm';
import FormTemplate from '@arcgis/core/form/FormTemplate';

import { PickerOverlay } from 'filestack-react';
import {insertNewToAirTable,updateAirTableData} from '../../service/airtable/airtableFunctions';
import NoteDiv from "./NoteDiv"
import HouseInfo from "./HouseInfo"
import { MainMapContext, NotesContext, AppraisalContext} from '../../context/GlobalState';

import "./EditorDiv.css";



const RouteButton =(props)=>{

      let url = `https://www.google.com/maps/dir/?api=1&destination=${props.address}&travelmode=driving`;
      if (props.platform === "apple") url = `http://maps.apple.com/?address=${props.address}`;     

    return <Button variant="outlined" target='_blank'color="primary"  href={url} title = {`Route in ${props.platform}`}  style={{margin :5}}>{props.icon}</Button>
}

const RouteButtons=(props)=>{    
      return <div> 
        <RouteButton platform = "google" address={props.address } icon = {"Google"}/>
        <RouteButton platform= "apple"  address={props.address  } icon={<AppleIcon/>}/>
       </div>
}

const UpdateServiceSchedule=(props)=>{
    useEffect(() => {
        if(props.updateValue){
            let updated=props.updateValue;
            //update
            let data = {
                "records": [{
                    "id": updated.airId,
                    "fields": {
                        status: updated.status,
                        scheduled_date: updated.scheduled,
                        scheduledEngineer: updated.who,
                        estimate:parseFloat (updated.estimate),
                    }
                }]
            }

            updateAirTableData( "service_schedule", data).then(record => { 
                props.refreshMap();
            });


            props.setUpdateValue(null);
        }

    },[props.updateValue]);
    return null
}

function EditorForm(props) {
    const editorForm = useRef(null);
    const [featureForm, setFeatureForm]=useState(null);
    const [updateValue,setUpdateValue]=useState(null);
    useEffect(() => {
        if (editorForm.current) {
            let featureForm = createFeatureForm(props.feature, editorForm.current);

            featureForm.on("submit", () => {
                const updated = featureForm.getValues();
                setUpdateValue(updated);               
            });
            setFeatureForm(featureForm);
        }
    }, [props.feature]);

    function createFeatureForm(feature, formDiv) {

        formDiv.innerHTML = "";
        const groupElement = {
            type: "group",
            label: feature.attributes.address.split(",")[0],
            description:feature.attributes.customerId,
            elements: [{
                type: "field",
                fieldName: "who",
                label: "Scheduled Engineer",
                input: { 
                    type: "combo-box",
                }
            }, {
                type: "field",
                fieldName: "scheduled",
                label: "Scheduled Date and Time",
                input: { 
                    type: "datetime-picker",
                    includeTime: true,
                    min: 1621609178000,
                    max: 1937141978000
                }
            }, {
                type: "field",
                fieldName: "status",
                label: "Status",
                input: { // autocastable to DateTimePickerInput
                    type: "combo-box",
                }
            }, {
                type: "field",
                fieldName: "estimate",
                label: "Estimate ($)",
                input: { // autocastable to DateTimePickerInput
                    type: "text-box",
                }
            }]
        };
        const template = new FormTemplate({
            title: "Update",
            elements: [groupElement] // Add all elements to the template
        });
        const featureForm = new FeatureForm({
            container: formDiv,
            feature: feature,
            formTemplate: template
        });
        return featureForm;
    }
    
    function handleSubmit(){
        featureForm.submit();
    }

    return <div  >
        <div ref={editorForm}></div>
        <div style={{fontSize: "small",color: "#6e6e6e",marginTop:"3px"}}>Last updated: {props.feature.attributes.lastModified}</div>
        <Button variant="contained" color="primary" onClick={handleSubmit}  style={{margin:5}}>Save</Button>
        <UpdateServiceSchedule updateValue={updateValue} setUpdateValue={setUpdateValue} refreshMap={props.refreshMap}/>
    </div>
}

const NewNoteForm =({serviceId, refreshNotes})=>{
    const txtNode = useRef(null);
    const [attachments,setAttachment]=useState([]);
    const [showFileStack,setFileStackOn]=useState(false);

    function showUpload(){
        setFileStackOn(true);
    }
    function submitAttachment(res){
        if(res.filesUploaded.length>0){
            setAttachment([...attachments, {
                name:res.filesUploaded[0].filename,
                url:res.filesUploaded[0].url,
            }])
        }       
        setFileStackOn(false);
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
        })
        
        event.preventDefault();
    }

    // return <form className="editbox" onSubmit={submitNotes}>
    return <div  style={{paddingTop:"10px"}}>
        <h2 className="esri-widget__heading">Add Notes</h2>
        <textarea  rows="4" style={{width:"100%"}} ref={txtNode}></textarea>
        <div>
            <button onClick={showUpload}>Upload Attachments</button>
            {showFileStack&& <PickerOverlay  apikey={"AeHONhRgnTmmlsmAyn09gz"}  onSuccess={submitAttachment}/>}
                <div>
                {attachments.map(item=>{
                    return <><span key={item.name}>
                            <a href={item.url}  target='_blank'>{item.name.slice(0,8)}</a>
                        </span>
                        <span>, </span>
                    </>
                })}
            </div>
        </div>
        <Button variant="contained" color="primary"  onClick={submitNotes} style={{margin:5}}>Submit</Button>
    </div>
}
function TabPanel(props) {    
    const { children, value, index, ...other } = props;  
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div >
              {children}
          
          </div>
        )}
      </div>
    );
}
function EditorDiv(props) {
    const [value, setValue] = React.useState(0);
    const { houseData } = useContext(AppraisalContext);
    const { refreshPrjOnGoing, refreshPrjDone } = useContext(MainMapContext);
    const { notesData, refreshNotes } = useContext(NotesContext);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const refreshMap = () => {
        props.setSelectedFeature(null);
        refreshPrjOnGoing();
        refreshPrjDone();

    }
    let thisNoteData=notesData.filter(note=>
        note.fields.service_schedule[0]===props.feature.attributes.airId
    );
    let thisHouseData=houseData.filter(data=>
        data.fields.service_schedule[0]===props.feature.attributes.airId
    );

    return <div  className="right" >
    <div className={"address-title"}>{props.feature.attributes.address}    </div>   
        <RouteButtons address={props.feature.attributes.address} />             
        <button onClick={()=>{props.setSelectedFeature(null)}} className="closeBtn icon-btn">X</button>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="edits"
        >
          <Tab label={<AssignmentIcon/>} />
     
          <Tab label={ <Badge badgeContent={thisNoteData.length} color="primary">  <AttachmentIcon /></Badge>} />
          <Tab label={ <Badge variant="dot" invisible={!thisHouseData.length} color="primary"><HomeIcon/></Badge>} disabled={thisHouseData.length?false:true} />
        </Tabs>
        <TabPanel value={value} index={0}>
            <>
                <div className="editbox">
                    <EditorForm  feature={props.feature}  refreshMap={refreshMap}/></div>
                <div className="editbox">
                    <NewNoteForm serviceId={props.feature.attributes.airId} refreshNotes={refreshNotes}/>
                </div>
            </>
        </TabPanel>
        <TabPanel value={value} index={1} style={{padding:"5px",backgroundColor:"#ececec"}}>
            <NoteDiv noteData={thisNoteData} />
        </TabPanel>
        <TabPanel value={value} index={2} style={{padding:"5px",backgroundColor:"#ececec"}}>
           { thisHouseData.length  && <HouseInfo data={thisHouseData} />}
        </TabPanel>
    </div>;
}



export default EditorDiv;