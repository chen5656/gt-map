import React, {
    useRef,
    useEffect,
    useState,
} from 'react';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';

import {GetPaymentData} from "../../service/airtable/GetData";


const useStyles = makeStyles((theme) => ({
  noPayment: { "fontSize": "32px", "margin": "10px", "top": "200px", "position": "absolute" },
  table: {
    width: "100vw",
  },
  count:{fontSize: 22,    fontWeight: 600,    margin: 5}
}));


const Payment = (props) => {
    const classes = useStyles();
    const [needPaymentData, setNeedPaymentData] = useState([]);
    


    return (<>
        <GetPaymentData setNeedPaymentData={setNeedPaymentData}/>
        <div className={classes.count}>{needPaymentData.length} waiting for payments.</div>
        {
            needPaymentData.length>0&&<List  > 
            {needPaymentData.map(row=>{
                 return (
                     <>
                     <ListItem key={row.id}>
                     <ListItemAvatar>
                       <Avatar onClick={()=>{window.open(`https://airtable.com/tblwP6kTta7BazPnb/viwzls1caxMVmeZuk/${row.id}?blocks=hide`);}}>
                         <EditIcon />
                       </Avatar>
                     </ListItemAvatar>
                     <ListItemText primary={row.fields.address} secondary={`${row.fields.customerId}, ${ row.fields.whoDid} , $${row.fields.estimate}`} />
                   </ListItem>
                     <Divider light />
                   </>
                 )
             })} 
       </List>
        }
    </>)
}
export default Payment;