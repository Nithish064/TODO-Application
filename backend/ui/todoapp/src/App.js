import './App.css';
import { Component } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      showUpdateTextField: false,
      updatedNotes: '',
      updatedNotesId: null,
    };
  }

  API_URL = "https://localhost:7152/api/TodoApp/";

  componentDidMount() {
    this.refreshNotes();
  }

  async refreshNotes() {
    fetch(this.API_URL + "GetNotes")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ notes: data });
      });
  }

  async addClick() {
    const newNotes = document.getElementById("newNotes").value;
    const data = new FormData();
    data.append("newNotes", newNotes);

    fetch(this.API_URL + "AddNotes", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        alert(result);
        this.refreshNotes();
      });
  }

  updateClick = (id) => {
    this.setState({
      showUpdateTextField: true,
      updatedNotesId: id,
    });
  };

  updateNote = () => {
    const { updatedNotesId, updatedNotes } = this.state;
    const data = new FormData();
    data.append("newNotes", updatedNotes);

    axios
      .put(this.API_URL + `UpdateNote?id=${updatedNotesId}`, data)
      .then((response) => {
        alert(response.data);
        this.refreshNotes();
        this.setState({
          showUpdateTextField: false,
          updatedNotes: '',
          updatedNotesId: null,
        });
      })
      .catch((error) => {
        console.error("Error updating note: ", error);
      });
  };

  async deleteClick(id) {
    fetch(this.API_URL + "DeleteNotes?id=" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((result) => {
        alert(result);
        this.refreshNotes();
      });
  }

  handleUpdatedNotesChange = (event) => {
    this.setState({
      updatedNotes: event.target.value,
    });
  };

  render() {
    const { notes, showUpdateTextField, updatedNotesId } = this.state;
    return (
      <div
        className="App"
        style={{ backgroundImage: `URL(${process.env.PUBLIC_URL + '/b1.jpg'})` }}
      >
        <h2 className="h2">TODO</h2>
        <TextField
          sx={{ width: 500 }}
          id="newNotes"
          color="success"
          label="Type something....."
          variant="outlined"
          className="text"
        />
        <p />
        <Button variant="contained" color="success" onClick={() => this.addClick()}>
          Add Note
        </Button>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {notes.map((note) => (
            <Card key={note.id} sx={{ maxWidth: 500, margin: '10px auto' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {note.description}
                </Typography>
                <Button
                  style={{ margin: 10, borderRadius: '10px' }}
                  variant="contained"
                  color="warning"
                  onClick={() => this.updateClick(note.id)}
                >
                  Update
                </Button>
                <Button
                  style={{ borderRadius: '10px' }}
                  onClick={() => this.deleteClick(note.id)}
                  variant="contained"
                  color="error"
                >
                  Delete
                </Button>
                {showUpdateTextField && updatedNotesId === note.id && (
                  <div>
                    <TextField
                      sx={{ width: 500 }}
                      id="updatedNotes"
                      color="success"
                      label="Update note..."
                      variant="outlined"
                      className="text"
                      value={this.state.updatedNotes}
                      onChange={this.handleUpdatedNotesChange}
                    />
                    <Button
                      style={{ margin: 10, borderRadius: '10px' }}
                      variant="contained"
                      color="warning"
                      onClick={this.updateNote}
                    >
                      Update
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
