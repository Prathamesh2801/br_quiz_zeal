import { createHashRouter } from "react-router-dom";
import { routes } from "./routes";

// Hash routing on purpose: the kiosk runs from a static folder with no web
// server rewrites, so /#/quiz always resolves. A path router would 404 on
// refresh once the machine is offline.
export const router = createHashRouter(routes);
