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
    parameter?: IApiDocEndpointPart;
    success?: IApiDocEndpointPart;
    error?: IApiDocEndpointPart;
    header?: IApiDocEndpointPart;
    examples?: Array<IApiDocExample>;
    sampleRequest?: Array<IApiDocSampleRequest>;
}

export interface IApiDocEndpointPart {
    fields?: Record<string, Array<IApiDocField>>;
    examples?: Array<IApiDocExample>;
}

export interface IApiDocEndpointPartWithFields extends IApiDocEndpointPart {
    fields: Record<string, Array<IApiDocField>>;
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
