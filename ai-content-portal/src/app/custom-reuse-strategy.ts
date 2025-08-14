import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

/**
 * CustomReuseStrategy disables route reuse for most components,
 * and ensures clean reloads especially when navigating back from results or editor pages.
 */
export class CustomReuseStrategy implements RouteReuseStrategy {
  
  /**
   * Determines if the route should be stored (detached) in memory.
   * Always returns false — no route is detached.
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /**
   * Stores the detached route handle.
   * Not used since we never detach routes.
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}

  /**
   * Determines if the route should be reattached from cache.
   * Always returns false — routes are not reused from cache.
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /**
   * Retrieves the stored route if it was cached.
   * Always returns null — no routes are stored.
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  /**
   * Determines if a route should be reused.
   * Reuses only if route config is the same AND not returning from results/editor.
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Only reuse if navigating to the same route and not returning from results
    return future.routeConfig === curr.routeConfig && !history.state?.returnToResults;
  }
}
