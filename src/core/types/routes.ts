export type RoutePath = string[];

export type RouteGuard = (params: Record<string, string>) => Promise<boolean | any>;

export type Route = {
  path: string;
  page?: (params: Record<string, string>) => any;
  header?: boolean;
  footer?: boolean;
  guard?: RouteGuard;
  children?: Route[];
};
