import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import MAPS_API_KEY from "../config";

const containerStyle = {
  width: "100%",
  height: "65%",
};

function playerDistanceFromPost(playerPosition, postPosition) {
  let playerLat = playerPosition.lat;
  let playerLng = playerPosition.lng;
  let postLat = postPosition.lat;
  let postLng = postPosition.lng;

  const radius = 6371e3; // metres
  const φ1 = (playerLat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (postLat * Math.PI) / 180;
  const Δφ = ((postLat - playerLat) * Math.PI) / 180;
  const Δλ = ((postLng - playerLng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceToPost = radius * c; // in metres

  return distanceToPost;
}



class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPosition: {},
    };

    this.locationIntervalId = null;
  }


  async getPlayerPosition() {
    let currentPosition = await new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          resolve(position);
        },
        function (error) {
          reject(error);
        }
      );
    });

    this.setState({
      currentPosition: {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude,
      },
    });
  }

  async componentDidMount() {
    this.locationIntervalId =  setInterval(() => {
      this.getPlayerPosition();
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.locationIntervalId);
  }

  componentDidUpdate() {
    if (this.props.currentPostId > this.props.hunt.locations.length) {
      clearInterval(this.locationIntervalId);
    } 
    else {
      const location = this.props.hunt.locations[this.props.currentPostId-1];
  
      const distanceToPost = playerDistanceFromPost(
        this.state.currentPosition,
        location.coordinates
      );
  
      let updatedHunt = {...this.props.hunt};
  
      if (distanceToPost < location.radius) {
        updatedHunt.locations[this.props.currentPostId-1].isFound = true;
        this.props.updateHunt(updatedHunt);
      }
    }
  }

  render() {
    console.log(this.props.hunt);

    let centerPosition = this.state.currentPosition ? this.state.currentPosition : {lat: 59.911237964049626, lng: 10.750340656556627};

    return (
      <LoadScript googleMapsApiKey={MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={centerPosition}
          zoom={16}
          clickableIcons={false}
        >

        {
          this.props.hunt.locations
            .filter(post => {
              return post.isFound;
            })
            .map(post => {
              return (
                <Marker
                  key={post.post_id}
                  position={post.coordinates}
                  label={`${post.post_id}`}
                  // icon={"https://i.ibb.co/RTzGNSd/Star-skype.png"}
                  // icon={"https://i.ibb.co/RpddgTm/Star-brown-outline.png"}
                  icon={"https://i.ibb.co/j8NcQ4C/Star-black-outline.png"}
                />
              )
            })   
        }

        <Marker
          position={this.state.currentPosition}
          // icon={"https://i.ibb.co/br3PVxJ/Grinning-face.png"}
          label={"You"}
        />

        </GoogleMap>
      </LoadScript>
    );
  }
}

export default Map;
