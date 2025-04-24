import AnnivWidget from "@/features/anniversary/components/anniv-widget";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import { InnerBox, InnerWrapper, Spacer } from "../../shared/components/layout";

export default function Home() {
  return (
    <InnerWrapper>
      <InnerBox>
        <Spacer height="32" />
        <AnnivWidget />
      </InnerBox>
      <BottomNavBar />
    </InnerWrapper>
  );
}
