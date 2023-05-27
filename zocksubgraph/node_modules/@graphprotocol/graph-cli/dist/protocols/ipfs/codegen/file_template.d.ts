import immutable from 'immutable';
import * as tsCodegen from '../../../codegen/typescript';
export default class IpfsFileTemplateCodeGen {
    private template;
    constructor(template: immutable.Map<any, any>);
    generateModuleImports(): never[];
    generateCreateMethod(): tsCodegen.StaticMethod;
    generateCreateWithContextMethod(): tsCodegen.StaticMethod;
}
