import type { MetaFunction } from "@remix-run/node";

import { Container } from "../../shared/layouts/container";
import { Gradients } from "~/shared/consts/colors";

export const meta: MetaFunction = () => {
  return [
    { title: "댕글" },
    {
      name: "description",
      content:
        "보호자들이 반려동물의 일상과 건강 관리를 한 곳에서 효율적으로 관리하고, 타인과 정보나 팁을 나눌 수 있는 앱",
    },
  ];
};

export default function Index() {
  return (
    <>
      <Container $background={Gradients}></Container>
    </>
  );
}
