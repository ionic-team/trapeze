export interface Operation {
  id: string;
  platform: string;
  name: string;
  value: any;
  displayText: string;
  iosTarget: string | null;
  iosBuild: string | null;
}
