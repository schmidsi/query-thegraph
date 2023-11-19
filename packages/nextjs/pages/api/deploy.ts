import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.headers); // Log all request headers
  console.log(req.body);

  res.status(200).json({ message: "Request headers logged successfully" });
}
