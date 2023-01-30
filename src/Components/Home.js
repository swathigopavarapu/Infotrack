import React, { useState,useEffect } from "react";
import {
	Button,Skeleton 
	
} from "@mui/material";
import axios from "axios"; 
import {
    useJsApiLoader,
    GoogleMap,
    MarkerF,
    
    DirectionsRenderer,
  } from '@react-google-maps/api'


  const center = { lat: 35.44853591918945, lng: 133.12904357910156 }
const Home = () =>{

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
      })

    useEffect(()=>{
        // const ifameData=document.getElementById("iframeId")
        // const lat=1.305385;
        // const lon=30.923029;
        // ifameData.src=`https://maps.google.com/maps?q=${lat},${lon}&hl=es;&output=embed`
    })
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)

    async function calculateRoute(origin,destination) {
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
          origin: origin || `Bangalore, Karnataka, India`, // for testing purpose 
          destination: destination || `Hyderabad, Telangana, India`, 
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })
        setDirectionsResponse(results)
        console.log('disatance',  results.routes[0].legs[0].distance,
        results.routes[0].legs[0].duration)
      }


    const handleAnimateVehical = ()=>{
        let accessToken = localStorage.getItem('USER-ACCESS-TOKEN')
        const headers ={
            "Authorization" : `Bearer ${accessToken}`
        }
       
        let payload ={
            VehicleId: 49,
             VehicleNo: "6", 
             StartDate: "2023-01-28 00:00:00",
              EndDate: "2023-01-29 23:59:59"
        }
        axios.post('https://uyenotest.infotracktelematics.com:5001/fms/v2/vehicle/history',payload,{headers}).then(res=>{
            console.log('the response is',res.data.data.historyData )
            let historyData = res.data.data.historyData
            let origin=historyData[0].location;
            let destination = historyData[historyData.length - 1].location
            calculateRoute(origin,destination)
        })

    }

    if (!isLoaded) {
        return <Skeleton />
      }
    
    return <>
    {/* <h2>Map</h2>
    <Button variant="contained" size='large' onClick={handleAnimateVehical}>Animate Vehical</Button> */}
    <div style={{height:'90vh',width:'97vw',margin:'1rem'}} >
        {/* Google Map Box */}
        
        
        <GoogleMap
          center={center}
          zoom={2}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <MarkerF position={center} animation={2} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
     </div>
     <Button variant="contained" size='large' style={{margin:'0.5rem'}} onClick={handleAnimateVehical}>Get vehical route</Button>
     <Button variant="contained" size='large' style={{margin:'0.5rem'}} onClick={handleAnimateVehical}>Animate vehical route</Button>
   
        </>
}

export default Home;