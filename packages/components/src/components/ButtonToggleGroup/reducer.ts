export type AnimationStateType = {
  isAnimated?: boolean;
  start?: [number, number];
  end?: [number, number];
  savedKey?: string | number;
};

type AnimationAction =
  | {
      type: 'SET_ANIMATED';
      payload: { start: [number, number]; end: [number, number] };
    }
  | { type: 'SET_SAVED'; payload: { savedKey?: string | number } }
  | { type: 'RESET' };

export const initialAnimationState: AnimationStateType = {};

export function animationReducer(
  state: AnimationStateType,
  action: AnimationAction
): AnimationStateType {
  switch (action.type) {
    case 'SET_ANIMATED':
      return {
        isAnimated: true,
        start: action.payload.start,
        end: action.payload.end,
      };
    case 'SET_SAVED':
      return {
        isAnimated: false,
        savedKey: action.payload.savedKey,
      };
    case 'RESET':
      return {};
    default:
      return state;
  }
}
