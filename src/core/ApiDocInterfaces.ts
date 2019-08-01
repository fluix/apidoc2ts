export type ApiDocEndpointPart = IApiDocParameter | IApiDocSuccess | IApiDocError | IApiDocHeader;

export interface IApiDocEndpoint {
    group: string;
    name: string;
    version: string;
    type: string;
    url: string;
    filename: string;
    title?: string;
    description?: string;
    groupDescription?: Array<string>;
    permission?: IApiDocPermission | string;
    parameter?: IApiDocParameter;
    success?: IApiDocSuccess;
    error?: IApiDocError;
    header?: IApiDocHeader;
    examples?: Array<IApiDocExample>;
    sampleRequest?: Array<IApiDocSampleRequest>;
}

export interface IApiDocParameter {
    fields: Record<string, Array<IApiDocField>>;
}

export interface IApiDocSuccess {
    fields: Record<string, Array<IApiDocField>>;
    examples?: Array<IApiDocExample>;
}

export interface IApiDocError {
    fields: Record<string, Array<IApiDocField>>;
    examples?: Array<IApiDocExample>;
}

export interface IApiDocHeader {
    fields: Record<string, Array<IApiDocField>>;
    examples?: Array<IApiDocExample>;
}

export interface IApiDocField {
    group?: string;
    type?: string;
    field: string;
    optional?: boolean;
    allowedValues?: Array<string>;
    defaultValue?: string;
    description?: string;
}

export interface IApiDocExample {
    title: string;
    content: string;
    type?: string;
}

export interface IApiDocPermission {
    name: string;
    title: string;
    description?: string;
}

export interface IApiDocSampleRequest {
    url: string;
}
