import { Injectable, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Message {
  success: boolean;
  message: string;
}

export interface DataMessage<T> extends Message {
  data: T;
}

export interface FlexMessage extends Message {
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  push = new EventEmitter<FlexMessage>();

  fromHTTP(post: Observable<any>, successMessage: string, failureTitle: string, suppressPush?: boolean): Observable<Message> {
    const msg: Message = { success: false, message: '' };

    return post.pipe(
      map(() => {
        msg.success = true;
        msg.message = successMessage;
        if (!suppressPush) {
          this.publish({ ...msg, title: '' });
        }
        return msg;
      }),
      catchError((err: HttpErrorResponse) => {
        msg.message = `${err.error.message} (${err.status})`;
        if (!suppressPush) {
          this.publish({ ...msg, title: failureTitle || 'Database Error' });
        }
        return of(msg);
      })
    );
  }

  getHTTP<T>(get: Observable<T>, failureMessage?: string): Observable<DataMessage<T>> {
    const dataMsg: DataMessage<T> = { success: true, data: null, message: '' };
    const msg: FlexMessage = { success: false, message: '', title: '' };

    return get.pipe(
      map((data: T) => {
        dataMsg.data = data;
        return dataMsg;
      }),
      catchError((err: HttpErrorResponse) => {
        msg.message = failureMessage || err.error.message;
        msg.title = `Error ${err.status}`;
        dataMsg.success = false;
        dataMsg.message = msg.message;
        this.publish(msg);
        return of(dataMsg);
      })
    );
  }

  publish(msg: FlexMessage): void {
    this.push.emit(msg);
  }
}
