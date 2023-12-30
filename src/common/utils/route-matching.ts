export const routeMatching = (request: any, allowedRoutes: any[]) => {
  const isRouteMatch = allowedRoutes.some((route) => {
    const isPAthMatch = request.route?.path.includes(route.path);
    const isMethodMatch =
      !route.methods || route.methods.includes(request.method);
    return isPAthMatch && isMethodMatch;
  });

  return isRouteMatch;
};
