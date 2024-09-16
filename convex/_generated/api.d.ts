/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as brackets from "../brackets.js";
import type * as championship from "../championship.js";
import type * as http from "../http.js";
import type * as Keyboard from "../Keyboard.js";
import type * as match from "../match.js";
import type * as matchScore from "../matchScore.js";
import type * as media from "../media.js";
import type * as participants from "../participants.js";
import type * as referee from "../referee.js";
import type * as types from "../types.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  brackets: typeof brackets;
  championship: typeof championship;
  http: typeof http;
  Keyboard: typeof Keyboard;
  match: typeof match;
  matchScore: typeof matchScore;
  media: typeof media;
  participants: typeof participants;
  referee: typeof referee;
  types: typeof types;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
