import GlobeComponent from "@/components/GlobeComponent";
import GlobeWrapper from "@/components/GlobeWrapper";
import DeckGLMap from "@/components/DeckGLMap";
import DeckGLMap2 from "@/components/DeckGLMap2";
import MapBoxExample from "@/components/MapBoxExample";

export default function Home() {
  return (
    <main>
      <h1>Latency Topology Visualizer</h1>
      {/* <DeckGLMap2/> */}
     <MapBoxExample />
      {/* <GlobeComponent /> */}
    </main>
  );
}
