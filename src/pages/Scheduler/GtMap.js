import React, {
  useRef,
  useEffect,
  useState,
  useContext
} from "react";

import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";

import Search from '@arcgis/core/widgets/Search';
import Home from '@arcgis/core/widgets/Home';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import Viewpoint from '@arcgis/core/Viewpoint';
import Extent from '@arcgis/core/geometry/Extent';
import Locator from '@arcgis/core/tasks/Locator';

import "./GtMap.css";

import ProjectsLayer from "../../service/airtable/ProjectsLayer";
import NewTodoDiv from "../../components/NewTodoDiv/NewTodoDiv";  
import EditorDiv from "../../components/EditDiv/EditorDiv"
import { MainMapContext, NotesContext, AppraisalContext, NeedPaymentContext} from '../../context/GlobalState';

const createSearchWidget =(view)=>{
  let search= new Search({
    view: view,
    popupEnabled: false,
    id:"searchWidget",
    includeDefaultSources:false,
    locationEnabled :false,
  });
  let sources=[];      
  sources.push({
    locator: new Locator({
      url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    }),
    "name": "DFW Area",
    
    autoComplete: true,
    "placeholder": "DFW Area",
    "countryCode":"US",
    // "locationType":"rooftop",
    "maxSuggestions":4,
    "maxResults": 3,
    "outFields":["Match_addr","Place_addr"],
    "filter": {
      geometry: new Extent({
        "xmin": -10868891.685,

        "ymin": 3792695.340,

        "xmax": -10720909.599,

        "ymax": 3953824.595,
        spatialReference: {
          wkid: 3857
        }
      })
    },
    "resultSymbol":{
      type: "text",
      // color: "#ea1651",
      text: '\ue61d',  // esri-icon-map-pin
      font: {  // autocast as new Font()
        size: 24,
        family: 'CalciteWebCoreIcons'
      }
    },
  });
  search.set("sources",sources);
  return search;
}
function GtMap(props) {

  const mapDiv = useRef(null);
  const [map,setMap]=useState(null);
  const [view,setView]=useState(null);

  const [homeWidget,setHomeWidget]=useState(null);

  const [fullExtent, setFullExtent]=useState(null);
  const [searchResult, setSearchResult]=useState(null);

  const [selectedFeature, setSelectedFeature]=useState(null);
  const [searchWidget,setSearchWidget]=useState(null);
  const {refreshPrjOnGoing,refreshPrjDone} = useContext(MainMapContext);
  const {refreshNotes} = useContext(NotesContext);
  const {refreshHouseData} = useContext(AppraisalContext);
  const {refreshNeedPayment} = useContext(NeedPaymentContext);
  
  
  useEffect(() => {
    if (mapDiv.current) {
      
      const map = new Map({
        basemap: "gray"
      });
    
      const view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [-96.78, 33.0],
        zoom: 12,
      });
      setMap(map);
      setView(view);
      window.esriView=view;

      var search= createSearchWidget(view);
            
      setSearchWidget(search);

      search.on("search-focus",function(event){      
        setSelectedFeature(null);
      })
      
      search.on("search-clear", function(event){
        setSearchResult (null);  
      });
      search.on("select-result", function(event){
        setSearchResult (event.result.feature);  
      });

      const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "streets-vector"
      });

      view.ui.add(search, {
        position: "top-left",
        index: 0
      });

      view.ui.add(basemapToggle, {
        position: "bottom-left"
      });

      view.ui.add("refreshBtn", {
        position: "top-left",
        index: 2,
      });
  

      view.on("click", function (event) {

        // the hitTest() checks to see if any graphics in the view
        // intersect the given screen x, y coordinates
        view.hitTest(event).then((response) => {

          //type feature
          // If user selects a feature, select it
          const results = response.results;

          if (!results.length) {
            setSearchResult(null);
            setSelectedFeature(null);
          }

          if (results.length > 0 && results[0].graphic) {
            if (results[0].graphic.layer && results[0].graphic.layer.type === "feature") {
              setSearchResult(null)
              setSelectedFeature(results[0].graphic);
            } else {
              if (!searchResult) {
                setSearchResult(results[0].graphic)
              }
            }
          }
        });
      });

      view.when(function(){
        let div=document.getElementById("refreshBtn");
        if(div){div.onclick=()=>{
          setTimeout(function(){
            refreshPrjOnGoing();
          }, 50); 
          setTimeout(function(){
            refreshPrjDone();
          }, 500); 
          setTimeout(function(){
            refreshNotes();
          }, 1000); 
          setTimeout(function(){
            refreshHouseData();
          }, 1500); 
          setTimeout(function(){
            refreshNeedPayment();
          }, 2000); 
        }};
      }
      );
    }
  }, []);

  useEffect(() => {
    if(view&&fullExtent){
      if (!homeWidget) {
       var home = new Home({
          view: view,
        });
        view.ui.add(home, {
          position: "top-left", id: "homeWidget"
        }  );
        setHomeWidget(home);
        view.goTo(fullExtent, true);
  
      }  else{
        home=homeWidget;
      }  
      home.viewpoint = new Viewpoint({ targetGeometry:fullExtent });
    }
  },[fullExtent]);


  const handleClearSearch=()=>{
    searchWidget.clear();
    setSearchResult(null)
  }

  return (
    <>  
      {searchResult&&<NewTodoDiv feature={searchResult} clearSearch={handleClearSearch}/>}
   
      {selectedFeature &&  <EditorDiv feature={selectedFeature}  setSelectedFeature={setSelectedFeature}/>}
      <div className="mapDiv" ref={mapDiv}>
        <button id="refreshBtn" className="esri-widget" style={{padding:"8px"}} ><div className="esri-icon-refresh"></div></button>
        {
          view &&
          <ProjectsLayer 
            setFullExtent={setFullExtent}
            map={map}
            mapName={props.mapName}
          />
        }           
      </div>
    </>) ;
}

export default GtMap;