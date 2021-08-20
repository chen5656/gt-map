import React, {
    useEffect,
} from 'react';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Extent from '@arcgis/core/geometry/Extent';

const layerProperties=()=>{
    let esriMarkerStyle = {
        "Chi Shen": "diamond",
        "Siwei Chen": "square",
        "All": "circle",
    };
    let esriMarkerColor = {
        green: [
            [23, 174, 39, 0.3], "Todo"
        ],
        red: [
            [231, 49, 41, 0.7], "Overdue"
        ],
        blue: [
            [41, 184, 231, 0.7], "On Progress"
        ],
        gray: [
            [206, 204, 203, 0.3], "Done"
        ],
    }

    let uniqueSymbols = ["Chi Shen", "Siwei Chen", "All"].map(
        person => {
            return ["green", "red", "blue", "gray"].map(color => {
                return {
                    value: `${person}.${color}`,
                    symbol: {
                        type: "simple-marker",
                        style: esriMarkerStyle[person],
                        color: esriMarkerColor[color][0],
                        outline: {
                            width: 0.5,
                            color: [13, 13, 13, 1]
                        },
                        size: 13
                    },
                    label: person + " - " + esriMarkerColor[color][1],
                }
            })
        }
    ).flat();
    return {
        renderer: {
            type: "unique-value",
            valueExpression: `return $feature.who+ "."+ $feature.color ;`,
            valueExpressionTitle: "who",
            defaultSymbol: {
                type: "simple-marker",
                style: "cross",
                outline: {
                    width: 2.25,
                    color: [225, 41, 41, 1]
                },
                size: 13
            },
            defaultLabel: "Wrong Item",
            uniqueValueInfos: uniqueSymbols


        },
        popupTemplate:null,
        labelClass: {
            // autocasts as new LabelClass()
            symbol: {
                type: "text", // autocasts as new TextSymbol()
                color: "navy",
                font: { // autocast as new Font()

                    size: 12,
                }
            },
            deconflictionStrategy: "none", //can over lapping
            labelPlacement: "above-center",
            labelExpressionInfo: {
            //  expression:"$feature.customerId"
                expression: "Concatenate([IIF(!IsEmpty($feature.scheduled),Text(Date($feature.scheduled),'MM-DD@HH:mm'),''),Concatenate(Split($feature.address,' ',3),' ')],TextFormatting.NewLine)"
            }

        },
    }

}
const layerFormat= layerProperties();

const ProjectsLayer=(props)=>{
    useEffect(() => {
        if(props.allProjectsData){
            let features= createFeatures(props.allProjectsData);
            let featureLayer= createFeatureLayer(features,layerFormat);
            props.map.layers.removeAll();
            props.map.add(featureLayer);
            let extent=getFullExtent(features);
            props.setFullExtent(extent);
        }
    } ,[props.allProjectsData]);

    function createFeatures(allProjectsData) {
        var result = allProjectsData.map(item => {
            return {
                geometry: {
                    "type": "point",
                    x: item.fields.longitude,
                    y: item.fields.latitude,
                },
                attributes: {
                    "OBJECTID": item.fields.id,
                    "airId": item.id,
                    "address": item.fields["address"],
                    "scheduled": (new Date(item.fields["scheduled_date"])).getTime(),
                    "status": item.fields["status"],
                    "who": item.fields["scheduledEngineer"] ? item.fields["scheduledEngineer"] : "All",
                    "color": item.fields["symbol_color"],
                    "lastModified": new Date(item.fields["lastModified"]).toLocaleString('en-US'),
                    "customerId": item.fields["customerId"],
                    "estimate": item.fields["estimate"],
                    
                }
            };
        });
        return result;
    }
    
    function createFeatureLayer(features, layerFormat) {
    
        let fields = Object.keys(features[0].attributes).map(key => {
            var domain = null;
            var type = "string";
            switch (key) {
                case "OBJECTID":
                    type = "oid";
                    break;
                case "airId":
                    type = "string";
                    break;
                case "scheduled":
                    type = "date";
                    break;
                case "status":
                    type = "string"
                    domain = {
                        "type": "coded-value",
                        "name": "status",
                        "codedValues": [{
                                "name": "Todo",
                                "code": "Todo"
                            },
                            {
                                "name": "On progress",
                                "code": "On progress"
                            },
                            {
                                "name": "Done",
                                "code": "Done"
                            },
                            {
                                "name": "Canceled",
                                "code": "Canceled"
                            }
                        ]
                    };
                    break;
                case "who":
                    type = "string"
                    domain = {
                        "type": "coded-value",
                        "name": "status",
                        "codedValues": [{
                                "name": "All",
                                "code": "All"
                            }, {
                                "name": "Chi Shen",
                                "code": "Chi Shen"
                            },
                            {
                                "name": "Siwei Chen",
                                "code": "Siwei Chen"
                            },
                        ]
                    };
                    break;
                default:
                    type = "string"
            }
    
            var field = {
                name: key,
                type: type,
    
            };
            if (domain) field.domain = domain;
            return field;
        });
        let layer = new FeatureLayer({
            source: features, // autocast as a Collection of new Graphic()
            objectIdField: "OBJECTID",
            fields: fields,
            popupTemplate: layerFormat.popupTemplate,
            labelingInfo: [layerFormat.labelClass],
            renderer: layerFormat.renderer,
            layerId:"layer0",
            outFields:fields.map(item=>item.name),
    
        });
        return layer;
    }
        
    function getFullExtent(features) {
        let [xmin, xmax, ymin, ymax] = [features[0].geometry.x, features[0].geometry.x, features[0].geometry.y, features[0].geometry.y];
        features.forEach(function (feature) {
            let x = feature.geometry.x;
            let y = feature.geometry.y;
            if (xmin > x) {
                xmin = x;
            } else if (xmax < x) {
                xmax = x;
            }
            if (ymin > y) {
                ymin = y;
            } else if (ymax < y) {
                ymax = y;
            }
        });
        var extent = new Extent({
            xmin: xmin,
            xmax: xmax,
            ymin: ymin,
            ymax: ymax,

        });
        return extent;

    }
 
    return null;
}



export default ProjectsLayer;