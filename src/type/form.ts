export interface FormDataType {
  [key: string]: any;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  team?: string;
  access?: string | boolean;
  photo?: string;
  finishtime?: Date;
  starttime?: Date;
  teamLeaderId?: string;
  teamName?: string;
}
