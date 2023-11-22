import { useEffect, useState } from "react";
import Link from "next/link";
import { ExecutionResult } from "graphql";
import type { GetServerSideProps, NextPage } from "next";
import { formatEther } from "viem";
import { SubgraphsDocument, SubgraphsQuery, execute } from "~~/.graphclient";
import LoginButton from "~~/components/LoginButton";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address } from "~~/components/scaffold-eth";
import prisma from "~~/utils/prisma";

const Home: NextPage<{ users: any }> = ({ users }) => {
  const [result, setResult] = useState<ExecutionResult<SubgraphsQuery>>();

  console.log(users);

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
            <LoginButton />
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
                    <tr key={subgraph.deployedChain + ":" + subgraph.id} className="hover">
                      <td className="max-w-sm overflow-hidden">
                        <Link href={`subgraph/${subgraph.deployedChain + ":" + subgraph.id}`}>
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
                        </Link>
                      </td>
                      <td className="max-w-sm overflow-hidden">
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

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany();
  return {
    props: { users },
  };
};

export default Home;
