export function isEndpointPartWithFields(endpointPart?: IApiDocEndpointPart)
    : endpointPart is IApiDocEndpointPartWithFields {
    return Boolean(endpointPart && endpointPart.fields);
}

export function isEndpointPartWithExamples(endpointPart?: IApiDocEndpointPart)
    : endpointPart is IApiDocEndpointPartWithExamples {
    return Boolean(endpointPart && endpointPart.examples);
}

export function endpointHasFields(endpoint: IApiDocEndpoint): boolean {
    return isEndpointPartWithFields(endpoint.parameter)
           || isEndpointPartWithFields(endpoint.success)
           || isEndpointPartWithFields(endpoint.error);
}

export function endpointHasExamples(endpoint: IApiDocEndpoint): boolean {
    return isEndpointPartWithExamples(endpoint.parameter)
           || isEndpointPartWithExamples(endpoint.success)
           || isEndpointPartWithExamples(endpoint.error);
}

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

export interface IApiDocEndpointPartWithExamples extends IApiDocEndpointPart {
    examples: Array<IApiDocExample>;
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
