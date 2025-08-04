import { UserRole } from "../../../infrastructure/auth/model/user-role.model";

export interface ChatRoom{
    id: number;
    chatId:string;
    sender: {id:number, firstName:String, lastName:String,profilePictureUrl:String, userRole:UserRole},
    receiver: {id:number, firstName:String, lastName:String,profilePictureUrl:String, userRole:UserRole},
}