import { Container } from "./styles";

type IntroContainerProps = {
  children: JSX.Element;
};

const IntroContainer = ({ children }: IntroContainerProps) => (
  <Container>{children}</Container>
);

export default IntroContainer;
