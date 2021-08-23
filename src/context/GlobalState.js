import React, { createContext, useState, useEffect } from 'react';

import {
  getAirTableData
} from '../service/airtable/airtableFunctions';

const getAllProjects = (mapName) => {
  if (mapName === 'main') {
    return getAirTableData("service_schedule", "for_map");
  }
  if (mapName === 'need-invoice') {
    return getAirTableData("service_schedule", "for_map_need_invoice");
  }
}

const getAllNotes = () => {
  return getAirTableData("service_notes", "active_service_notes");
}

const getAllAppraisal = () => {
  return getAirTableData("appraisal", "active_service_appraisal");
}

const getCustomerId = () => {
  return getAirTableData("customer", "customerId");
}

const getAllNeedPayment = () => {
  return getAirTableData("payment", "for_map");
}

export const MainMapContext = createContext(null);
export const NotesContext = createContext(null);

export const AppraisalContext = createContext(null);
export const CustomerIdContext = createContext(null);
export const NeedPaymentContext = createContext(null);

export const MainMapProvider=(props)=> {
    const [prjOnProgress, setDataOnProgress] = useState();
    const [prjNeedInvoice, setDataNeedInvoice] = useState();
    function handleRefreshOnProgress(){
        getAllProjects('main').then((result) => {
            setDataOnProgress(result.records);
      });
    }
    
    function handleRefreshNeedInvoice(){
        getAllProjects('need-invoice').then((result) => {
            setDataNeedInvoice(result.records);
      });
    }
    useEffect(()=> {
        handleRefreshOnProgress()
        handleRefreshNeedInvoice()
    },[])
    
    
    return (
      <MainMapContext.Provider value={{
        prjData:{
            needInvoice: prjNeedInvoice,
            main:prjOnProgress
        },
        refreshPrjOnGoing:handleRefreshOnProgress,
        refreshPrjDone:handleRefreshNeedInvoice,
      }}>
        {props.children}
      </MainMapContext.Provider>
    )
    
}

export const NotesProvider=(props)=> {
  const [data, setData] = useState([]);
  function handleRefresh(){
    getAllNotes().then((result) => {
        setData(result.records);
    });
  }
  useEffect(() => {
    setTimeout(function(){
      handleRefresh();
    }, 1500); 
  },[]);
  
  return (
    <NotesContext.Provider value={{
        notesData: data,
        refreshNotes:handleRefresh,
    }}>
      {props.children}
    </NotesContext.Provider>
  )
  
}

export const AppraisalProvider=(props)=> {
    const [data, setData] = useState();
    function handleRefresh(){
        getAllAppraisal().then((result) => {
          setData(result.records);
      });
    }
    
    useEffect(() => {
      setTimeout(function(){
        handleRefresh();
      }, 2000); 
    },[]);
    return (
      <AppraisalContext.Provider value={{
        houseData: data,
        refreshHouseData:  handleRefresh,
      }}>
        {props.children}
      </AppraisalContext.Provider>
    )
    
}
export const CustomerIdProvider=(props)=> {
    const [data, setData] = useState();
    function handleRefresh(){
        getCustomerId().then((result) => {
            setData(result.records);
        });
    }
      
    useEffect(()=> {
        handleRefresh()
    },[])
      return (
        <CustomerIdContext.Provider value={{
            customerData: data,
            handleRefresh,
        }}>
          {props.children}
        </CustomerIdContext.Provider>
      )
      
}
export const NeedPaymentProvider = (props) => {
    const [data, setData] = useState([]);
    function handleRefresh() {
        getAllNeedPayment().then((result) => {
            setData(result.records);
        });
    }

    useEffect(() => {
      setTimeout(function(){
        handleRefresh();
      }, 500); 
    }, [])
      return (
        <NeedPaymentContext.Provider value={{
            paymentData: data,
            refreshNeedPayment:handleRefresh,
        }}>
          {props.children}
        </NeedPaymentContext.Provider>
      )
      
}