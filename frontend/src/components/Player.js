import React, { Component } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.playSong = this.playSong.bind(this);
    this.pauseSong = this.pauseSong.bind(this);
    this.skipSong = this.skipSong.bind(this);
  }

  skipSong() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/skip", requestOptions).then((response) => {
      console.log(response);
    });
  }

  playSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/play", requestOptions).then((response) => {
      if (!response.ok) {
        return { error: "errored out.." };
      } else {
        return response.json();
      }
    });
  }

  pauseSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/pause", requestOptions).then((response) => {
      if (!response.ok) {
        return { error: "errored out.." };
      } else {
        return response.json();
      }
    });
  }

  render() {
    var songProgress = (100 * this.props.time) / this.props.duration;

    return (
      <Card>
        <Grid container align="center">
          <Grid item xs={4}>
            <img src={this.props.image_url} height="100%" width="100%" />
          </Grid>
          <Grid item xs={8}>
            <Typography component="h5" variant="h5">
              {this.props.title}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              {this.props.artist}
            </Typography>
            <div className="controlButtons">
              <IconButton
                onClick={() => {
                  this.props.is_playing ? this.pauseSong() : this.playSong();
                }}
              >
                {this.props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton>
                {this.props.votes} / {this.props.votes_required}
                <SkipNextIcon onClick={() => this.skipSong()} />
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <LinearProgress
          variant="determinate"
          color="secondary"
          value={songProgress}
        />
      </Card>
    );
  }
}
