export type SequenceState =
  | 'idle'
  | 'maroma'
  | 'waving'
  | 'searching'
  | 'walking'
  | 'pushing'
  | 'finished';

export type FormInteractionState = {
  focusedField: 'none' | 'email' | 'password';
  isPasswordVisible: boolean;
  submitStatus: 'idle' | 'submitting' | 'success' | 'error';
  keystrokeCount: number;
};

export interface CharacterTransform {
  x: number;
  y: number;
  z: number;
  rotationY: number;
}
