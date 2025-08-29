import crypto from "crypto";

export function genOtp(len = 6) {
  // numeric OTP
  let out = "";
  for (let i = 0; i < len; i++) out += Math.floor(Math.random() * 10).toString();
  return out;
}

export function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
