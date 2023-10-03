require('dotenv').config();

import React from "react";
import { useMemo, useState, useEffect } from "react";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import styles from "@/modules/index.module.css";
import {
  setDefaults,
  fromAddress,
  fromLatLng,
  geocode,
  RequestType,
} from "react-geocode";

const { key } = process.env

console.log("key" , key)

setDefaults({
  key: key, // Your API key here.
  language: "es", // Default language for responses.
  // region: "es", // Default region for responses.
});

// // Get latitude & longitude from address.
// fromAddress("camino de cintura 7024")
//   .then(({ results }) => {
//     const { lat, lng } = results[0].geometry.location;
//     console.log("from address", lat, lng);
//   })
//   .catch(console.error);

// // Get address from latitude & longitude.
// fromLatLng(-34.7109232 - 58.52653069999999)
//   .then(({ results }) => {
//     const { lat, lng } = results[0].geometry.location;
//     console.log(" from lat, lgn ", lat, lng);
//   })
//   .catch(console.error);

// // Alternatively, use geocode function for consistency
// // geocode(RequestType.ADDRESS, "camino de cintura 7024")
// //   .then(({ results }) => {
// //     const { lat, lng } = results[0].geometry.location;
// //     console.log("from lat lng consistency", lat, lng);
// //   })
// //   .catch(console.error);

function Home() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [lat, setLat] = useState(-34.7109232);
  const [lng, setLng] = useState(-58.52653069999999);
  const [address, setAddress] = useState({address:"camino de cintura 7024"});
  let mapOptions = "";

  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

  const {isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: key,
    libraries: libraries,
    onLoad: () => {
      setIsMapLoaded(true);
    },
  });

  function handleChangeAddress(e) {
    e.preventDefault();
    setAddress({
      [e.target.name]: e.target.value,
    });
  }

  function geocodeAddress(e) {
    e.preventDefault();
    
    geocode(RequestType.ADDRESS, address.address)
    .then(({ results }) => {
      
      if (results.length > 0) {
        
        const { lat, lng } = results[0].geometry.location;
          setLat(lat)
          setLng(lng)
        
      } else {
        console.log("No se encontraron resultados para la dirección proporcionada.");
      }
    })
    .catch((error) => {
      console.error("Error de geocodificación:", error);
    });
    
 }

  useEffect(() => {
    if (isLoaded) {
      mapOptions =
        useMemo <
        google.maps.MapOptions >
        (() => ({
          disableDefaultUI: false,
          clickableIcons: true,
          scrollwheel: true,
        }),
        []);
    }
  }, [isLoaded]);

  console.log("lat y lgn", lat, lng)

  return (
    <div className={styles.homeWrapper}>
      <div>
        <form onSubmit={e => geocodeAddress(e)}>
        <label>
          Dirección
        </label>
        <input type="text" name="address" value={address.address} onChange={e => handleChangeAddress(e)}></input>
        <button type="submit">Buscar</button>
        </form>
      </div>

      {isLoaded && !loadError ? ( // Verificar si la biblioteca se ha cargado sin errores
      <GoogleMap
        options={mapOptions}
        zoom={16}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: "400px", height: "400px" }}
        onLoad={(map) => console.log("Map Loaded")}
      >
        <MarkerF
          position={mapCenter}
          onLoad={() => console.log("Marker Loaded")}
        />
      </GoogleMap>
    ) : (
      <p>Error al cargar Google Maps</p>
    )}

    </div> 
    
  );
}


export default Home;
