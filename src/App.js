import React, { useState, useEffect, useRef } from "react";

// 模型数据数组
const models = [
  {
    id: 1,
    name: "小狗",
    src: "/dogpuppy.glb",
    iosSrc: "/dogpuppy.usdz",
    thumbnail: "/dogpuppy-thumb.png"
  },
  {
    id: 2,
    name: "牛武士",
    src: "/cowman.glb",
    iosSrc: "/cowman.usdz",
    thumbnail: "/cowman-thumb.png"
  },
  {
    id: 3,
    name: "蜘蛛侠",
    src: "/spider-man.glb",
    iosSrc: "/spider-man.usdz",
    thumbnail: "/spider-man-thumb.png"
  },
  {
    id: 4,
    name: "黑老鼠",
    src: "/black_rat.glb",
    iosSrc: "/black_rat.usdz",
    thumbnail: "/black_rat-thumb.png"
  }
];

export default function App() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModel, setCurrentModel] = useState(models[0]);
  const [availableAnimations, setAvailableAnimations] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState("");
  const [isAnimationPanelExpanded, setIsAnimationPanelExpanded] = useState(false);
  const [arPlacement, setArPlacement] = useState('floor');
  const [modelScale, setModelScale] = useState(1);
  const [modelRotationX, setModelRotationX] = useState(0);
  const [modelRotationY, setModelRotationY] = useState(0);
  const [modelRotationZ, setModelRotationZ] = useState(0);
  const [showUI, setShowUI] = useState(true);
  const [isAdjustmentPanelExpanded, setIsAdjustmentPanelExpanded] = useState(false);
  const modelViewerRef = useRef(null);

  // 切换模型的处理函数
  const handleModelSwitch = (model) => {
    if (model.id !== currentModel.id) {
      setCurrentModel(model);
      setIsLoading(true);
      setLoadingProgress(0);
      // 清空动画状态，防止上一个模型的动画名字残留
      setAvailableAnimations([]);
      setCurrentAnimation("");
      setIsAnimationPanelExpanded(false);
      // 重置模型大小和旋转
      setModelScale(1);
      setModelRotationX(0);
      setModelRotationY(0);
      setModelRotationZ(0);
    }
  };

  // 重置模型大小和朝向
  const handleResetModel = () => {
    setModelScale(1);
    setModelRotationX(0);
    setModelRotationY(0);
    setModelRotationZ(0);
  };

  // 复位摄像机视角
  const handleResetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = "0deg 75deg 105%";
      modelViewerRef.current.cameraTarget = "auto auto auto";
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
        
        // 读取模型的可用动画列表
        if (modelViewer.availableAnimations && modelViewer.availableAnimations.length > 0) {
          const animations = modelViewer.availableAnimations;
          setAvailableAnimations(animations);
          setCurrentAnimation(animations[0]); // 设置第一个动画为默认动画
        }
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
      {/* UI 显示/隐藏切换按钮 */}
      <button style={styles.toggleUIButton} onClick={() => setShowUI(!showUI)}>
        {showUI ? '👁️ 隐藏界面' : '👁️ 显示界面'}
      </button>

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

      {/* 顶部区域 - AR 放置模式选择 */}
      {showUI && (
        <div style={styles.topPanel}>
          <button
            style={{
              ...styles.arPlacementButton,
              ...(arPlacement === 'floor' ? styles.arPlacementButtonActive : {})
            }}
            onClick={() => setArPlacement('floor')}
          >
            🔲 放置在地面
          </button>
          <button
            style={{
              ...styles.arPlacementButton,
              ...(arPlacement === 'wall' ? styles.arPlacementButtonActive : {})
            }}
            onClick={() => setArPlacement('wall')}
          >
            🧱 贴在墙面
          </button>
        </div>
      )}

      {/* 中间区域 - 模型展示 */}
      <div style={styles.modelContainer}>
        <model-viewer
          ref={modelViewerRef}
          style={styles.modelViewer}
          src={process.env.PUBLIC_URL + currentModel.src}
          poster={process.env.PUBLIC_URL + currentModel.thumbnail}
          reveal="auto"
          alt={currentModel.name}
          ar
          ar-modes="scene-viewer quick-look webxr"
          ar-scale="auto"
          ar-placement={arPlacement}
          scale={`${modelScale} ${modelScale} ${modelScale}`}
          orientation={`${modelRotationX}deg ${modelRotationY}deg ${modelRotationZ}deg`}
          camera-controls
          auto-rotate
          autoplay
          animation-name={currentAnimation}
          shadow-intensity="1"
          shadow-softness="0.8"
          environment-image="neutral"
          tone-mapping="neutral"
        >
          {/* 自定义一个进入 AR 模式的按钮 */}
          <button slot="ar-button" style={styles.arButton}>
            👋 放置在房间里
          </button>
        </model-viewer>



        {/* 复位视角按钮 */}
        {showUI && (
          <button style={styles.resetCameraButton} onClick={handleResetCamera}>
            🎥 视角归位
          </button>
        )}
      </div>

      {/* 底部区域 - 动画切换和模型选择 */}
      {showUI && (
        <div style={styles.bottomPanel}>
          {/* 模型调整控制面板 */}
          <div style={styles.adjustmentControlsContainer}>
            <button 
              style={styles.panelToggleButton}
              onClick={() => setIsAdjustmentPanelExpanded(!isAdjustmentPanelExpanded)}
            >
              🛠️ 调整模型大小与朝向 {isAdjustmentPanelExpanded ? '▲' : '▼'}
            </button>
            {isAdjustmentPanelExpanded && (
              <div style={styles.slidersGrid}>
                <div style={styles.adjustmentControl}>
                  <label style={styles.adjustmentLabel}>
                    大小: {modelScale.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={modelScale}
                    onChange={(e) => setModelScale(parseFloat(e.target.value))}
                    style={styles.slider}
                  />
                </div>

                <div style={styles.adjustmentControl}>
                  <label style={styles.adjustmentLabel}>
                    X轴 (俯仰): {modelRotationX}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={modelRotationX}
                    onChange={(e) => setModelRotationX(parseInt(e.target.value))}
                    style={styles.slider}
                  />
                </div>

                <div style={styles.adjustmentControl}>
                  <label style={styles.adjustmentLabel}>
                    Y轴 (水平): {modelRotationY}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={modelRotationY}
                    onChange={(e) => setModelRotationY(parseInt(e.target.value))}
                    style={styles.slider}
                  />
                </div>

                <div style={styles.adjustmentControl}>
                  <label style={styles.adjustmentLabel}>
                    Z轴 (侧翻): {modelRotationZ}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={modelRotationZ}
                    onChange={(e) => setModelRotationZ(parseInt(e.target.value))}
                    style={styles.slider}
                  />
                </div>

                <button style={styles.resetModelButton} onClick={handleResetModel}>
                  🔄 重置
                </button>
              </div>
            )}
          </div>

          {/* 动画切换控制面板 */}
          {availableAnimations.length > 0 && (
            <div style={styles.animationControlsContainer}>
              <button 
                style={styles.panelToggleButton}
                onClick={() => setIsAnimationPanelExpanded(!isAnimationPanelExpanded)}
              >
                🎬 动画切换 {isAnimationPanelExpanded ? '▲' : '▼'}
              </button>
              {isAnimationPanelExpanded && (
                <div style={styles.animationButtonsScroll}>
                  {availableAnimations.map((animName, index) => (
                    <button
                      key={index}
                      style={{
                        ...styles.animationButton,
                        ...(currentAnimation === animName ? styles.animationButtonActive : {})
                      }}
                      onClick={() => setCurrentAnimation(animName)}
                    >
                      {animName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

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
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    width: "100vw",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  topPanel: {
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#f0f0f0",
  },
  modelContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  bottomPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "15px 10px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e0e0e0",
    zIndex: 10,
  },
  modelViewer: {
    width: "100%",
    height: "100%",
    outline: "none",
  },
  arButton: {
    backgroundColor: "white",
    borderRadius: "8px",
    border: "none",
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    cursor: "pointer",
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
  // AR 放置模式按钮样式
  arPlacementButton: {
    padding: "10px 20px",
    backgroundColor: "#ffffff",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    whiteSpace: "nowrap",
  },
  arPlacementButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    color: "#ffffff",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)",
  },
  // 动画控制面板样式
  animationControlsContainer: {
    backgroundColor: "rgba(248, 249, 250, 0.95)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  panelToggleButton: {
    width: "100%",
    padding: "12px 20px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  animationButtonsScroll: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    overflowX: "auto",
    overflowY: "hidden",
    padding: "0 12px 12px 12px",
    scrollbarWidth: "thin",
  },
  animationButton: {
    minWidth: "100px",
    padding: "10px 16px",
    backgroundColor: "#ffffff",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#555",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  animationButtonActive: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
    color: "#ffffff",
    transform: "scale(1.05)",
    boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
  },
  // 画廊容器样式
  galleryContainer: {
    backgroundColor: "rgba(248, 249, 250, 0.95)",
    borderRadius: "12px",
    padding: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  galleryTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
    textAlign: "center",
    letterSpacing: "0.5px",
  },
  galleryScroll: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    overflowY: "hidden",
    padding: "4px",
    scrollbarWidth: "thin",
  },
  modelCard: {
    minWidth: "90px",
    height: "90px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  modelCardActive: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
  },
  modelThumbnail: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "6px",
  },
  modelName: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
  },
  activeIndicator: {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "18px",
    height: "18px",
    backgroundColor: "#4CAF50",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "11px",
    fontWeight: "bold",
  },
  // 模型调整面板样式
  adjustmentControlsContainer: {
    backgroundColor: "rgba(248, 249, 250, 0.95)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  slidersGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 15px",
    padding: "12px",
    backgroundColor: "#ffffff",
  },
  adjustmentControl: {
    display: "flex",
    flexDirection: "column",
  },
  adjustmentLabel: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#555",
    marginBottom: "8px",
  },
  slider: {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    outline: "none",
    background: "linear-gradient(to right, #e0e0e0 0%, #2196F3 50%, #e0e0e0 100%)",
    cursor: "pointer",
  },
  resetModelButton: {
    gridColumn: "1 / -1",
    padding: "10px 16px",
    backgroundColor: "#FF6B6B",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#ffffff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
  },
  resetCameraButton: {
    position: "absolute",
    top: "60px",
    right: "15px",
    padding: "10px 16px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    zIndex: 20,
  },
  toggleUIButton: {
    position: "absolute",
    top: "15px",
    left: "15px",
    zIndex: 100,
    padding: "10px 15px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(5px)",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
    color: "#333",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
};
