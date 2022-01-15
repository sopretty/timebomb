/**
 * Function which is doing http call for you
 * @param httpRequest object which contains everything you need for your http call
 */
export const httpFetch = <T = {}>(httpRequest: {
  body?: { [key: string]: any };
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  url: string;
  options?: RequestInit;
}): Promise<T> => {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  };

  const concatOptions = httpRequest.options
    ? {
        ...defaultOptions,
        headers: {
          ...defaultOptions.headers,
          ...httpRequest.options.headers,
        },
      }
    : defaultOptions;

  return fetch(httpRequest.url, {
    body: JSON.stringify(httpRequest.body),
    method: httpRequest.method,
    ...concatOptions,
  }).then((response: any) => {
    const contentType = response.headers.get("Content-type");
    if (response.status < 400) {
      if (response.status !== 204) {
        if (contentType && contentType.indexOf("application/json") > -1) {
          return response.json() as Promise<T>;
        }
        return response.text() as Promise<T>;
      } else {
        return Promise.resolve({} as T);
      }
    } else {
      throw new Error(
        response
          ? `${response.status}: ${response.statusText}`
          : "An error occurred"
      );
    }
  });
};
