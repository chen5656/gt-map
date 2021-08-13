import React, {    useEffect} from 'react';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const getAppraisalLayer = () => {
  return [
    {
      name: "dallas",
      layerType:"",
      flayer: new FeatureLayer({
        url: "https://maps.dcad.org/prdwa/rest/services/Property/ParcelHistory/MapServer/4"
      }),
      func: (attributes) => {
        return {
          parcel_identification_number: attributes.PARCELID,
          doing_business_as: attributes.DBA1,
          current_assessed_value: attributes.CNTASSDVAL,
          first_owner_name: attributes.OWNERNME1,
          second_owner_name: attributes.OWNERNME2,
          site_address: attributes.SITEADDRES,
          property_class: attributes.CLASSDSCRP,
          assessing_use_description: attributes.USEDSCRP,
          structure_type: attributes.RESSTRTYP,
          year_built: attributes.RESYRBLT,
          floor_area: attributes.RESFLRAREA
        }
      }
    },
    {
      name: "collin",
      layerType:"esriGeometryPolygon",
      flayer: new FeatureLayer({
        url: "https://gis.collincountytx.gov/arcgis/rest/services/county/IdentifyParcels/MapServer/0"
      }),
      func: (attributes) => {


        const prop_type = { R: "Residential", P: "Business Personal Property", MH: "Manufactured Home", MN: "Mineral" }
        var stories;
        if(attributes.stories==1){
          stories="One Story";
        }else if(attributes.stories==2){
          stories="Two Story";
        }else{
          stories=attributes.stories
        }
        return {
          parcel_identification_number: attributes.PROPID_TXT,
          // doing_business_as: attributes.DBA1,
          current_assessed_value: attributes.curr_appra,
          first_owner_name: attributes.file_as_na,
          // second_owner_name: attributes.OWNERNME2,
          site_address: attributes.situs_disp,
          // property_class:,
          assessing_use_description: prop_type[attributes.prop_type_],
          structure_type: stories,
          year_built: attributes.yr_blt,
          floor_area: attributes.living_are,

        }
      }
    },
  ]
}
const appraisalLayers = getAppraisalLayer();

const AppraisalInfo = ({feature,setAppraisalData}) => {
    useEffect( () => {
      const regex = /^[0-9]/;
      if(feature.attributes.Match_addr&&feature.attributes.Match_addr.match(regex)){
        appraisalLayers.forEach(county=>{
          getAppraisalInfo(county,feature).then(value=>{
            if (value ) setAppraisalData(value);
          });
        });
      }
    }, [feature.geometry.longitude,feature.geometry.latitude]);
   
    const getAppraisalInfo = async (countyLayer,feature)=>{
      var layer=countyLayer.flayer;
      const query = layer.createQuery();
      query.geometry = feature.geometry;
      query.spatialRelationship = "intersects";
      query.returnGeometry = true;
      query.outFields = ["*"];
      var response = await layer.queryFeatures(query);

      if (response.features.length===0) return null;

      if( response.features.length>=1){
        var attributes =response.features[0].attributes ;
      }

     return  countyLayer.func(attributes);

    }

    
    return null;
  }
  
export default AppraisalInfo;