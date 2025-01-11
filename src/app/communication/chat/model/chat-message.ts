import { UserRole } from "../../../infrastructure/auth/model/user-role.model";

export interface ChatMessage{
    id:String,
    chatId: String,
    sender: {id:number, firstName:String, lastName:String,profilePictureUrl:String, userRole:UserRole},
    receiver: {id:number, firstName:String, lastName:String,profilePictureUrl:String, userRole:UserRole},
    content: string,
    timestamp: Date
}