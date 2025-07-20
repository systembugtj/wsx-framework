// Type declaration for .wsx files
declare module "*.wsx" {
    import { WebComponent } from "@systembug/wsx-core";
    const component: typeof WebComponent;
    export default component;
}
