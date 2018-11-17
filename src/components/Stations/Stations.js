import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import L from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';

import getMood from '../../utilities/GetMood';
import './Stations.css';

class Stations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasLocation: false,
            location: {
                lat: 48.323368,
                lng: 14.298756,
            },
            center: {
                lat: 48.323368,
                lng: 14.298756,
            },
            zoom: 13,
            myStations: [],
        }
    }

    componentDidMount() {
        this.getStations();
        this.getLocation();
    }

    componentDidUpdate(prevProps) {
        this.props.stations.forEach((station) => {
            if (this.props.stations.length && this.props.stations.length > prevProps.stations.length) {
                this.getStations();
            }
        });


        if (this.props.update.timestamp > prevProps.update.timestamp) {
            // this.updateStations();
            this.getStations();
        }
    }

    // forward to the official station when clicking on the corresponding placeholder on the map
    handleClickCircle = (provider, station) => (e) => {
        this.props.history.push({
            pathname: "/station/" + provider + "/" + station,
            state: {
                x: e.originalEvent.clientX,
                y: e.originalEvent.clientY
            }
        });
    }

    // go back to the main route
    handleClickMap = () => {
        this.props.history.push("/");
    }

    // forward to the luftdaten station when clicking on the corresponding placeholder on the map
    handleClickLuftdatenMarker = (marker) => {
        this.props.history.push({
            pathname: "/station/luftdaten/" + marker.options.title,
            state: {
                x: marker._icon._leaflet_pos.x,
                y: marker._icon._leaflet_pos.y
            }
        });
    }

    handleLocationFound = e => {
        this.setState({
            hasLocation: true,
            location: e.latlng,
            center: e.latlng
        })

        // console.log(this.refs.map.leafletElement);
    }

    getLocation = () => {
        this.refs.map.leafletElement.locate();
    }

    getStations = () => {
        let myStations = this.props.stations.map(element => {
            let marker = "";

            if (element.provider === "luftdaten") {
                marker = L.divIcon({
                    html: `<svg xmlns="http://www.w3.org/2000/svg" 
                        class="" viewBox="0 0 600 600" 
                        style="fill: ${getMood(element.mood, .75)}">
                        <path d="M41.1,165.29V434.71a25.57,25.57,0,0,0,12.78,22.15L287.21,591.57a25.58,25.58,0,0,0,25.58,0L546.12,456.86a25.57,25.57,0,0,0,12.78-22.15V165.29a25.57,25.57,0,0,0-12.78-22.15L312.79,8.43a25.58,25.58,0,0,0-25.58,0L53.88,143.14A25.57,25.57,0,0,0,41.1,165.29Z"/>
                        </svg>`,
                    className: "air__stations-luftdaten-marker",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                });
            }

            if (element.provider === "upperaustria") {
                marker = L.divIcon({
                    html: `<svg xmlns="http://www.w3.org/2000/svg" 
                        class="" viewBox="0 0 600 600" 
                        style="fill: ${getMood(element.mood, .75)}">
                        <path d="M5,300H5A295,295,0,0,0,152.5,555.48h0a295,295,0,0,0,295,0h0A295,295,0,0,0,595,300h0A295,295,0,0,0,447.5,44.52h0a295,295,0,0,0-295,0h0A295,295,0,0,0,5,300Z"/>
                        </svg>`,
                    className: "air__stations-upperaustria-marker-wrapper",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                });
            }

            return (
                <Marker
                    key={element.id}
                    icon={marker}
                    onClick={this.handleClickCircle(element.provider, element.id)}
                    bubblingMouseEvents={false}
                    position={[element.longitude, element.latitude]}
                    title={element.name}
                    stroke={false}
                    fillOpacity={1}></Marker>
            )
        });

        this.setState({ myStations: myStations });
    }

    updateStations = () => {
        let myStations = [];

        myStations = this.state.myStations.map(station => {
            let html = station.props.icon.options.html;
            html = html.replace(/style=".*"/g, 'style="fill: ' + getMood(100, .75) + '"');
            station.props.icon.options.html = html;
        
            return station    
        })

        this.setState({
            myStations: myStations
        })

        console.log(this.refs.map.props);
    }

    render() {
        const location = this.state.hasLocation ? (
            <Marker position={this.state.location}></Marker>
        ) : null;

        return (
            <Map className="air__stations"
                onClick={this.handleClickMap}
                onMovestart={this.handleClickMap}
                center={this.state.center}
                zoom={this.state.zoom}
                maxZoom={16}
                // preferCanvas="true"
                doubleClickZoom="false"
                // onLocationfound={this.handleLocationFound}
                ref="map">
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
                />
                {location}
                {this.state.myStations}
            </Map>
        )
    }
}

const mapStateToProps = state => {
    return {
        stations: state.stations,
        update: state.update
    };
}

export default withRouter(connect(mapStateToProps)(Stations));