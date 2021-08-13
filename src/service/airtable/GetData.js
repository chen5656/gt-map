import React, {
    useEffect
} from 'react';

import {
    getAirTableData
} from './airtableFunctions';

const getAllProjects = () => {
    return getAirTableData( "service_schedule", "for_map");
}

const getAllNotes = () => {
    return getAirTableData("service_notes", "active_service_notes");
}

const getAllAppraisal = () => {
    return getAirTableData("appraisal", "active_service_appraisal");
}

const getCutomerId=()=>{
    return getAirTableData("customer", "customerId");
}

const getAllNeedPayment=()=>{
    return getAirTableData("payment", "for_map");
}


export const GetSchedulerData = (props) => {
    
    useEffect(() => {
        if(!props.customerData){            
            getCutomerId().then((result) => {
                props.setCustomerData(result.records);
            });
        }
    },[]);

    useEffect(() => {
        if (!props.data) {
            getAllProjects().then((result) => {
                props.setData(result.records);
            });
            getAllAppraisal().then((result) => {
                props.setHouseData(result.records);
            });
        }
    }, [props.data]);
    useEffect(() => {
        if (!props.noteData) {
            getAllNotes().then((result) => {
                props.setNoteData(result.records);
            });
        }
    }, [props.noteData]);
    return null
}

export  const GetPaymentData = (props)=>{
    useEffect(() => {           
        getAllNeedPayment().then((result) => {
            props.setNeedPaymentData(result.records);
        });        
    },[]);
    return null
}