import { StyledBoard } from "./styles";

type BoardProps = {
  onClick: () => React.MouseEvent<HTMLElement>;
};

const Board = ({ onClick }: BoardProps) => <StyledBoard onClick={onClick} />;

export default Board;
