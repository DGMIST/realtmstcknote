import styled from "@emotion/styled";

type NoteContainerProps = {
  color: string;
};

export const TitleContainer = styled.div`
  background: #000000bf;
  font-size: 4px;
`;

export const NoteContainer = styled.div<NoteContainerProps>`
  width: 70px;
  height: 40px;
  background: ${(props) => props.color};
  cursor: pointer;
  position: absolute;
  box-shadow: -2px 2px 15px 0 #000000e6;
`;
