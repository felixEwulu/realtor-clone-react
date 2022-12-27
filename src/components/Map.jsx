import {MapContainer, Marker, TileLayer, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { useState } from 'react';

const Map = ({ geolocation}) => {
 const lat = +geolocation?.lat;
 const lng = +geolocation?.lng
 console.log(lat, lng);
 

  return (
   < >
    <MapContainer
        style={{ width: "100%", height: "100vh" }}
        zoom={13}
        center={[lat, lng]}
        scrollWheelZoom={false}
        fadeAnimation={true}
        markerZoomAnimation={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>

    </>
  )
}

export default Map