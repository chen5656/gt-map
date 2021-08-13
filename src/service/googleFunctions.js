

import { getGoogleConfig } from "../config";
const config = getGoogleConfig();
export const getStreetViewImage =  (address) => {
    
 return `https://maps.googleapis.com/maps/api/streetview?location=${encodeURIComponent(
      address.trim())}&size=456x456&key=${config.streetView}`;

     
  }
  