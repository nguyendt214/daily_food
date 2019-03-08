import { IStaticControls } from './control/static.controls';
import { IStaticConstant } from './constant/static.constant';

export interface IStatic {
  controls?: IStaticControls;
  constants?: IStaticConstant;
}
