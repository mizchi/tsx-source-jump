import { Box } from "@chakra-ui/react";

function Sub() {
  return <div style={{ background: "#aaa" }}>Sub</div>;
}

export function App() {
  return (
    <div style={{ padding: 50 }}>
      <div
        style={{
          display: "grid",
          width: 1000,
          height: 600,
          gridTemplateRows: "1fr 1fr 1fr",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <div style={{ gridArea: `1 / 1 / 2 / 2`, backgroundColor: "#bbb" }}>
          <Sub />
        </div>
        <div
          style={{
            gridArea: `2 / 1 / 2 / 2`,
            backgroundColor: "#aaf",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Box
            width="250px"
            height="100px"
            background="#faa"
            display="grid"
            placeItems="center"
          >
            Box
          </Box>
        </div>
        <div
          style={{
            gridArea: "2 / 2 / 4 / 4",
            backgroundColor: "#afa",
          }}
        >
          zz
        </div>
      </div>
    </div>
  );
}
