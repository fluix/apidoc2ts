export const JsonSchemaDefaultValues: Array<string> =
    ["null", "boolean", "object", "array", "number", "string", "integer"];

export interface JsonSchema {
    $id?: string;
    $schema?: string;
    $ref?: string;
    $comment?: string;
    title?: string;
    description?: string;
    type?: string;
    enum?: Array<any>;
    required?: Array<string> | boolean;
    properties?: Record<string, JsonSchema>;
    definitions?: Record<string, JsonSchema>;
    items?: Array<any> | JsonSchema;
    readOnly?: boolean;
    examples?: Array<any>;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    additionalItems?: JsonSchema;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    contains?: JsonSchema;
    maxProperties?: number;
    minProperties?: number;
    additionalProperties?: JsonSchema;
    patternProperties?: Record<string, JsonSchema>;
    dependencies?: Record<string, JsonSchema>;
    propertyNames?: JsonSchema;
    format?: string;
    contentMediaType?: string;
    contentEncoding?: string;
    if?: JsonSchema;
    then?: JsonSchema;
    else?: JsonSchema;
    allOf?: Array<JsonSchema>;
    anyOf?: Array<JsonSchema>;
    oneOf?: Array<JsonSchema>;
    not?: JsonSchema;
}
