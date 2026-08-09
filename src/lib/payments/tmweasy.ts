export type TmweasyResponse = {
  status: number | string;
  request_one: number | string;
  msg?: string;
  ref_txid?: string;
  amount?: number | string;
};

export type TmweasyConfig = {
  username: string;
  password: string;
  receiverAccount: string;
  receiverBankCode: string;
};

const TMW_EASY_URL = "https://www.tmweasy.com/api_verify_slip.php";

export function isAcceptedTmweasyVerification(response: Pick<TmweasyResponse, "status" | "request_one">) {
  return Number(response.status) === 1 && Number(response.request_one) === 1;
}

export function getTmweasyConfig(environment = process.env): TmweasyConfig {
  const username = environment.TMW_EASY_USERNAME;
  const password = environment.TMW_EASY_PASSWORD;
  const receiverAccount = environment.TMW_EASY_RECEIVER_ACCOUNT;
  const receiverBankCode = environment.TMW_EASY_RECEIVER_BANK_CODE;
  if (!username || !password || !receiverAccount || !receiverBankCode) {
    throw new Error("TMW_EASY_NOT_CONFIGURED");
  }
  return { username, password, receiverAccount, receiverBankCode };
}

export async function verifyTmweasySlip(input: {
  qrCode: string;
  userId: string;
  clientIp: string;
  config?: TmweasyConfig;
  fetcher?: typeof fetch;
}): Promise<TmweasyResponse> {
  const config = input.config ?? getTmweasyConfig();
  const url = new URL(TMW_EASY_URL);
  url.search = new URLSearchParams({
    username: config.username,
    password: config.password,
    qrcode: input.qrCode,
    focus_no: config.receiverAccount,
    focus_bankcode: config.receiverBankCode,
    ip: input.clientIp,
    ref1: input.userId,
  }).toString();

  const response = await (input.fetcher ?? fetch)(url, { method: "GET", cache: "no-store" });
  if (!response.ok) {
    throw new Error("TMW_EASY_UNAVAILABLE");
  }
  const result = await response.json() as TmweasyResponse;
  await logger.info("payment.tmweasy_verified", {
    userId: input.userId,
    status: result.status,
    requestOne: result.request_one,
    refTxid: result.ref_txid,
    amount: result.amount,
  });
  return result;
}
import { logger } from "../logger.ts";
