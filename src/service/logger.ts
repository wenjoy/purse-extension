import pino from "pino";
const logger = pino({
  browser: {
    asObject: true,
  },
});
export default {
  ...logger,
};
