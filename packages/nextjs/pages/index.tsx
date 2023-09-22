import { useEffect, useState } from "react";
import { ExecutionResult } from "graphql";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { SubgraphsDocument, SubgraphsQuery, execute } from "~~/.graphclient";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const [result, setResult] = useState<ExecutionResult<SubgraphsQuery>>();

  useEffect(() => {
    execute(SubgraphsDocument, {}).then(result => {
      setResult(result);
      console.log(result);
    });
  }, []);

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Query The Graph</span>
          </h1>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Deployer</th>
                    <th>Curation ⬇</th>
                  </tr>
                </thead>
                <tbody>
                  {result?.data?.crossSubgraphs?.map(subgraph => (
                    <tr key={subgraph.id}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={subgraph.image || ""} alt="Logo" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{subgraph.displayName}</div>
                            <div className="text-xs opacity-50">
                              <span className="badge badge-ghost badge-sm">{subgraph.deployedChain}</span>{" "}
                              {subgraph.currentVersion?.label}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Address address={subgraph.creatorAddress} disableAddressLink={true} size="sm" />
                        {/* <div className="text-xs font-mono opacity-50">{subgraph.creatorAddress}</div> */}

                        {subgraph.categories.map(category => (
                          <span key={category.category.id} className="badge badge-ghost badge-sm">
                            {category.category.id}
                          </span>
                        ))}
                      </td>
                      <td className="font-mono text-right">
                        {formatEther(subgraph.currentSignalledTokens).split(".")[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* foot */}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
