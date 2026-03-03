import React from "react";
import "@google/model-viewer";

export default function App() {
  return (
    <div style={styles.container}>
      {/* 这里只留下 model-viewer。
        注意新增的 ar 属性和 ar-modes 属性，这是召唤真实摄像头的关键！
      */}
      <model-viewer
        style={styles.modelViewer}
        src="/RobotExpressive.glb" /* 👈 记得确保你的模型在 public 文件夹下，并替换名字 */
        alt="A 3D model for AR"
        ar
        ar-modes="scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
      >
        {/* 自定义一个进入 AR 模式的按钮（可选，不写也会有默认按钮） */}
        <button slot="ar-button" style={styles.arButton}>
          👋 放置在房间里
        </button>
      </model-viewer>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // 在网页上预览时的背景色
  },
  modelViewer: {
    width: "100%",
    height: "100%",
    outline: "none",
  },
  arButton: {
    backgroundColor: "white",
    borderRadius: "4px",
    border: "none",
    position: "absolute",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    cursor: "pointer",
  },
};
