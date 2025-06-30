
export interface Tag {
  tagId: number;//pk
  tagName: string;
  dateAdded?: Date;
  isAlreadyScanned:boolean;
}
