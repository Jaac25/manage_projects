// Loader.tsx
import React from "react";

const Loader = () => {
  return <div style={styles.loader}></div>;
};

const styles = {
  loader: {
    width: "30px",
    height: "30px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid purple",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  } as React.CSSProperties,

  // Importante: en React no puedes definir @keyframes directamente aquí
};

// Necesitas agregar este CSS globalmente:
const globalStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Puedes inyectarlo en tu app:
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = globalStyles;
  document.head.appendChild(style);
}

export default Loader;
