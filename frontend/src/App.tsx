//@ts-nocheck
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import uuid4 from "uuid4";
import FallingNotes from "./components/FallingNotes/FallingNotes";
import StickyNote from "./components/Note/StickyNote";
import Card from "./components/Card/Card";
import IntroBackground from "./components/IntroBackground/IntroBackground";
import IntroContainer from "./components/IntroContainer/IntroContainer";
import Board from "./components/Board/Board";
import { generateGradientColor } from "./util";
import "./App.css";
const storageKey: string = "stNotesAuth";
let socket: Socket;

const BASE_URL: string = "http://localhost:4000";

type Note = {
  id: string;
  userId: string;
  userName: string;
  posX: number;
  posY: number;
  color: string;
  initalPosition: {
    x: number;
    y: number;
  };
  text: string;
};

type User = {
  id: string;
  name: string;
  isSignedIn: string;
};

type AxResponse = {
  id: string;
  name: string;
  token: string;
  notes: Note[];
};

function App() {
  const [userInput, setUserInput] = useState<string>("");
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    isSignedIn: "",
  });
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const userString: string | null = sessionStorage.getItem(storageKey);

    if (userString) {
      const userObj: User = JSON.parse(userString);
      if (userObj.isSignedIn) {
        setUser(userObj);
        initalizeSocket();
      }
    }
  }, []);

  const initalizeSocket = () => {
    socket = io(BASE_URL);
    socket.on("connect", () => {
      socket.emit("get_update");
      socket.on("update", (note: Note) => {
        onNoteChange(note);
      });
      socket.on("note_created", (notes: Note[]) => {
        setNotes(notes);
      });
    });
  };

  const createUser = async () => {
    try {
      const response = await axios.post<AxResponse>(`${BASE_URL}/api/verify`, {
        name: userInput,
      });
      const { token, id, notes, name } = response.data;
      setNotes(notes);
      setUser({ ...user, isSignedIn: token, id, name });
      const userString = JSON.stringify({ isSignedIn: token, id, name });
      sessionStorage.setItem(storageKey, userString);
      initalizeSocket();
    } catch (err) {
      console.log("err", err.response.data.error);
    }
  };

  const handleBoardClick = (e) => {
    const newNote: Note = {
      id: uuid4(),
      userId: user.id,
      userName: user.name,
      posX: e.clientX - 150,
      posY: e.clientY - 125,
      initalPosition: { x: e.clientX - 150, y: e.clientY - 125 },
      color: generateGradientColor(),
      text: "",
    };
    setNotes([...notes, newNote]);
    socket.emit("create_note", {
      token: user.isSignedIn,
      newNote,
    });
  };

  const handleUserInput = (value: string) => {
    setUserInput(value);
  };

  const handleNotePositionChange = (note: Note) => {
    onNoteChange(note);
    socket.emit("update_note", {
      token: user.isSignedIn,
      note: note,
    });
  };

  const onNoteChange = useCallback((note: Note) => {
    setNotes((prevItems: Note[]) =>
      prevItems.map((item: Note) => {
        return item.id !== note.id ? item : note;
      })
    );
  }, []);

  return (
    <>
      {user.isSignedIn ? (
        <>
          <Board onClick={handleBoardClick} />
          {notes.map((note: Note) => (
            <StickyNote
              key={note.id}
              updatePosition={(note: Note) => handleNotePositionChange(note)}
              userName={note.userName}
              userId={note.userId}
              posX={note.posX}
              posY={note.posY}
              id={note.id}
              color={note.color}
              myNote={user.id === note.userId}
              text={note.text}
            />
          ))}
        </>
      ) : (
        <>
          <IntroBackground />
          <FallingNotes
            userNames={[
              "SomeName",
              "ExampleNamee",
              "SomeNamee",
              "ExampleNameee",
              "SomeNameeeee",
              "ExampleNameeee",
            ]}
          />
          <Modal open>
            <>
              <IntroContainer>
                <Card>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createUser();
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <TextField
                        value={userInput}
                        onChange={(e) => handleUserInput(e.target.value)}
                        type="text"
                        required
                        id="outlined-required"
                        label="Your name"
                        placeholder="Enter your name!"
                      />
                      <Button variant="contained" type="submit">
                        Log in
                      </Button>
                    </Box>
                  </form>
                </Card>
              </IntroContainer>
            </>
          </Modal>
        </>
      )}
    </>
  );
}

export default App;
