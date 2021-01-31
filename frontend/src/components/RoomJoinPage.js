import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";


export default class RoomJoinPage extends Component {
    constructor(props) {
        super(props);
    
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.roomButtonPressed = this.roomButtonPressed.bind(this)
    this.state = {
        roomCode: "",
        error: ""
        };
    }

    handleTextFieldChange(e) {
        this.setState({
            roomCode: e.target.value
        });

    }

    roomButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: this.state.roomCode
            })
        };
        fetch('/api/join-room', requestOptions).then((response) => {
            if (response.ok) {
                this.props.history.push(`/room/${this.state.roomCode}`)
            } else {
                this.setState({
                    error: "No such room."
                });
            }
        })
    }

    render() {
        return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}> 
            <Typography variant="h4" component="h4">
                Join a room!
            </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField 
                error={this.state.error}
                label="Code"
                placeholder="Enter a room code!"
                value={this.state.roomCode}
                helperText={this.state.error}
                variant="outlined"
                onChange={this.handleTextFieldChange}
                />    
            </Grid>
            <Grid item xs={12}> 
            <Button variant="contained" color="primary" onClick={this.roomButtonPressed}>
                Enter room
                </Button>
            </Grid>
            <Grid item xs={12}> 
            <Button variant="contained" color="secondary" to="/" component={Link}>
                Back
                </Button>
            </Grid>

            </Grid>
        );
    }
}