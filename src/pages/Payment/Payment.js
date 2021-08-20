import React, {    useContext} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import { NeedPaymentContext } from '../../context/GlobalState';



const useStyles = makeStyles((theme) => ({
  noPayment: { "fontSize": "32px", "margin": "10px", "top": "200px", "position": "absolute" },
  table: {
    width: "100vw",
  },
  count:{fontSize: 22,    fontWeight: 600,    margin: 5},
  clickable:{cursor: 'pointer'  },
  listItem:{
    background: 'rgb(2,0,36)',
    background: 'linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(152,152,152,0.6) 2%, rgba(255,255,255,1) 10%)'
  }
  }));


const Payment = () => {
  const classes = useStyles();
  const {paymentData} = useContext(NeedPaymentContext);

    return (<div>
        <div className={classes.count}>{paymentData.length} waiting for payments.</div>
        {
            paymentData.length>0&&<List  > 
            {paymentData.map(row=>{
                 return (
                    <ListItem key={row.id} className={classes.listItem}>
                     <ListItemAvatar>
                       <Avatar className={classes.clickable} onClick={()=>{window.open(`https://airtable.com/tblwP6kTta7BazPnb/viwzls1caxMVmeZuk/${row.id}?blocks=hide`);}}>
                         <EditIcon />
                       </Avatar>
                     </ListItemAvatar>
                     <ListItemText primary={`${row.fields.address}${ row.fields.invoice?' (invoice sent)':''} `} secondary={`${row.fields.customerId}, ${ row.fields.whoDid} ,
                      $${row.fields.estimate?row.fields.estimate:0}`} />
                   </ListItem>
                 )
             })} 
       </List>
        }
    </div>)
}
export default Payment;