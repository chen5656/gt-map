import React  from 'react';
import Scheduler from './pages/Scheduler/GtMap';
import Payment from './pages/Payment/Payment';
import Button from '@material-ui/core/Button';
import { getUsers } from "./config";
import { MainMapProvider,NeedInvoiceMapProvider,NotesProvider,
  AppraisalProvider,CustomerIdProvider,NeedPaymentProvider } from './context/GlobalState';


import { useAuth0 } from "@auth0/auth0-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const App=(props)=>{

  const classes = useStyles();
  const { user, isAuthenticated, loginWithRedirect, } = useAuth0();
  if (user) {
    var isOurUser = getUsers().find(a => a === user.name);
  }



 
  return <>{isAuthenticated ?
            (isOurUser ?
            <Router>
              <div>
                <MainMapProvider>
                <NeedInvoiceMapProvider>
                <NotesProvider>
                <AppraisalProvider>
                <CustomerIdProvider>
                <NeedPaymentProvider>
                    <Grid container className={classes.root} spacing={2}>
                      <Grid item ><Link to="/">Home</Link> </Grid>
                      <Grid item ><Link to="/needInvoice">出单</Link> </Grid>
                      <Grid item ><Link to="/payment">付款</Link> </Grid>
                    </Grid>
                    <Switch>
                      <Route path="/payment">
                        <Payment/>
                      </Route>
                      <Route path="/needInvoice">
                        <Scheduler mapName='need-invoice'/>
                      </Route>
                      <Route path="/">
                        <Scheduler mapName='main' /> 
                      </Route>
                    </Switch>
                </NeedPaymentProvider>
                </CustomerIdProvider>
                </AppraisalProvider>
                </NotesProvider>
                </NeedInvoiceMapProvider>
                </MainMapProvider>
              </div>   

            </Router>
              :
            <div style={{"fontSize":"25px","color":"navy","top":"50%","position":"absolute","margin":"0 50px"}}>This page is under construction. Please come back soon!</div>
            ):
            <Button color="primary"variant="contained" onClick={() => loginWithRedirect({})}>Log in</Button>
        }
    </>
}

export default App;