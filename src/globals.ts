export const uxp = require("uxp") as typeof import("uxp");
const hostName = uxp && uxp?.host?.name?.toLowerCase();

export const premierepro = (
  hostName === "premierepro" ? require("premierepro") : {}
) as any;
