import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChatRoom } from '../model/chat-room';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Page } from '../../../shared/model/page.mode';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {

  constructor(private httpClient : HttpClient) { }

  getChatRooms(id: number, page:number) : Observable<
    {
      chatRooms : ChatRoom[],
      totalChats: number,
      totalPages: number
    }
  >{
    let params = new HttpParams()
    params = params.set("page", page)
    return this.httpClient.get<Page<ChatRoom>>(environment.apiHost + "/api/chats/" + id, {params:params})
    .pipe(
      map((page)=>({
        chatRooms : page.content,
        totalChats : page.totalElements,
        totalPages : page.totalPages
      }))
    )
  }
}
