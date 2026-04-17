import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./components/Dashboard";
import { ShelfMonitor } from "./components/ShelfMonitor";
import { Alerts } from "./components/Alerts";
import { Orders } from "./components/Orders";
import { Reports } from "./components/Reports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "shelves", Component: ShelfMonitor },
      { path: "alerts", Component: Alerts },
      { path: "orders", Component: Orders },
      { path: "reports", Component: Reports },
    ],
  },
]);
