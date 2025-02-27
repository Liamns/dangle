import { styled } from "styled-components";
import { centered } from "../consts/layout";
import { FlexAlign, FlexDirection, FlexJustify } from "../types/grids";

interface ContainerProps {
  $justify: FlexJustify;
  $align: FlexAlign;
  $direction: FlexDirection;
}

export const Container = styled.div<ContainerProps>`
  ${centered}
  display: flex;
  justify-content: ${(props) => props.$justify || "start"};
  align-items: ${(props) => props.$align || "center"};
  flex-direction: ${(props) => props.$direction || "column"};
`;
