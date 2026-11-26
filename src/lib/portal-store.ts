export interface PortalRuntimeState {
  enabled: boolean;
  /** True while Hero Portal is near/in viewport; switches false after dive for 0% GPU */
  stageActive: boolean;
  /** 0..1 overall Scene 1 -> Scene 2 -> Scene 3 reversible scroll choreography progress */
  portalProgress: number;
  /** Responsive 3D model scale */
  responsiveScale: number;
}

export const portalState: PortalRuntimeState = {
  enabled: true,
  stageActive: true,
  portalProgress: 0,
  responsiveScale: 1,
};

type StageListener = () => void;
const stageListeners = new Set<StageListener>();

export function subscribeStageActive(listener: StageListener): () => void {
  stageListeners.add(listener);
  return () => {
    stageListeners.delete(listener);
  };
}

export function updatePortalState(partial: Partial<PortalRuntimeState>): void {
  const prevActive = portalState.stageActive;
  Object.assign(portalState, partial);
  if (prevActive !== portalState.stageActive) {
    stageListeners.forEach((fn) => fn());
  }
}
