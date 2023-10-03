import React from "react";
import { useMemo, useState, useEffect } from "react";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import styles from "@/modules/index.module.css";
import {
  setDefaults,
  fromAddress,
  fromLatLng,
  geocode,
  RequestType,
} from "react-geocode";

// Set default response language and region (optional).
// This sets default values for language and region for geocoding requests.
setDefaults({
  key: "AIzaSyAFY4jY1E6VePdwDAkSAJLpbkx-WFoJ5es", // Your API key here.
  language: "es", // Default language for responses.
  region: "es", // Default region for responses.
});

// Get latitude & longitude from address.
fromAddress("camino de cintura 7024")
  .then(({ results }) => {
    const { lat, lng } = results[0].geometry.location;
    console.log("from address", lat, lng);
  })
  .catch(console.error);

// Get address from latitude & longitude.
fromLatLng(-34.7109232 - 58.52653069999999)
  .then(({ results }) => {
    const { lat, lng } = results[0].geometry.location;
    console.log(" from lat, lgn ", lat, lng);
  })
  .catch(console.error);

// Alternatively, use geocode function for consistency
geocode(RequestType.ADDRESS, "camino de cintura 7024")
  .then(({ results }) => {
    const { lat, lng } = results[0].geometry.location;
    console.log("from lat lng consistency", lat, lng);
  })
  .catch(console.error);

// // Get address from latitude & longitude.
// geocode(RequestType.LATLNG, "-34.7109232 -58.52653069999999")
//   .then(({ results }) => {
//     const address = results[0].formatted_address;
//     console.log(address);
//   })
//   .catch(console.error);

function Pruebas() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [lat, setLat] = useState(-34.7109232);
  const [lng, setLng] = useState(-58.52653069999999);
  const [address, setAddress] = useState({address:"camino de cintura 7024"});
  let mapOptions = "";

  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: -34.7109232, lng: -58.52653069999999 }), [lat, lng]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAFY4jY1E6VePdwDAkSAJLpbkx-WFoJ5es",
    libraries: libraries,
    onLoad: () => {
      setIsMapLoaded(true); // Marcar que la biblioteca se ha cargado con éxito
    },
  });

  useEffect(() => {
    if (isMapLoaded) {
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
  }, [isMapLoaded]);

  function handleChangeAddress(e) {
    e.preventDefault();
    setAddress({
        [e.target.name] : e.target.value
    })
   

  // Alternatively, use geocode function for consistency

  function geocodeAddress(e) {
    e.preventDefault();
    
     geocode(RequestType.ADDRESS, e.value)
      .then(({ results }) => {
      const { lat, lng } = results[0].geometry.location;
      console.log("from lat lng consistency",lat, lng);
    })
    .catch(console.error);
  }

  return (
    <div className={styles.homeWrapper}>
      <div className={styles.sidebar}>
       
        {/* <PlacesAutocomplete
          onAddressSelect={(address) => {
            getGeocode({ address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);

              setLat(lat);
              setLng(lng);
            });
          }}
        /> */}
      </div>
      <div>
        <form onSubmit={e => geocodeAddress(e)}>
        <label>
          Dirección
        </label>
        <input type="text" name="address" value={address.address} onChange={e => handleChangeAddress(e)}></input>
        <button type="submit">Buscar</button>
        </form>
      </div>


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
    </div> 
    
  );
}

// const PlacesAutocomplete = ({
//   onAddressSelect,
// }) => {
//   const {
//     ready,
//     value,
//     suggestions: { status, data },
//     setValue,
//     clearSuggestions,
//   } = usePlacesAutocomplete({

//     debounce: 300,
//     cache: 86400,
//   });

//   const renderSuggestions = () => {
//     return data.map((suggestion) => {
//       const {
//         place_id,
//         structured_formatting: { main_text, secondary_text },
//         description,
//       } = suggestion;

//       return (
//         <li
//           key={place_id}
//           onClick={() => {
//             setValue(description, false);
//             clearSuggestions();
//             onAddressSelect && onAddressSelect(description);
//           }}
//         >
//           <strong>{main_text}</strong> <small>{secondary_text}</small>
//         </li>
//       );
//     });
//   };



// return (
//   <div className={styles.autocompleteWrapper}>
//     <form onSubmit={(e) => geocodeAddress(e)}>
//       <input
//         name="address"
//         value={value}
//         className={styles.autocompleteInput}
//         disabled={!ready}
//         // onChange={(e) => setValue(e.target.value)}
//         onChange={(e) => setAddress(e)}
//         placeholder="Ingresa Dirección"
//       />
//       <button type="submit">Buscar</button>
//     </form>
//     {status === "OK" && (
//       <ul className={styles.suggestionWrapper}>{renderSuggestions()}</ul>
//     )}
//   </div>
// );}
}

export default Pruebas;
