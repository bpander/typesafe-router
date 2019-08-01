interface PathParam<T extends string> {
  name: T;
}
type PathPart<T extends string> = string | PathParam<T>;

export const param = <T extends string>(name: T): PathParam<T> => ({ name });

type ParamsOnly<T extends Array<PathPart<string>>> = {
  [K in keyof T]: T[K] extends PathPart<infer U> ? Record<U, string> : {};
};

type Params<T extends Array<PathPart<string>>> = ParamsOnly<T>[number];

export function asString<T extends string[]>(route: T): string;
export function asString<T extends Array<PathPart<string>>>(route: T, params: Params<T>): string;
export function asString<T extends Array<string | PathPart<string>>>(route: T, params?: Params<T>): string {
  const interpolatedRoute = route.map(pathPart => {
    if (typeof pathPart === 'string') {
      return pathPart;
    }
    return (params as any)[pathPart.name];
  });
  return '/' + interpolatedRoute.join('/');
};
