import React, { useState, useEffect, useRef } from "react";

// 模型数据数组
const models = [
  {
    id: 1,
    name: "小狗",
    src: "/dogpuppy.glb",
    iosSrc: "/dogpuppy.usdz",
    thumbnail: "/dog-thumb.png"
  },
  {
    id: 2,
    name: "比武",
    src: "/cowman.glb",
    iosSrc: "/cowman.usdz",
    thumbnail: "/cowman-thumb.png"
  },
  {
    id: 3,
    name: "模型3",
    src: "/model3.glb",
    iosSrc: "/model3.usdz",
    thumbnail: "/model3-thumb.png"
  },
  {
    id: 4,
    name: "模型4",
    src: "/model4.glb",
    iosSrc: "/model4.usdz",
    thumbnail: "/model4-thumb.png"
  }
];

export default function App() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModel, setCurrentModel] = useState(models[0]);
  const [animationName, setAnimationName] = useState("");
  const modelViewerRef = useRef(null);

  // 切换模型的处理函数
  const handleModelSwitch = (model) => {
    if (model.id !== currentModel.id) {
      setCurrentModel(model);
      setIsLoading(true);
      setLoadingProgress(0);
    }
  };

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    
    if (modelViewer) {
      // 监听加载进度事件
      const handleProgress = (event) => {
        const progress = event.detail.totalProgress * 100;
        setLoadingProgress(Math.round(progress));
      };

      // 监听加载完成事件
      const handleLoad = () => {
        setLoadingProgress(100);
        // 延迟一点再隐藏加载界面，让用户看到 100%
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      };

      modelViewer.addEventListener('progress', handleProgress);
      modelViewer.addEventListener('load', handleLoad);

      // 清理事件监听器
      return () => {
        modelViewer.removeEventListener('progress', handleProgress);
        modelViewer.removeEventListener('load', handleLoad);
      };
    }
  }, [currentModel]);

  return (
    <div style={styles.container}>
      {/* 加载遮罩层 */}
      {isLoading && (
        <div style={{
          ...styles.loadingOverlay,
          opacity: isLoading ? 1 : 0,
        }}>
          <div style={styles.loadingContent}>
            <div style={styles.spinner}></div>
            <div style={styles.loadingText}>加载 {currentModel.name} 中...</div>
            <div style={styles.progressBarContainer}>
              <div 
                style={{
                  ...styles.progressBar,
                  width: `${loadingProgress}%`
                }}
              ></div>
            </div>
            <div style={styles.percentageText}>{loadingProgress}%</div>
          </div>
        </div>
      )}

      {/* Model Viewer */}
      <model-viewer
        ref={modelViewerRef}
        style={styles.modelViewer}
        src={process.env.PUBLIC_URL + currentModel.src}
        ios-src={process.env.PUBLIC_URL + currentModel.iosSrc}
        poster={process.env.PUBLIC_URL + currentModel.thumbnail}
        reveal="auto"
        alt={currentModel.name}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        autoplay
        animation-name={animationName}
        shadow-intensity="1"
      >
        {/* 自定义一个进入 AR 模式的按钮（可选，不写也会有默认按钮） */}
        <button slot="ar-button" style={styles.arButton}>
          👋 放置在房间里
        </button>
      </model-viewer>

      {/* 模型切换画廊 */}
      <div style={styles.galleryContainer}>
        <div style={styles.galleryTitle}>选择模型</div>
        <div style={styles.galleryScroll}>
          {models.map((model) => (
            <div
              key={model.id}
              style={{
                ...styles.modelCard,
                ...(currentModel.id === model.id ? styles.modelCardActive : {})
              }}
              onClick={() => handleModelSwitch(model)}
            >
              <img 
                src={process.env.PUBLIC_URL + model.thumbnail}
                alt={model.name}
                style={styles.modelThumbnail}
              />
              <div style={styles.modelName}>{model.name}</div>
              {currentModel.id === model.id && (
                <div style={styles.activeIndicator}>✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
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
    backgroundColor: "#f0f0f0",
    position: "relative",
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
    top: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    cursor: "pointer",
    zIndex: 101,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    transition: "opacity 0.5s ease-out",
  },
  loadingContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid #ffffff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "500",
    letterSpacing: "1px",
  },
  progressBarContainer: {
    width: "250px",
    height: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    transition: "width 0.3s ease",
    borderRadius: "4px",
  },
  percentageText: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
  },
  // 画廊容器样式
  galleryContainer: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "600px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
    zIndex: 100,
  },
  galleryTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px",
    textAlign: "center",
    letterSpacing: "0.5px",
  },
  galleryScroll: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    overflowY: "hidden",
    padding: "4px",
    scrollbarWidth: "thin",
  },
  modelCard: {
    minWidth: "100px",
    height: "100px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "2px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  modelCardActive: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
    transform: "scale(1.05)",
    boxShadow: "0 4px 16px rgba(33, 150, 243, 0.3)",
  },
  modelThumbnail: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "8px",
  },
  modelName: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
  },
  activeIndicator: {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "20px",
    height: "20px",
    backgroundColor: "#4CAF50",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  },
};
