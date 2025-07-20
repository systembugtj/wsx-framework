// Core exports
export { WebComponent } from "./web-component";
export { autoRegister, registerComponent } from "./auto-register";
export { h, h as jsx, h as jsxs, Fragment } from "./jsx-factory";
export { StyleManager } from "./styles/style-manager";
export { WSXLogger, logger, createLogger } from "./logger";

// Reactive exports
export { reactive, createState, ReactiveDebug } from "./reactive";
export { ReactiveWebComponent, makeReactive, createReactiveComponent } from "./reactive-component";

// Type exports
export type { WebComponentConfig } from "./web-component";
export type { JSXChildren } from "./jsx-factory";
export type { Logger, LogLevel } from "./logger";
export type { ReactiveCallback } from "./reactive";
export type { ReactiveWebComponentConfig } from "./reactive-component";
