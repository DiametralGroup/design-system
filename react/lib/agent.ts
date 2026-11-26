/* The agent bridge, published as `@diametral/design-system/agent`.
   Re-exported from the same @ui-sdk/react copy the components use: the bridge
   only sees components registered with its own copy of the core. See ADR 0004. */

export { agentTools, createAgent, registerTools } from "@ui-sdk/react/agent"
export type {
  AgentAction,
  AgentChange,
  AgentComponent,
  AgentStep,
  ObservedChange,
} from "@ui-sdk/react/agent"
