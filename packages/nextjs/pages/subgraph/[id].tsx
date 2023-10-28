import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ExecutionResult } from "graphql";
import { NextPage } from "next";
import { SubgraphDetailDocument, SubgraphDetailQuery, execute } from "~~/.graphclient";
import { MetaHeader } from "~~/components/MetaHeader";

const generateURL = (chain: string, id: string) => {
  return `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
    process.env.NEXT_PUBLIC_VERCEL_URL
  }/api/${chain}-${id}/latest`;
};

const SubgraphDetail: NextPage = () => {
  const { query, ...router } = useRouter();
  const [result, setResult] = useState<ExecutionResult<SubgraphDetailQuery>>();

  const [chain, id] = ((query.id as string) || ":").split(":");
  const loading = !chain && !id;

  const subgraph = result?.data?.subgraphDetail;

  // console.log({ chain, id, subgraph });
  console.log(router);

  useEffect(() => {
    if (chain && id) {
      execute(SubgraphDetailDocument, { chain, id }).then(result => {
        setResult(result);
        console.log(result);
      });
    }
  }, [chain, id]);

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <div className="mask mask-squircle w-24 h-24">
              <img src={subgraph?.image || ""} alt="Logo" />
            </div>
            <span className="block text-4xl font-bold">{subgraph?.displayName}</span>
          </h1>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="overflow-x-auto">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <div>
                    Query URL:{" "}
                    <a href={generateURL(chain, id)} target="_blank" rel="noreferrer">
                      <pre>{generateURL(chain, id)}</pre>
                    </a>
                  </div>
                  <iframe src={generateURL(chain, id)} className="w-full" style={{ height: 600 }} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubgraphDetail;
