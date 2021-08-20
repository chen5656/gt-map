import React, {
    useEffect
} from 'react';

import {
    getAirTableData
} from './airtableFunctions';

export const getAllProjects = (mapName) => {
    if(mapName==='main'){
        return getAirTableData( "service_schedule", "for_map");

    }
    if(mapName==='need-invoice'){
        return getAirTableData( "service_schedule", "for_map_need_invoice");
    }
}

export  const getAllNotes = () => {
    return getAirTableData("service_notes", "active_service_notes");
}

export  const getAllAppraisal = () => {
    return getAirTableData("appraisal", "active_service_appraisal");
}

export  const GetSchedulerData = (props) => {

    useEffect(() => {
        if (!props.noteData) {
            getAllNotes().then((result) => {
                props.setNoteData(result.records);
            });
        }
    }, [props.noteData]);
    return null
}
