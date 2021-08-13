import React  from "react";
  
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';

// import { StreetViewPanorama } from '@react-google-maps/api';

function formatNum(value){
    return value&&value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
const useStyles = makeStyles((theme) => ({
   
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform:  'scale(1.5,0.5) rotate(90deg) ',
      right: 0,
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));
  
  function ViewHouseInfo(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
  
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    var values = props.data[0].fields;
    return (
      <Card  >
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {values.assessing_use_description==="Residential"?"R":"O"}
            </Avatar>
          }
          title={values.site_address}
          subheader={`built ${values.year_built}`}
        />
        <CardMedia
          className={classes.media}
          image={values.street_view&&values.street_view.length>0&&values.street_view[0].url}
          title="Street view"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Stories: {values.structure_type}<br />
            Description: {values.assessing_use_description}<br />
            Class: {values.property_class} <br/>
            Floor Area: {formatNum(values.floor_area) } sqft<br/>
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
          <div className={classes.expand}>{expanded? "<":">"}</div>
	
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            Current assessed value: ${formatNum(values.current_assessed_value)}<br />
            First owner: {values.first_owner_name}<br />

            <br />
          </CardContent>
        </Collapse>
      </Card>
    );
  }
export default ViewHouseInfo;