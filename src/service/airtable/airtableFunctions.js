
//
import { getAirtableConfig } from "../../config";
const config = getAirtableConfig();
const api_key = config.apiKey;
const baseId_prjSchedule=config.baseId.prjSchedule;


export const insertNewToAirTable = async ( tableName, data) => {
  var url = `https://api.airtable.com/v0/${baseId_prjSchedule}/${tableName}`;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + api_key);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try{  
    let response = await fetch(url, requestOptions);
    let result = await response.json();
    return result

  }catch(error){
    console.log('error', error)
  }
}

export const updateAirTableData = async ( tableName, data) => {


  var url = `https://api.airtable.com/v0/${baseId_prjSchedule}/${tableName}`;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + api_key);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try{  
    let response = await fetch(url, requestOptions);
    let result = await response.json();
    return result

  }catch(error){
    console.log('error', error)
  }
}

export const getAirTableData = async (tableName, viewId) => {

  var url = [
    "https://api.airtable.com/v0/",
    baseId_prjSchedule,
    "/",
    encodeURIComponent(tableName),
    "?",
    "api_key=",
    api_key,
    "&view=",
    viewId
  ].join("");
  var myHeaders = new Headers();
  myHeaders.append("Cookie", "brw=brw5HsjuoBPMIYHCf");
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  try{  
    let response = await fetch(url, requestOptions);
    let result = await response.json();
    return result

  }catch(error){
    console.log('error', error)
  }
}


