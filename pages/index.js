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

const KEY = process.env.NEXT_PUBLIC_KEY

setDefaults({
  key: KEY, 
  // region: "es", // Venia por default pero encasilla la busqueda en un pais determinado
});

// Devuelve la latitud y la longitud desde la direccion, la direccion debe ser lo mas completa posible, si hay mas de una opcion que coincida el mapa no muestra resultado
// fromAddress("camino de cintura 7024")
//   .then(({ results }) => {
//     const { lat, lng } = results[0].geometry.location;
//     console.log("from address", lat, lng);
//   })
//   .catch(console.error);


// devuelve la direccion partiendo de las latitudes y longitudes
// geocode(RequestType.LATLNG, "-34.7109232 -58.52653069999999")
//   .then(({ results }) => {
//     const address = results[0].formatted_address;
//     console.log(address);
//   })
//   .catch(console.error);


function Home() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [lat, setLat] = useState(-34.7109232);
  const [lng, setLng] = useState(-58.52653069999999);
  const [address, setAddress] = useState({address:"camino de cintura 7024"});
  let mapOptions = "";

  const libraries = useMemo(() => ["places"], []);
  
  // centra el mapa en las latitudes y longitudes de la busqueda
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]); 

  // carga el script de la API y nos devuelve si se cargo correctamente o no
  const {isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: KEY,
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

  // busca y devuelve las longitudes y latitudes segun una direccion y las setea en los estados correspondientes para renderizar en el mapa
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

 // si el script cargo correctamente se guardan las preferencias de mapa, si esto no se hace verificando la carga del script tira error de "google is undefined"
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
