import React, { Component, useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker'
import L, { Map, TileLayer, WMSTileLayer, LayersControl, Popup, Marker, Circle } from 'react-leaflet';
const { BaseLayer, Overlay } = LayersControl;
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon.png'
import { CoordinatesControl } from 'react-leaflet-box-zoom'
import {getData} from '../thunks/wmsObject';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const mapCenter = [43.3231171460394, 21.886276544398882];
const zoomLevel = 15;
let numMapClicks = 0;

const mapCO2ToColor = (value) => {
  if(value<=20) return 'green';
  if(value>20 && value<=30) return 'yellow';
  if(value > 30 && value < 50) return 'orange';
  if(value >= 50 && value < 70) return 'red';
  return 'darkred'
}

const mapCO2ToRadius = (value) => {
  if(value<=20) return 50;
  if(value>20 && value<=30) return 70;
  if(value > 30 && value < 50) return 90;
  if(value >= 50 && value < 70) return 120;
  return 150
}

const calculateCO2 = (item, prevItem) => {
  let co2 = item.speed;
  if(item.iotypename === 'RPM') {
    co2 += item.iovalue / 1000 * 11;
  }
  if(!prevItem) return co2;
  if(item.iotypename === prevItem.iotypename && item.iotypename === 'Battery level') {
    co2 += (item.iovalue-prevItem.iovalue)*0.04;
  }
  if(item.iotypename === prevItem.iotypename && item.iotypename === 'Ignition' && item.iovalue !== prevItem.iovalue) {
    co2 *=2;
  }
  return co2;
}
const Leaflet = (props) => {
  let leafletM;
  const [currentZoomLevel, setZoomLevel] = useState(15);
  const [startDate, setStartDate] = useState(new Date());

  const [counter, setCounter] = useState(0);
  const [data, setData] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    const leafletMap = leafletM.leafletElement;
    leafletMap.on('zoomend', () => {
      const updatedZoomLevel = leafletMap.getZoom();
      handleZoomLevelChange(updatedZoomLevel);
    });
  },[])

  useEffect(() => {
    if(clicked) {
      let id =setInterval(() => {
        setCounter(counter => counter + 5);
      }, 1500);
      setIntervalId(id);
      return () => {
        clearInterval(id);
      };
    }
  }, [clicked]);

  useEffect(() => {
    if(intervalId) {
      setCounter(0);
      clearInterval(intervalId);
      setIntervalId(null);
      setClicked(false);
    }
  },[startDate, endDate])

  useEffect(() => {
    const fetch = async () => {
      axios.post(`https://9226baad71d3.ngrok.io/test`,{start: (new Date(startDate)).setSeconds(startDate.getSeconds()+counter), end: ((new Date(endDate)).setSeconds(endDate.getSeconds()+counter+3))}, {
        headers: {'Access-Control-Allow-Origin': '*'}
      }).then(({data}) => setData(data));
    };
    if(clicked) {
      fetch();
    }
  }, [clicked, counter])

  const handleZoomLevelChange = (newZoomLevel) => {
    setZoomLevel(newZoomLevel);
  };

  const mapUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  const mapCenter = [43.3231171460394, 21.886276544398882];
  const zoomLevel = 15;
  return (
      <div>
        <Map
            ref={m => { leafletM = m; }}
            center={mapCenter}
            zoom={zoomLevel}

        >
          <TileLayer
              url={mapUrl}
          />
          {data && data.map((item, index) => (<Marker key={item.dtime.toString()+item.vid} position={[item.lat,item.lon]}>
            <Popup>VID: {item.vid}<br/>Speed: {item.speed} km/h<br/>{item.iotypename} {item.iovalue} <br />{(new Date((new Date(item.dtime)).setHours((new Date(item.dtime)).getHours()+2))).toTimeString().split(' ')[0]}<br />
            <b>CO2 emission: {calculateCO2(item, data[index-1])}</b>
            </Popup>
            <Circle
                center={{lat:item.lat, lng: item.lon}}
                fillColor={mapCO2ToColor(calculateCO2(item, data[index-1]))}
                radius={mapCO2ToRadius(calculateCO2(item, data[index-1]))}/>
          </Marker>))
          }
        </Map>
        <DateTimePicker value={startDate} onChange={setStartDate} clearIcon={null}/>
        <DateTimePicker value={endDate} onChange={setEndDate} clearIcon={null}/>
        <div>
        <button onClick={() => setClicked(true)}>Request</button>
        <div>Start time: {new Date((new Date(startDate)).setSeconds(startDate.getSeconds()+counter)).toTimeString()}</div>
        <div>Current time: {new Date((new Date(endDate)).setSeconds(endDate.getSeconds()+counter+3)).toTimeString()}</div>
          {data && data.length && (<div>Total distance passed: {Math.ceil(data.reduce((a,b) => a + (b.distance || 0),0))} meters</div>)}
          {data && data.length && (<div>Total CO2 emission index: {Math.ceil(data.reduce((a,b) => a + (calculateCO2(b, a)),0))}</div>)}
      </div>
        </div>
  );
}

export default Leaflet;
