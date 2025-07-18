// tests/get-salesforce-objects.spec

import test from "@playwright/test";
import { Playforce } from "playforce";

test.describe('Generate Salesforce Object Typed Definition & API files', () => {
  test('Generate Salesforce Object Typed Definition & API files', async ({}, testInfo) => {

    const objects = [
      'Account',
      'Case',
      'Contact',

    ];  

    //This will generate your typed defintion files and APIs in /requests/
    await Playforce.generateSalesforceObjects(objects, testInfo.config.rootDir)
    
  });
});