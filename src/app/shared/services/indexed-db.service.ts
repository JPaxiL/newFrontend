import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'blobDB';
  private storeName = 'multimediaStore';
  private db!: IDBDatabase;
  public isReady = false;
  public completed:EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const openDBRequest = indexedDB.open(this.dbName, 1);

    openDBRequest.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      if (!this.db.objectStoreNames.contains(this.storeName)) {
        this.db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
      }
      this.isReady = true;
      this.completed.emit();
    };

    openDBRequest.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.isReady = true;
      this.completed.emit();
    };
  }

  public saveBlob(arrayBuffer: ArrayBuffer, type: string): Observable<any> {
    return new Observable(observer => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const blobData = {
        data: arrayBuffer,
        type: type,
        timestamp: new Date().getTime()
      };
      console.log("STORING BLOB: ", blobData);
      const request = store.add(blobData);
      console.log("STORING result: ", request);
      request.onsuccess = () => {
        observer.next(request.result);
        observer.complete();
      };

      request.onerror = (error) => {
        observer.error(error);
      };
    });
  }

  public getBlob(id: string): Observable<Blob> {
    console.log("GETBLOB ID:", id);
    
    return new Observable(observer => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = (event: any) => {
        const blobData = event.target.result;
        if (blobData) {
          const blob = new Blob([blobData.data], { type: blobData.type });
          console.log("BLOB RETRIVED: ", blob);
          
          observer.next(blob);
          observer.complete();
        } else {
          observer.error('Blob not found');
        }
      };

      getRequest.onerror = (error) => {
        observer.error(error);
      };
    });
  }

  public deleteBlob(id: string): Observable<void>{
    return new Observable<void>( observer => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = () => {
        observer.next();
        observer.complete();
      }

      deleteRequest.onerror = (error) => {
        observer.error("Error al eliminar el elemento de IndexedDB: " + error)
      }
    });
  }
}
