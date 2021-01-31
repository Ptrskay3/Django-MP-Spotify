import React, { Component } from "react";
import { Grid, Button, Typography, ButtonGroup } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import Player from "./Player";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuth: false,
      song: {},
    };
    this.roomCode = this.props.match.params.roomCode;
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.authSpotify = this.authSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.getRoomDetails();
  }

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({ song: data });
        console.log(data);
      });
  }

  authSpotify() {
    fetch("/spotify/is-auth")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spotifyAuth: data.status });
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  getRoomDetails() {
    fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        if (this.state.isHost) {
          this.authSpotify();
        }
      });
  }

  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("../api/leave-room", requestOptions).then((_response) => {});
    this.props.leaveRoomCallback();
    this.props.history.push("/");
  }

  renderSettings() {
    return (
      <Grid container spacing={1} align="center">
        <Grid item xs={12}>
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="outlined" color="secondary">
          <Button
            contained
            color="primary"
            onClick={() => this.updateShowSettings(true)}
          >
            Options
          </Button>
        </ButtonGroup>
      </Grid>
    );
  }

  render() {
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1} align="center">
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            Room : {this.roomCode}
          </Typography>
        </Grid>
        <Player {...this.state.song} />
        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12}>
          <ButtonGroup disableElevation variant="outlined" color="secondary">
            <Button color="secondary" onClick={this.leaveButtonPressed}>
              Leave
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  }
}
