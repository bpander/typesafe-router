interface PathParam<T extends string> {
  name: T;
}
type PathPart<T extends string> = string | PathParam<T>;
type Route = Array<PathPart<string>>;

export const param = <T extends string>(name: T): PathParam<T> => ({ name });

type ParamsOnly<T extends Route> = {
  [K in keyof T]: T[K] extends PathPart<infer U> ? Record<U, string> : {};
};

type Params<T extends Route> = ParamsOnly<T>[number];

export function asString<T extends string[]>(route: T): string;
export function asString<T extends Route>(route: T, params: Params<T>): string;
export function asString<T extends Array<string | PathPart<string>>>(route: T, params?: Params<T>): string {
  const interpolatedRoute = route.map(pathPart => {
    if (typeof pathPart === 'string') {
      return pathPart;
    }
    return (params as any)[pathPart.name];
  });
  return '/' + interpolatedRoute.join('/');
};

type Branch<T extends Route, TReturnType> = [
  T, (params: Params<T>) => TReturnType,
];

export function branch<T extends string[], TReturnType>(route: T, hit: () => TReturnType): Branch<T, TReturnType>;
export function branch<T extends Route, TReturnType>(route: T, hit: (params: Params<T>) => TReturnType): Branch<T, TReturnType>;
export function branch<T extends (string[] | Route), TReturnType>(route: T, hit: (...args: any[]) => TReturnType) {
  return [ route, hit ];
};

export const match = <T extends Route>(path: string, route: T): ParamsOnly<T> | null => {
  const pathParts = path.split('/').filter(part => part !== '');
  const params = {};
  const matched = route.every((routePart, i) => {
    const part = pathParts[i];
    if (part === undefined) {
      return false;
    }
    if (typeof routePart === 'string') {
      return routePart === part;
    }
    (params as any)[routePart.name] = part;
    return true;
  });
  if (!matched) {
    return null;
  }
  return params as ParamsOnly<T>;
};

export const switchRoute = <TReturnType>(path: string, branches: Branch<Route, TReturnType>[]): TReturnType | null => {
  let result: TReturnType | null = null;
  branches.some(([ route, hit ]) => {
    const matchedParams = match(path, route);
    if (matchedParams) {
      result = hit(matchedParams as any);
      return true;
    }
    return false;
  });
  return result;
};
