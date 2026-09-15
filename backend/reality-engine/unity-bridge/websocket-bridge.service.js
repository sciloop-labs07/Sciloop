export function buildUnityWebSocketEnvelope(scenePayload = {}) {
  return {
    protocol: "sciloop-unity-reality-engine-v0.1",
    type: "LOAD_REALITY_SCENE",
    sentAt: new Date().toISOString(),
    payload: scenePayload
  };
}

export function getUnityBridgeInstructions() {
  return {
    transport: "websocket-or-unity-webgl-sendmessage",
    webglObjectName: "SciLoopRealitySceneController",
    webglMethodName: "LoadSceneJson",
    note: "In WebGL, the browser can pass this JSON into Unity using unityInstance.SendMessage(objectName, methodName, json)."
  };
}
