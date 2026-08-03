import { ImageResponse } from "next/og";

export const alt = "EstimaWeb QC — Free web estimator by Auxo Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#F4F0E7",
        color: "#202725",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          border: "2px solid #D8D1C5",
          borderRadius: 24,
          boxShadow: "0 18px 55px rgba(32,39,37,0.12)",
          display: "flex",
          flexDirection: "column",
          padding: "68px",
          width: "100%",
          background: "#FBF8F1",
        }}
      >
        <div style={{ color: "#165A63", display: "flex", fontSize: 28, letterSpacing: 3, textTransform: "uppercase" }}>
          Auxo Systems
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, marginTop: 26 }}>
          EstimaWeb <span style={{ color: "#165A63", marginLeft: 20 }}>QC</span>
        </div>
        <div style={{ color: "#53615D", display: "flex", fontSize: 34, marginTop: 22 }}>
          Estimation web indicative • Indicative web estimate
        </div>
        <div style={{ color: "#1F4A3A", display: "flex", fontSize: 26, fontWeight: 700, marginTop: 48 }}>
          Outil gratuit • Free tool
        </div>
      </div>
    </div>,
    size
  );
}
