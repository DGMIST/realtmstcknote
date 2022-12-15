import { useEffect, useState } from "react";
import { generateGradientColor } from "../../util";
import { TitleContainer, NoteContainer } from "./styles";

type FallingNotesProps = {
  userNames: string[];
};

const FallingNotes = ({ userNames }: FallingNotesProps) => {
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    setColor(generateGradientColor());
  }, []);

  return (
    <>
      {userNames.map((name: string) => (
        <NoteContainer key={name} className="fallingNote" color={color}>
          <TitleContainer>{name}</TitleContainer>
        </NoteContainer>
      ))}
    </>
  );
};

export default FallingNotes;
