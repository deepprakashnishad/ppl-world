import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyIpcService {
  constructor(
  ) {
    
    
  }

  async invokeIPC(channelName, ...args) {
    // var reply = await this._electronService.ipcRenderer.invoke(channelName, ...args);
    // return reply;
  }
}
