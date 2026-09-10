import AppLayout from "../app/AppLayout";
import Start from "../screens/Start.jsx";
import Quiz from "../screens/Quiz.jsx";
import Result from "../screens/Result.jsx";
import { PATHS } from "./paths";

/**
 * The route table, kept apart from the router instance so a new screen is one
 * entry here and nothing else changes.
 *
 * Every screen is a child of <AppLayout>, which owns the kiosk chrome: the
 * scaled stage, the quiz state provider, the boot/error message and the idle
 * reset. A screen only renders its own content.
 */
export const routes = [
  {
    path: PATHS.start,
    element: <AppLayout />,
    children: [
      { index: true, element: <Start /> },
      { path: "quiz", element: <Quiz /> },
      { path: "result", element: <Result /> },
      // Any stray URL drops back to the attract screen.
      { path: "*", element: <Start /> },
    ],
  },
];
