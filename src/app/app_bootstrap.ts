import "../stylesheets/main.scss";
import { Router } from "./app_router";
import ROUTES from "./app_routes";
import { AppRunner } from "./app_runner";

const appManager = AppRunner.getInstance();
const router = new Router(appManager);

router.setRoutes(ROUTES);
appManager.init(router);
