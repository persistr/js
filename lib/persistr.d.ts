// Type definitions for Persistr 2
// Project: Persistr
// Definitions by: Sasa Djolic <https://www.linkedin.com/in/sasadjolic/>

export class Persistr {
    constructor();
    account({ environment, credentials }: { environment?: string, credentials: { apikey?: string; }}): Promise<Persistr.Account>;
}

declare namespace Persistr {
    export interface Account {
        space(name: string): Space;
        spaces(): Spaces;
    }

    export interface Adapter {
        on(callback: (event: EventObject) => void): Promise<void>;
    }

    export interface Annotation {
        destroy(): Promise<void>;
        export(): Promise<void>;
        read(): Promise<any>;
    }

    export interface Domain {
        create(): Promise<Domain>;
        destroy(): Promise<void>;
        export(): Promise<Domain>;
        truncate(): Promise<void>;
        rename(to: string): Promise<Domain>;
        stream(name: string): Stream;
        streams(): Streams;
        events(options?: { types?: string | string[], from?: string, to?: string, after?: string, until?: string }): Events;
    }

    export interface Domains {
        each(): Promise<void>;
    }

    export interface Event {
        destroy(): Promise<void>;
        export(): Promise<void>;
        read(): Promise<any>;
    }

    type EventObject = {
        data: any,
        meta?: any
    }

    export interface Events {
        each(callback: (event: EventObject, subscription?: Subscription) => void): Promise<void>;
        write(events: EventObject | Array<EventObject>): number;
        via(options: any): Adapter;
    }

    export interface Space {
        create(): Promise<Space>;
        destroy(): Promise<void>;
        export(): Promise<Space>;
        rename(to: string): Promise<Space>;
        domain(name: string): Domain;
        domains(): Domains;
    }

    export interface Spaces {
        each(): Promise<void>;
    }

    export interface Stream {
        annotate(annotation: any): Promise<void>;
        annotation(): Annotation;
        event(id: string): Event;
        events(options?: { types?: string | string[], from?: string, to?: string, after?: string, until?: string }): Events;
        destroy(): Promise<void>;
        export(): Promise<void>;
    }

    export interface Streams {
        each(): Promise<void>;
    }

    export interface Subscription {
        cancel(): Promise<void>;
    }
}

export declare var persistr: Persistr;
