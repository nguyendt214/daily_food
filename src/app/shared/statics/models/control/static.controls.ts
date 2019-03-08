import { INameValidator } from './name';
import { IPhone } from './phone';
import { IPattern } from './pattern';
import { IMax } from './max';

export interface IStaticControls {
  name?: INameValidator;
  firstName?: INameValidator;
  phone?: IPhone;
  companyName?: IPattern;
  address?: IMax;
  addressComplement?: IMax;
  stair?: IMax;
  floor?: IMax;
  door?: IMax;
}
