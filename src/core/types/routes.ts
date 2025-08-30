export type RoutePath = string[];

export type Route = {
  path: string;
  page?: (params: Record<string, string>) => any;
  header?: boolean;
  footer?: boolean;
  guard?: (params: Record<string, string>) => Promise<boolean | any>;
  children?: Route[];
};
