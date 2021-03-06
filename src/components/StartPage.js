import React from "react";

class StartPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedHuntId: undefined,
    };
  }

  checkSelectedHunt() {
    if(this.state.selectedHuntId !== undefined) {
      this.props.startHunt(this.state.selectedHuntId);
    } 
  }

  render() {
    return (
      <div className="start-view">
        <div className="play-hunt">
          <h2>Pick a Treasure Hunt:</h2>
          <select onChange={(e) => this.setState({selectedHuntId: e.target.value})} name="hunts">
            <option value="undefined">---</option>
            {this.props.allHunts.map(hunt => <option value={hunt.hunt_id} key={hunt.hunt_id}>{hunt.hunt_name}</option>)}
          </select>
          <button onClick={() => this.checkSelectedHunt()}>Start</button>
        </div>

        <div className="create-hunt">
          <h2>Create a Treasure Hunt</h2>
          <button onClick={() => this.props.createHuntView()}>Create New</button>
        </div>

        <img alt="" src="../android-chrome-512x512.png" className="start-page-img" />
      </div>
    )
  }
}

export default StartPage;