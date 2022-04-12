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

export interface AndroidPropertiesOperation extends Operation {
  value: {
    file: string;
    entries: any
  }[];
}

export interface XmlOperation extends Operation {
  value: XmlOperationValue[]
}

export interface XmlOperationValue {
    file?: string;
    target: any;
    attrs?: any;
    inject?: string;
    merge?: string;
    replace?: string;
}

export interface AndroidXmlOperationValue extends XmlOperationValue {
  file?: string;
  resFile?: string;
}
export interface IosXmlOperationValue extends XmlOperationValue {
  file: string;
}
export interface AndroidManifestOperation extends XmlOperation {
  value: AndroidXmlOperationValue[];
}
export interface AndroidXmlOperation extends XmlOperation {
  value: AndroidXmlOperationValue[];
}
export interface IosXmlOperation extends XmlOperation {
  value: IosXmlOperationValue[];
}