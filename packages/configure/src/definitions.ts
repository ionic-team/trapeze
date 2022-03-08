export interface Operation {
  id: string;
  platform: 'ios' | 'android' | 'web' | 'windows' | string;
  name: string;
  value: any;
  displayText: string;
  iosTarget: string | null;
  iosBuild: string | null;
}

/*
export interface IosBundleIdOperationValue extends OperationValueObject {
  bundleId: string;
}
export interface IosVersionOperationValue extends OperationValueObject {
  version: string;
}
*/

export interface AndroidGradleOperation extends Operation {
  value: {
    file: string;
    target: any;
    insert?: string | any[];
    replace?: string | any[];
  }[];
}