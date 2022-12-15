import { StyledCard } from "./styles";

type CardProps = {
  children: JSX.Element;
};

const Card = ({ children }: CardProps) => <StyledCard>{children}</StyledCard>;

export default Card;
