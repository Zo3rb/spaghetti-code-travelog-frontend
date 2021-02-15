import React, { useState, useEffect, Fragment } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import axios from 'axios';

import EntryForm from './EntryForm';

export default function App() {

  // Getting The User Current Location
  const [userLat, setUserLat] = useState(30.033333);
  const [userLong, setUserLong] = useState(31.233334);

  // Add New Location State
  const [addEntryLocation, setAddEntryLocation] = useState(null);

  // MapBox & MapGl Configuration
  const token = 'pk.eyJ1Ijoic25pcHBldHMiLCJhIjoiY2tsNmNsczB4Mmd5NDJubXNhYWFweXBsdCJ9.QEABGQ2aNGMUIpwmmEctcQ';
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: userLat,
    longitude: userLong,
    zoom: 4
  });
  const [showPopup, setShowPopup] = useState({});

  // Setting LogEntries State
  const [logEntries, setLogEntries] = useState([]);

  useEffect(() => {
    (async () => {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(position => {
          setUserLat(position.coords.latitude);
          setUserLong(position.coords.longitude);
        });
      }
    })();
    (async () => {
      const response = await axios.get('https://twitch-travelog-api.herokuapp.com/api/logs');
      setLogEntries([...response.data.data]);
    })();
  }, []);

  // to Add new Place/log
  const showAddMarkerPopup = event => {
    const [longitude, latitude] = event.lngLat
    setAddEntryLocation({
      latitude,
      longitude
    });
  };

  return (
    <Fragment>
      <ReactMapGL
        mapboxApiAccessToken={token}
        mapStyle="mapbox://styles/snippets/ckl6e61m358gk17tjzmabj20v"
        {...viewport}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick={showAddMarkerPopup}
      >
        {
          logEntries.map(entry => (
            <Fragment key={entry._id}>
              <Marker
                latitude={entry.latitude}
                longitude={entry.longitude}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <div
                  onClick={() => setShowPopup({ ...showPopup, [entry._id]: true })}
                ><svg
                  className="marker"
                  style={
                    { width: '30px', height: '30px' }
                  }
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                  </svg></div>
              </Marker>
              {
                showPopup[entry._id] && (
                  <Popup
                    latitude={entry.latitude}
                    longitude={entry.longitude}
                    closeButton={true}
                    closeOnClick={false}
                    dynamicPosition={true}
                    onClose={() => setShowPopup({ ...showPopup, [entry._id]: false })}
                    anchor="top" >
                    <div className="popup">
                      <h3>Place: {entry.title}</h3>
                      <p>Experience: {entry.comments}</p>
                      <small>Visited at: {entry.visitedAt}</small>
                      <p>Rating: {entry.rating}</p>
                      <img src={entry.image} alt={entry.title} />
                    </div>
                  </Popup>
                )
              }
            </Fragment>
          ))
        }
        {
          addEntryLocation && (
            <Fragment>
              <Marker
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
              >
                <div><svg
                  className="marker"
                  style={
                    { width: '30px', height: '30px' }
                  }
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                </svg></div>
              </Marker>
              <Popup
                style={{ height: "600px !important" }}
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setAddEntryLocation(null)}
                anchor="top" >
                <div className="entry-form">
                  <EntryForm lat={addEntryLocation.latitude} long={addEntryLocation.longitude} />
                </div>
              </Popup>
            </Fragment>
          )
        }
      </ReactMapGL>
    </Fragment>
  )
};
