export interface IApiDocEndpoint {
    group?: string;
    name?: string;
    version?: string;
    type?: string;
    url?: string;
    title?: string;
    description?: string;
    groupDescription?: Array<string>;
    filename?: string;
    permission?: Array<IApiDocPermission>;
    parameter?: Array<IApiDocParameter>;
    success?: Array<IApiDocSuccess>;
    error?: Array<IApiDocError>;
    header?: Array<IApiDocHeader>;
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
    type: string;
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
