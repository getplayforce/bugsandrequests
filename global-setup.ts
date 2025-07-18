// global-setup.ts - Connects to Salesforce and gets an Access Token
import { FullConfig } from "@playwright/test";
import { getSalesforceToken } from "playforce";

export default async function globalSetup(config: FullConfig) {
  await getSalesforceToken();  
}