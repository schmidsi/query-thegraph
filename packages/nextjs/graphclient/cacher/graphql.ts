import { INTROSPECTION_QUERY } from "./introspection-query";
import { normalizeOperation } from "@graphql-hive/core";
import { Plugin } from "graphql-yoga";

// import { NextApiRequest } from "next";

export const skipValidate: Plugin = {
  onValidate({ setResult }) {
    setResult([]);
  },
};

export const remoteExecutor: Plugin<{
  // env: Env;
  // analytics: Analytics;
  // logger: Logger;
  endpoint: string;
}> = {
  async onExecute({ args, setResultAndStopExecution }) {
    // const store = cacheStore(args.contextValue.env, GLOBAL_CACHE_TTL_SECONDS);
    // const request = args.contextValue.request;

    const endpoint = args.contextValue.endpoint;

    // console.log(request);

    // console.log(request.path);
    // const result = urlPattern.exec(request.url);
    // const logger = args.contextValue.logger;
    // const { type, identifier, name } = result?.pathname.groups ?? {};
    // logger.mdcSet("type", type);
    // logger.mdcSet("identifier", identifier);
    // logger.mdcSet("name", name);

    // if (!type || !identifier || !name) {
    //   logger.error("Invalid subgraph URL");
    //   throw new Error("Invalid subgraph URL");
    // }

    // const parsedType = subgraphServiceType.safeParse(type);

    // if (!parsedType.success) {
    //   logger.error("Unsupported subgraph service type");
    //   throw new Error("Unsupported subgraph service type");
    // }
    // const serviceType = parsedType.data;

    // const endpoint = (() => {
    //   switch (serviceType) {
    //     case "gateway":
    //       return getGatewayUrl({
    //         apiKey: identifier,
    //         subgraphId: name,
    //       });
    //     case "gateway-arbitrum":
    //       return getArbitrumGatewayUrl({
    //         apiKey: identifier,
    //         subgraphId: name,
    //       });
    //     case "hosted":
    //       return getHostedServiceUrl({
    //         username: identifier,
    //         subgraphName: name,
    //       });
    //     case "studio":
    //       return getStudioUrl({
    //         studioUserNumber: identifier,
    //         subgraphName: name,
    //       });

    //     default:
    //       return null;
    //   }
    // })();

    // if (!endpoint) {
    //   logger.error("Unable to find service URL");
    //   throw new Error("Unable to find service URL");
    // }

    /**
     * `graph-node` has an outdated version of introspection query.
     * We need to get https://github.com/graphprotocol/graph-node/pull/4676 resolved
     * But until then we can hijack the introspection query and use the old version.
     */
    let normalizedOp;
    if (args.operationName === "IntrospectionQuery") {
      // logger.info("Overriding introspection query");
      normalizedOp = INTROSPECTION_QUERY;
    } else {
      normalizedOp = normalizeOperation({
        document: args.document,
        operationName: args.operationName,
        removeAliases: false,
        hideLiterals: true,
      });
    }

    const variables = args.variableValues;
    // const cacheKey = await createHashKey({
    //   normalizedOp,
    //   type: serviceType,
    //   name,
    //   identifier,
    //   variables: JSON.stringify(variables),
    // });
    // console.log("cacher key", cacheKey);
    // logger.mdcSet("cacheKey", cacheKey);

    // const cachedData = await store.get(cacheKey);

    // if (cachedData) {
    //   logger.info("Cache hit");
    //   args.contextValue.analytics.track({
    //     type: "key-usage",
    //     value: {
    //       type: "cache-hit",
    //       key: cacheKey,
    //       operationName: args.operationName,
    //       service: serviceType,
    //       name,
    //       identifier,
    //       country: request?.cf?.country || null,
    //       city: request?.cf?.city || null,
    //       latitude: request?.cf?.latitude || null,
    //       longitude: request?.cf?.longitude || null,
    //       version: "v1",
    //     },
    //   });
    //   return setResultAndStopExecution(
    //     cachedData.data as any, // I trust me.
    //   );
    // }

    const payload = JSON.stringify({
      query: normalizedOp,
      variables,
    });
    // logger.info(`Cache miss - ${payload}`);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });
    const data = await res.json();

    // await store.set(cacheKey, {
    //   endpoint,
    //   operation: normalizedOp,
    //   data,
    //   variables,
    // });

    // args.contextValue.analytics.track({
    //   type: "key-usage",
    //   value: {
    //     type: "cache-write",
    //     key: cacheKey,
    //     operationName: args.operationName,
    //     service: serviceType,
    //     name,
    //     identifier,
    //     country: request?.cf?.country || null,
    //     city: request?.cf?.city || null,
    //     latitude: request?.cf?.latitude || null,
    //     longitude: request?.cf?.longitude || null,
    //     version: "v1",
    //   },
    // });

    return setResultAndStopExecution(data);
  },
};
