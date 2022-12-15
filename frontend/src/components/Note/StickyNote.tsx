// @ts-nocheck
import React from "react";
import Draggable from "react-draggable";
import {
  NoteContainer,
  TextArea,
  TextContainer,
  TitleContainer,
} from "./styles";

type NoteProps = {
  id: string;
  userId: string;
  userName: string;
  posX: number;
  posY: number;
  color: string;
  updatePosition: any;
  myNote: boolean;
  text: string;
};

const areEqual = (prevProps: NoteProps, nextProps: NoteProps) => {
  if (
    prevProps.posX !== nextProps.posX ||
    prevProps.posY !== nextProps.posY ||
    prevProps.text !== nextProps.text
  ) {
    return false;
  }
  return true;
};

const StickyNote = ({
  id,
  color,
  updatePosition,
  userId,
  userName,
  myNote,
  posX,
  posY,
  text,
}: NoteProps) => {
  const handleDragEnd = (event: any, data: any) => {
    updatePosition({
      id,
      posX: data.lastX,
      posY: data.lastY,
      userId,
      userName,
      color,
      text,
    });
  };

  const handleTextChange = (newText: string) => {
    updatePosition({
      id,
      posX,
      posY,
      userId,
      userName,
      color,
      text: newText,
    });
  };

  const nodeRef = React.useRef(null);
  return (
    <>
      {myNote ? (
        <Draggable
          key={id}
          defaultPosition={{ x: posX, y: posY }}
          onStart={handleDragEnd}
          onDrag={handleDragEnd}
          onStop={handleDragEnd}
          nodeRef={nodeRef}
        >
          <NoteContainer
            onClick={(e) => e.preventDefault()}
            ref={nodeRef}
            dark={myNote}
            color={color}
          >
            <TitleContainer dark={myNote}>{userName}</TitleContainer>
            <TextArea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </NoteContainer>
        </Draggable>
      ) : (
        <Draggable
          key={id}
          defaultPosition={{ x: posX, y: posY }}
          nodeRef={nodeRef}
          position={{ x: posX, y: posY }}
          disabled
        >
          <NoteContainer ref={nodeRef} dark={myNote} color={color}>
            <TitleContainer dark={myNote}>{userName}</TitleContainer>
            <TextContainer>{text}</TextContainer>
          </NoteContainer>
        </Draggable>
      )}
    </>
  );
};

export default React.memo(StickyNote, areEqual);
