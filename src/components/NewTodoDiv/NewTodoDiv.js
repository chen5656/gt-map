import React ,{
  useRef,
  useState,
} from 'react';
  import Button from '@material-ui/core/Button';
import AppraisalInfo from "../../service/AppraisalData"
import {insertNewToAirTable} from '../../service/airtable/airtableFunctions';
import {getStreetViewImage} from '../../service/googleFunctions';
import   "./NewTodoDiv.css";

const NewTodoDiv=(props)=>{
  const who = useRef(null);
  const status = useRef(null);
  const customerId = useRef(null);
  const [appraisalData,setAppraisalData] = useState(null);
  function handleSave() {
    let feature=props.feature;
    let data = {
      "records": [
        {
          "fields": {
            address: feature.attributes.Place_addr,
            scheduledEngineer: who.current.value,
            status:status.current.value,
            customerId:customerId.current.value,
            latitude: feature.geometry.latitude,
            longitude: feature.geometry.longitude,
          }
        }]
    };
    insertNewToAirTable( "service_schedule", data).then((record)=>{
      props.setSearchResult(null);
      props.clearSearch();
    
      //create payment data
      let paymentData = {
        "records": [{
          "fields": {
            service_schedule: [record.records[0].id],
            status: "Open",
          }
        }]
      };
      insertNewToAirTable( "payment", paymentData).then((record)=>{
      });

      if(appraisalData){
        //add new appraisal data each time. Have a separate script to clean the appraisal data each week.
        let data = {
            "records": [
              {
                "fields": {
                  floor_area:appraisalData.floor_area,
                  year_built:appraisalData.year_built,
                  structure_type:appraisalData.structure_type, //two_stroies
                  doing_business_as:appraisalData.doing_business_as,
                  current_assessed_value:appraisalData.current_assessed_value,
                  first_owner_name:appraisalData.first_owner_name,
                  second_owner_name:appraisalData.second_owner_name,
                  site_address:appraisalData.site_address,
                  property_class:appraisalData.property_class,//single family
                  assessing_use_description:appraisalData.assessing_use_description,//residential
                  Match_addr:record.records[0].fields.address,
                  street_view: [{"url":getStreetViewImage(record.records[0].fields.address)}],
                  service_schedule: [record.records[0].id],
                }
              }]
          } 
        insertNewToAirTable( "appraisal", data).then((result)=>{   
          props.setProjectData(null);    
        })

      }else{
        let data = {
          "records": [
            {
              "fields": {
                Match_addr:record.records[0].fields.address,
                street_view: [{"url":getStreetViewImage(record.records[0].fields.address)}],
                service_schedule: [record.records[0].id],
              }
            }
          ]
        }
        insertNewToAirTable( "appraisal", data).then((result)=>{   
          props.setProjectData(null);    
        })
        // props.setProjectData(null);    
      }


    })
  }

  return <div className="bottom" >
    <button onClick={()=>{props.setSearchResult(null)}} className="closeBtn icon-btn">X</button>
    <div className="title">
      <button className="esri-icon-zoom-in-magnifying-glass icon-btn"></button>{props.feature.attributes.Match_addr}
    </div>
    <div> 
        <label>Add</label> 
        <select ref={who}>
          <option value="All">All</option>
          <option value="Chi Shen">Chi</option>
          <option value="Siwei Chen">Siwei</option>
        </select>

        <select ref={status}>
          <option value="Todo">Todo</option>
          <option value="On progress">On progress</option>
          <option value="Done">Done</option>
        </select>
        <select ref={customerId}>
          {
            props.customerData.map(item=>{
              var value=item.fields["po_number"];
              return   <option value={value} key={value}>{value}</option>
            })
          }
        </select>

        <Button variant="contained" color="primary"  onClick={handleSave} style={{margin:5}}>Save</Button>
    </div>
   <AppraisalInfo  feature={props.feature } setAppraisalData={setAppraisalData}/>
  </div>
}

export default NewTodoDiv;