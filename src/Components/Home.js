import React from "react";
import {
	Button ,Slider,Grid
	
} from "@mui/material";
import axios from "axios"; 
import {
    
    GoogleMap,
    MarkerF,
    DirectionsRenderer,
    Polygon, LoadScript ,
  } from '@react-google-maps/api'

class Home extends React.Component{

    state = {
        progress: [{lat: 35.44853591918945, lng: 133.12904357910156, distance: 0}],
         path : [ ],
         velocity:100
      }

    initialDate = new Date()
  
    getDistance = () => {
        const differentInTime = (new Date() - this.initialDate) / 1000 // pass to seconds
        
        return differentInTime * this.state.velocity 
      }
 
    
      componentWillUnmount = () => {
        window.clearInterval(this.interval)
      }

      moveObject = () => {
        const distance = this.getDistance()
        if (! distance) {
          return
        }
    
        let progress = this.state.path.filter(coordinates => coordinates.distance < distance)
    
        const nextLine = this.state.path.find(coordinates => coordinates.distance > distance)
        if (! nextLine) {
          this.setState({ progress })
          return 
        }
        const lastLine = progress[progress.length - 1]
    
        const lastLineLatLng = new window.google.maps.LatLng(
          lastLine.lat,
          lastLine.lng
        )
    
        const nextLineLatLng = new window.google.maps.LatLng(
          nextLine.lat,
          nextLine.lng
        )
    
        const totalDistance = nextLine.distance - lastLine.distance
        const percentage = (distance - lastLine.distance) / totalDistance
    
        const position = window.google.maps.geometry.spherical.interpolate(
          lastLineLatLng,
          nextLineLatLng,
          percentage
        )
    
        progress = progress.concat(position)
        this.setState({ progress })
      }
      getCoordinates = () => {
        let path = this.state.path?.map((coordinates, i, array) => {
          if (i === 0) {
             return { ...coordinates, distance: 0 } 
          }
          const { lat: lat1, lng: lng1 } = coordinates
          const latLong1 = new window.google.maps.LatLng(lat1, lng1)
    
          const { lat: lat2, lng: lng2 } = array[0]
          const latLong2 = new window.google.maps.LatLng(lat2, lng2)
    
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            latLong1,
            latLong2
          )
    
          return { ...coordinates, distance }
        })
        this.setState({path:path})
    
       
      }
 
     calculateRoute =async (origin,destination) => {
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
          origin: origin || `Bangalore, Karnataka, India`, // for testing purpose 
          destination: destination || `Hyderabad, Telangana, India`, 
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })

        
        this.setState({directionsResponse:results})
        
      }
      handleAnimateVehical = () =>{
        this.interval = window.setInterval(this.moveObject, 1000);
        this.getCoordinates()
      }

      handleVehicalRoute = ()=>{
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
            let paths= res.data.data.historyData.map(item=> {return {lat:item.lat,lng:item.lon}})
      
            this.setState({path:paths},()=>{  })
            let historyData = res.data.data.historyData
            let origin={lat:parseFloat(historyData[0].lat),lng:parseFloat(historyData[0].lon)}
              //hardcoded because for testing perpose (if i use total histroy the origin and destination are 5m away)
            let destination = {lat:parseFloat(historyData[1800].lat),lng:parseFloat(historyData[1800].lon)};           
            
            this.calculateRoute(origin,destination)
        })

    }

    handleOnChange =(e)=>{
       this.setState({velocity:e.target.value})
    }
 
    
    render(){
    return <>   
      <LoadScript
        googleMapsApiKey=""
      >
    <div style={{height:'80vh',width:'97vw',margin:'1rem'}} >
        <GoogleMap
          center={{lat: 
            35.44853591918945, lng: 
            133.12904357910156 }}
            
         zoom={10}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}>
          {this.state.progress && (  <>
              <Polygon path={this.state.progress} options={{ strokeColor: "#FF0000", strokeWidth:1}} 
                   fillColor="#FF0000"
            strokeColor="#FF0000"
              />
          <MarkerF position={this.state.progress[this.state.progress.length - 1]}  />  </>)}
          {this.state.directionsResponse && (
            <DirectionsRenderer directions={this.state.directionsResponse}  />
          )}
         
        </GoogleMap>
     </div>  </LoadScript>

     <Grid container spacing={3}  alignItems="flex-start">
    <Grid item xs={4} >
    <Button variant="contained" size='large' style={{margin:'0.5rem'}} onClick={this.handleVehicalRoute}>Get vehical route</Button>
 
     <Button variant="contained" size='large' style={{margin:'0.5rem'}} onClick={this.handleAnimateVehical}>Animate vehical route</Button>
  </Grid>
  <Grid item xs={4}>
  <span id="input-slider" gutterBottom>
        Speed scale
      </span>
    <Slider
     aria-label="Temperature"
    defaultValue={this.state.velocity}
    valueLabelDisplay="auto"
      step={100}
      marks
       min={100}
       max={1000}
      onChange={this.handleOnChange}
      />
     </Grid>
    </Grid>
   
   
 </>
}
}



export default Home;