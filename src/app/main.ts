import { AppManager } from "./appManager";
import { Router } from "./router";
import ROUTES from "./routes";
import "../stylesheets/main.scss";

const appManager = AppManager.getInstance();
const router = new Router(appManager);

router.setRoutes(ROUTES);
appManager.init(router);
