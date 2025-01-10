import type {
  MaybeAsyncFn,
  Optional,
  NonNullish,
  NullishPrimitives,
  NonOptional,
} from "../types";
import {
  isString,
  isUndefined,
  isFunction,
} from "../functions/predicate.functions";

type FakeRequestInit = NonNullish<Parameters<typeof fetch>[1]>;
type FakeRequestInfo = Parameters<typeof fetch>[0];

type FakeFetchResponseInit = Pick<FakeRequestInit, "headers"> &
  Pick<
    Response,
    "ok" | "redirected" | "status" | "statusText" | "url" | "type"
  >;

type FakeFetchBody = NonOptional<
  Record<string, unknown> | unknown[] | NullishPrimitives
>;

type FakeFetchBodyFn = MaybeAsyncFn<[], FakeFetchBody>;

const defaultFakeFetchOptions: FakeFetchResponseInit = {
  headers: {
    "Content-Type": "application/json",
  },
  ok: true,
  redirected: false,
  status: 200,
  statusText: "OK",
  url: "https://fakefetch.co",
  type: "default",
};

/**
 * Create a fake fetch function with customizable response and options.
 *
 * @param {FakeFetchBodyFn | FakeFetchBody} responseBody - the response body or a function to generate it
 * @param {FakeFetchResponseInit} options - the options for the fake fetch function
 * @return {Promise<typeof fetch>} a promise that resolves to a fake fetch function
 */
export const fakeFetchFactory = async (
  responseBody?: FakeFetchBodyFn | FakeFetchBody,
  options: FakeFetchResponseInit = defaultFakeFetchOptions
): Promise<typeof fetch> => {
  // assign given options to default options
  const {
    headers: givenHeaders,
    url: _url,
    ...responseData
  } = Object.assign({}, defaultFakeFetchOptions, options);
  // build response object according to fn param
  const object = isFunction(responseBody) ? await responseBody() : responseBody;
  // define fake response methods
  // TODO: generate accurate formData, arrayBuffer & blob
  const text = async () =>
    isUndefined(object) ? String(object) : JSON.stringify(object);
  const json = async () =>
    isUndefined(object) ? undefined : await JSON.parse(await text());
  const formData = async () => new FormData();
  const arrayBuffer = async () => new ArrayBuffer(0);
  const bytes = async () => new Uint8Array(0);
  const blob = async () => new Blob();
  // define fake response properties
  const headers = new Headers(givenHeaders);
  const bodyUsed = !!object;
  // build static response data
  const responseBase: Omit<Response, "clone" | "url" | "bytes"> = {
    ...responseData,
    json,
    text,
    formData,
    arrayBuffer,
    blob,
    bodyUsed,
    headers,
    // TODO: create correct body readableStream
    body: null,
  };
  // return actual fake fetch function
  return async (
    requestInfo: FakeRequestInfo,
    _requestInit?: Optional<FakeRequestInit>
  ): Promise<Response> => {
    // use default url if none is provided when fn is called
    const url = isString(requestInfo)
      ? requestInfo
      : defaultFakeFetchOptions.url;
    // define response clone method
    const clone = () => ({
      ...responseBase,
      url,
      clone,
      bytes,
    });
    // define fake response
    const response: Response = {
      ...responseBase,
      url,
      clone,
      bytes,
    };
    // actually return fake response
    return response;
  };
};
