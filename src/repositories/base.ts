import http from "@utils/api/http";
import { getAuthCredentials } from "@utils/auth-utils";
import { ROUTES } from "@utils/routes";
import axios from "axios"; 
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export default class Base<C, U> {
  private ignoreAuthFailure: boolean;

  constructor(ignoreAuthFailure?: boolean) {
    this.ignoreAuthFailure = !!ignoreAuthFailure;
  }

  http = async <T>(
    url: string,
    type: string,
    variables: T | null = null,
    options?: any,
    localContext?: any
  ) => {
    try {
      const authCredentials = getAuthCredentials(localContext);
      if (authCredentials) {
        options = options ? options : {};
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authCredentials.token}`,
        };
      }

      const isWrite = type == "post" || type == "put" || type == "patch";

      return await (http as any)[type](
        url,
        isWrite ? variables : options,
        isWrite ? options : undefined
      );
    } catch (error: unknown) {
      // on the client side we can redirect here 

      if (!localContext) { 
         
        if (
          axios.isAxiosError(error) &&
          error!.response!.status === 401 &&
          this.ignoreAuthFailure === false
        ) {
          Cookies.remove("AUTH_CRED");
          redirect(ROUTES.LOGIN);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  };

  all = async (url: string) => {
    return this.http(url, "get");
  };

  find = async (url: string, localContext?: any) => {
    return this.http(url, "get", undefined, undefined, localContext);
  };

  create = async (url: string, variables: Partial<C>, options: any = null) => {
    return this.http<Partial<C>>(url, "post", variables, options);
  };

  update = async (url: string, variables: U) => {
    return this.http<U>(url, "put", variables);
  };

  patchUpdate = async (url: string, variables: Partial<U>) => {
    return this.http<Partial<U>>(url, "patch", variables);
  };

  findImage = async (url: string) => {
    const authCredentials = getAuthCredentials();
    const data = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authCredentials && authCredentials.token}`,
        Accept: "application/octet-stream",
      },
      responseType: "blob",
    });
    return data;
  };

  delete = async (url: string) => {
    return this.http(url, "delete");
  };
}
