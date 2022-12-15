import styled from "@emotion/styled";
import { Box } from "@mui/system";

type TitleContainerProps = {
  dark: boolean;
};

type NoteContainerProps = {
  dark: boolean;
  color: string;
};

export const TitleContainer = styled(Box)<TitleContainerProps>`
  padding: 10px;
  background: ${(props) => (props.dark ? "#000000bf" : "#ffffff66")};
`;

export const NoteContainer = styled(Box)<NoteContainerProps>`
  width: 300px;
  height: 250px;
  background: ${(props) => props.color};
  cursor: pointer;
  position: absolute;
  box-shadow: ${(props) =>
    props.dark ? "-2px 2px 15px 0 #000000e6" : "-2px 2px 15px 0 #0000004d"};
`;

export const TextArea = styled.textarea`
  background: transparent;
  color: black;
  width: 100%;
  height: 212px;
  padding: 10px;
  font-weight: 700;
  resize: none;
`;

export const TextContainer = styled(Box)`
  overflow: hidden;
  word-break: break-word;
  padding: 10px;
  max-height: 212px;
  overflow-y: scroll;
  color: white;
`;
