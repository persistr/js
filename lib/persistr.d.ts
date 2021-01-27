export class Persistr {
  constructor();
  connect(options?: { environment?: string, credentials?: { apikey: string } | { email: string, password: string }, server?: string }): Promise<Persistr.Account>;
}

declare namespace Persistr {
  export interface Account {
    db(name: string): Database;
    database(name: string): Database;
    dbs(): Databases;
    databases(): Databases;
  }

  export interface Annotation {
    destroy(): Promise<void>;
    read(): Promise<any>;
  }

  export interface Database {
    create(): Promise<Database>;
    clone(to: string): Promise<void>;
    destroy(): Promise<void>;
    rename(to: string): Promise<Database>;
    grant(access: { role: string, email: string }): Promise<Database>;
    revoke(access: { role: string, email: string }): Promise<Database>;
    namespace(name: string): Namespace;
    namespaces(): Namespaces;
  }

  export interface Databases {
    each(callback: (db: string) => void): Promise<void>;
    all(): Promise<string[]>;
  }

  export interface Event {
    destroy(): Promise<void>;
    read(): Promise<any>;
  }

  type EventObject = {
      data: any,
      meta?: any
  }

  export interface Events {
    each(callback: (event: EventObject, subscription?: Subscription) => void): Promise<void>;
    write(events: string | EventObject | Array<EventObject>, data?: any): Promise<number>;
  }

  export interface Namespace {
    create(): Promise<Namespace>;
    destroy(): Promise<void>;
    truncate(): Promise<void>;
    rename(to: string): Promise<Namespace>;
    stream(name: string): Stream;
    streams(): Streams;
    events(options?: string | { types?: string | string[], from?: string, to?: string, after?: string, until?: string, limit?: number }): Events;
  }

  export interface Namespaces {
    each(callback: (ns: string) => void): Promise<void>;
  }

  export interface Stream {
    annotate(annotation: any): Promise<void>;
    annotation(): Annotation;
    event(id: string): Event;
    events(options?: string | { types?: string | string[], from?: string, to?: string, after?: string, until?: string, limit?: number }): Events;
    destroy(): Promise<void>;
  }

  export interface Streams {
    stream(name: string): Stream;
    each(callback: (stream: Stream) => void): Promise<void>;
  }

  export interface Subscription {
    cancel(): Promise<void>;
  }
}

export declare var persistr: Persistr;
