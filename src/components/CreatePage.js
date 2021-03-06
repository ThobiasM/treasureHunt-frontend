import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import MAPS_API_KEY from "../config";
import NameHuntPage from "./NameHuntPage";
import InvalidHuntNamePage from "./InvalidHuntNamePage";
import PostSavedPage from "./PostSavedPage";
import NewPostInfo from "./NewPostInfo";
const API_URL = process.env.REACT_APP_HUNT_API_URL;

class CreatePage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      view: 'name-hunt',
      newHuntName: '',
      newHuntLocations: [],
      creatorPosition: {},
      newMarkerPosition: {},
      newPostName: '',
      newPostIndex: 1,
      newHint: '',
      newFinalMessage: '',
      newPostRadius: 50,
    }
  }

  async componentDidMount() {
    const creatorPosition = await this.getCreatorPosition();

    this.setState({
      creatorPosition,
    })
  }

  async getCreatorPosition() {
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

    return {
      lat: currentPosition.coords.latitude,
      lng: currentPosition.coords.longitude,
    }
  }

  handleMapClick(e) {
    console.log('CLICKED MAP');
    let clickLat = parseFloat(e.latLng.lat().toFixed(6));
    let clickLng = parseFloat(e.latLng.lng().toFixed(6));
    let markerPosition = {lat: clickLat, lng: clickLng};
    console.log(markerPosition);

    this.setState({
      newMarkerPosition: markerPosition,
    })
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value.replace(/[-[\]{}()*+;\\^$|#]/g, '\\$&'),
    }) 
  }

  createPosts() {
    if (this.state.newHuntName) {
      this.setState({
        view: 'add-post',
      })
    }
  }

  handleSavePost() {
    console.log(this.state.newMarkerPosition, this.state.newPostName, this.state.newHint);

    if (this.state.newMarkerPosition.lat && this.state.newPostName && this.state.newHint) {
      const newPost = {
        post_name: this.state.newPostName,
        radius: this.state.newPostRadius,
        hint: this.state.newHint,
        coordinates: this.state.newMarkerPosition,
        index: this.state.newPostIndex,
      }

      console.log(newPost);

      this.setState({
        view: 'post-saved',
        newHuntLocations: [...this.state.newHuntLocations, newPost],
        newPostIndex: this.state.newPostIndex + 1,
        newMarkerPosition: {},
        newPostName: '',
        newHint: '',
        newPostRadius: 50,
      })
    }
    console.log(this.state.newHuntLocations);
  }

  async handleSubmitNewHunt() {
    let fetchStatus = '';
    try {
      await fetch(`${API_URL}/allhunts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newHuntName: this.state.newHuntName }),
    }).then(res => fetchStatus = res.status)


    if (fetchStatus !== 409 && this.state.newHuntLocations.length > 0) {
        let updateHunt = await fetch(`${API_URL}/locations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            huntName: this.state.newHuntName,
            createdAt: new Date().toString().slice(0, 23),
            huntLocations: this.state.newHuntLocations,
            finalMessage: this.state.newFinalMessage,
          }),
        });
        

        this.setState({
          newHuntLocations: [],
          newPostIndex: 1,
          newMarkerPosition: {},
          newPostName: '',
          newHint: '',
          newPostRadius: 50,
        })
    } else {
        return this.setState({
          view: 'new-name-hunt',
        })}
    }
  catch (error) {
    console.log('Dette er consolen ', error)
  }
  this.props.startView();
  }

  addNewPost() {
    this.setState({
      view: 'add-post',
    })
  }

  addFinalMessage(finalMessage) {
    this.setState({
      newFinalMessage: finalMessage,
    })
  }
  
  render() {

    const containerStyle = {
      width: "100%",
      height: "50%",
    };

    let centerPosition = this.state.creatorPosition ? this.state.creatorPosition : {lat: 59.911237964049626, lng: 10.750340656556627};

    return (
      <section className='create-view'>
        {this.state.view === 'name-hunt' &&
          <NameHuntPage
            handleInputChange={this.handleInputChange.bind(this)}
            createPosts={this.createPosts.bind(this)}
          />
        }

        {this.state.view === 'add-post' &&
          <div className="add-post-view">
            <h3>Select a location for your post</h3>

            <LoadScript googleMapsApiKey={MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={centerPosition}
                zoom={16}
                onClick={this.handleMapClick.bind(this)}
                clickableIcons={false}
              >

                {this.state.newMarkerPosition && <Marker
                  position={this.state.newMarkerPosition}
                  // icon={"https://i.ibb.co/RTzGNSd/Star-skype.png"}
                  icon={"https://i.ibb.co/j8NcQ4C/Star-black-outline.png"}
                  // scaledSize={{width: 40, height: 40}}
                  // anchor={{x: 20, y: 20}}
                /> }

                {this.state.newHuntLocations.map(post => {
                  return <Marker
                    key={post.index}
                    position={post.coordinates}
                    // icon={"https://i.ibb.co/RTzGNSd/Star-skype.png"}
                    icon={"https://i.ibb.co/j8NcQ4C/Star-black-outline.png"}
                    label={`${post.index}`}
                  />
                })}

              </GoogleMap>
            </LoadScript>

            <NewPostInfo
              handleInputChange={this.handleInputChange.bind(this)}
              handleSavePost={this.handleSavePost.bind(this)}
              newPostRadius={this.state.newPostRadius}
            />
          </div>
        }


        {this.state.view === 'post-saved' &&
          <PostSavedPage
            addNewPost={this.addNewPost.bind(this)}
            addFinalMessage={this.addFinalMessage.bind(this)}
            handleInputChange={this.handleInputChange.bind(this)}
            handleSubmitNewHunt={this.handleSubmitNewHunt.bind(this)}
          />
        }


        {this.state.view === 'new-name-hunt' &&
          <InvalidHuntNamePage
            handleInputChange={this.handleInputChange.bind(this)}
            handleSubmitNewHunt={this.handleSubmitNewHunt.bind(this)}
          />
        }  

      </section>
    )
  }
}

export default CreatePage;




