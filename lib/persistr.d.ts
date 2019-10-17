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

    export interface Annotation {
        destroy(): void;
        export(): void;
        read(): Promise<any>;
    }

    export interface Domain {
        create(): Domain;
        destroy(): void;
        export(): Domain;
        rename(to: string): Domain;
        stream(name: string): Stream;
        streams(): Streams;
        events(options?: { types?: string | string[], from?: string, to?: string, after?: string, until?: string }): Events;
    }

    export interface Domains {
        each(): Promise<void>;
    }

    export interface Event {
        destroy(): void;
        export(): void;
        read(): Promise<any>;
    }

    type EventObject = {
        data: any,
        meta?: any
    }

    export interface Events {
        each(callback: (event: EventObject, subscription?: Subscription) => void): Promise<void>;
        write(events: EventObject | Array<EventObject>): number;
    }

    export interface Space {
        create(): Space;
        destroy(): void;
        export(): Space;
        rename(to: string): Space;
        domain(name: string): Domain;
        domains(): Domains;
    }

    export interface Spaces {
        each(): Promise<void>;
    }

    export interface Stream {
        annotate(annotation: any): void;
        annotation(): Annotation;
        event(id: string): Event;
        events(options?: { types?: string | string[], from?: string, to?: string, after?: string, until?: string }): Events;
        destroy(): void;
        export(): void;
    }

    export interface Streams {
        each(): Promise<void>;
    }

    export interface Subscription {
        cancel(): Promise<void>;
    }
}

export declare var persistr: Persistr;
