import { styled } from "styled-components";
import { centered } from "../consts/layout";
import { FlexAlign, FlexDirection, FlexJustify } from "../types/grids";

interface ContainerProps {
  $justify?: FlexJustify;
  $align?: FlexAlign;
  $direction?: FlexDirection;
  $height?: string;
  $background?: string;
}

export const Container = styled.div<ContainerProps>`
  ${centered}
  display: flex;
  justify-content: ${(props) => props.$justify};
  align-items: ${(props) => props.$align};
  flex-direction: ${(props) => props.$direction};
  height: ${(props) => props.$height};
  background: ${(props) => props.$background};
`;

// 기본값 설정
Container.defaultProps = {
  $justify: "start",
  $align: "center",
  $direction: "column",
  $height: "100%",
  $background: "white",
};
