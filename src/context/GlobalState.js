import React , { createContext,useState,useEffect}from 'react';

import {
    getAirTableData
} from '../service/airtable/airtableFunctions';

 const getAllProjects = (mapName) => {
    if(mapName==='main'){
        return getAirTableData( "service_schedule", "for_map");

    }
    if(mapName==='need-invoice'){
        return getAirTableData( "service_schedule", "for_map_need_invoice");
    }
}

  const getAllNotes = () => {
    return getAirTableData("service_notes", "active_service_notes");
}

  const getAllAppraisal = () => {
    return getAirTableData("appraisal", "active_service_appraisal");
}

 const getCustomerId=()=>{
    return getAirTableData("customer", "customerId");
}

const getAllNeedPayment=()=>{
    return getAirTableData("payment", "for_map");
}

export const MainMapContext = createContext(null);
export const NeedInvoiceMapContext = createContext(null);
export const NotesContext = createContext(null);

export const AppraisalContext = createContext(null);
export const CustomerIdContext = createContext(null);
export const NeedPaymentContext = createContext(null);

export const MainMapProvider=(props)=> {
    const [data, setData] = useState();
    function handleRefresh(){
        getAllProjects('main').then((result) => {
            setData(result.records);
      });
    }
    useEffect(()=> {
        handleRefresh()
    },[])
    
    
    return (
      <NeedInvoiceMapContext.Provider value={{
        data: data,
        handleRefresh,
      }}>
        {props.children}
      </NeedInvoiceMapContext.Provider>
    )
    
}
  
export const NeedInvoiceMapProvider=(props)=> {
    const [data, setData] = useState();
    function handleRefresh(){
        getAllProjects('need-invoice').then((result) => {
            setData(result.records);
      });
    }
    useEffect(()=> {
        handleRefresh()
    },[])
    
    return (
      <NeedInvoiceMapContext.Provider value={{
        data: data,
        handleRefresh,
      }}>
        {props.children}
      </NeedInvoiceMapContext.Provider>
    )
    
}

export const NotesProvider=(props)=> {
  const [data, setData] = useState();
  function handleRefresh(){
    getAllNotes().then((result) => {
        setData(result.records);
    });
  }
  useEffect(()=> {
      handleRefresh()
  },[])
  
  return (
    <NotesContext.Provider value={{
        data: data,
        handleRefresh,
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
    
    useEffect(()=> {
        handleRefresh()
    },[])
    return (
      <AppraisalContext.Provider value={{
          data: data,
          handleRefresh,
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
            data: data,
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
        handleRefresh()
    }, [])
      return (
        <NeedPaymentContext.Provider value={{
            paymentData: data,
            handleRefresh,
        }}>
          {props.children}
        </NeedPaymentContext.Provider>
      )
      
}