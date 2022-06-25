import { useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useSelector } from "react-redux";

import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RequestMap = () => {

    const currentLocation = useSelector((state) => state.requestMap);
    const routingControl = useRef(L.Routing.control({
        waypoints: [],
        routeWhileDragging: true
    }));

    const DEFAULT_LATITUDE = 50.43480816569603;
    const DEFAULT_LONGITUDE = 30.556856961182312;
    
    const shippingLat = currentLocation.dispatchAddress.length > 0
        ? currentLocation.dispatchAddress[0]
        : DEFAULT_LATITUDE;
    const shippingLng = currentLocation.dispatchAddress.length > 0
        ? currentLocation.dispatchAddress[1]
        : DEFAULT_LONGITUDE;

    const dispatchLat = currentLocation.shippingAddress.length > 0
        ? currentLocation.shippingAddress[0]
        : DEFAULT_LATITUDE;
    const dispatchLng = currentLocation.shippingAddress.length > 0
        ? currentLocation.shippingAddress[1]
        : DEFAULT_LONGITUDE;

    const centerLat = (shippingLat + dispatchLat) / 2;
    const centerLng = (shippingLng + dispatchLng) / 2;

    const coords = [centerLat, centerLng];

    function SetViewOnClick({coords}) {
        const map = useMap();
        map.setView(coords, map.getZoom());

        if (currentLocation.dispatchAddress.length > 0 && currentLocation.shippingAddress.length > 0) {
            routingControl.current.setWaypoints([L.latLng(shippingLat, shippingLng), L.latLng(dispatchLat, dispatchLng)]).addTo(map);
        }
      
        return null;
      }

    return (
        <MapContainer center={coords} zoom={8} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[shippingLat, shippingLng]}/>
            <Marker position={[dispatchLat, dispatchLng]}/>
            <SetViewOnClick coords={coords} />
        </MapContainer>
    );
}

export default RequestMap;