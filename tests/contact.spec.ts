import test, { expect } from "@playwright/test";
import { Playforce } from "playforce";
import { SalesforceRequests } from '../requests/SalesforceRequests.js';
import { Contact } from "../requests/salesforce/Contact.js";


test('Test Salesforce API Calls via the Contact Object', async ({ page }) => {

  const email = "first.last@example.com";

  const newContactData: Contact = {
    LastName: "Last Name",
    FirstName: "First Name",    
    Email: email
  }

  const updateContactData: Contact = {
    FirstName: "Updated First Name",    
  }

  const invalidUpdateContactData: Contact = {
    Birthdate: "Invaliddate",    
  }

  const invalidContactData: Contact = {
  }



  //CREATE Requests
  //Postives
  let contact = await SalesforceRequests.Contact.createAndGetObject(newContactData)
  console.log(`Created Contact: ${contact.Id} for Email: ${email}`)
  
  //Negatives
  await expect(async () => {
    await SalesforceRequests.Contact.createObject(invalidContactData)
  }, "The Invalid Contact was not expected to be created").rejects.toThrow();


  
  //UPDATE Requests
  //Postives
  await SalesforceRequests.Contact.updateObjectExpectFailure(contact.Id, invalidUpdateContactData)
  contact = await SalesforceRequests.Contact.updateAndGetObject(contact.Id, updateContactData)
  
  //Check the update occured
  expect(updateContactData.FirstName).toBe((await SalesforceRequests.Contact.getObjectById(contact.Id)).FirstName)  

  //Negatives
  await expect(async () => {
    await SalesforceRequests.Contact.updateObject("NOTANEXISTINGID", updateContactData)
  }, "The Invalid Contact was not expected to be updated").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.updateObjectExpectFailure(contact.Id, updateContactData)
  }, "The Contact was not expected to be updated").rejects.toThrow();


  //GET Requests
  //Postives
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getObjectById(contact.Id)).Id)  
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getObjectByField(Contact.Email, email)).Id)  
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getObjectWhenField(Contact.Email, email)).Id)  
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getObjectByWhere(`email = '${email}'`)).Id)  
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getObjectWhenWhere(`email = '${email}'`)).Id)  


  expect(contact.Id).toBe((await SalesforceRequests.Contact.getContactObjectByEmail(email)).Id)                               //Custom Contact Function
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getContactObjectByEmailSOQLQuery(email)).Id)                      //Custom Contact Function
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getContactObjectByEmailSOQLQueryExactlyOneValue(email)).Id)       //Custom Contact Function
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getContactObjectByEmailSOQLQueryExactlyOneValueWait(email)).Id)   //Custom Contact Function
  
  

  
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getThisObjectWhenField(contact, Contact.Email, contact.Email)).Id)  
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getThisObjectWhenFieldNOTNull(contact, Contact.Email)).Id) 
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getThisObjectWhenFieldNull(contact, Contact.Fax)).Id)  
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getThisObjectWhenFieldNOTEqualsValue(contact, Contact.Email, 'notgoingtobefound@example.com')).Id)  
  
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getObjectArrayByField(Contact.Email, contact.Email))[0].Id)
  expect(contact.Id).toBe((await SalesforceRequests.Contact.getObjectArrayByWhere(`email = '${email}'`))[0].Id)

  
  //Negatives
  await expect(async () => {
    await SalesforceRequests.Contact.getObjectById("NOTANEXISTINGID")    
  }, "The Contact was not expected to be found with the invalid ID").rejects.toThrow();


  await expect(async () => {
    await SalesforceRequests.Contact.getObjectByField(Contact.Email, 'A-notgoingtobefound@example.com')    
  }, "The Contact was not expected to be found with the email address being 'A-notgoingtobefound@example.com'").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.getObjectWhenField(Contact.Email, 'B-notgoingtobefound@example.com', 10000)    
  }, "The Contact was not expected to be found with the email address being 'B-notgoingtobefound@example.com'").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.getObjectByWhere(`email = 'notgoingtobefound@example.com'`)    
  }, "The Contact was not expected to be found with the email address being 'notgoingtobefound@example.com'").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.getObjectWhenWhere(`email = 'notgoingtobefound@example.com'`, 10000)    
  }, "The Contact was not expected to be found with the email address being 'notgoingtobefound@example.com'").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.getObjectWhenWhere(`email != null`, 10000)    
  }, "A single Contact object was not expected to be found. Was expecting more'").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.getContactObjectByEmail('notgoingtobefound@example.com')    
  }, "The Contact was not expected to be found with the email address being 'notgoingtobefound@example.com'").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.getContactObjectByEmailSOQLQuery('notgoingtobefound@example.com')    
  }, "The Contact was not expected to be found with the email address being 'notgoingtobefound@example.com'").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.getContactObjectByEmailSOQLQueryExactlyOneValue('notgoingtobefound@example.com')    
  }, "The Contact was not expected to be found with the email address being 'notgoingtobefound@example.com'").rejects.toThrow();


  await expect(async () => {
     await SalesforceRequests.Contact.getThisObjectWhenField(contact, Contact.Email, 'notgoingtobefound@example.com', 10000)    
  }, "The Contact was not expected to be found with the email address being 'notgoingtobefound@example.com'").rejects.toThrow();

  await expect(async () => {
      await SalesforceRequests.Contact.getThisObjectWhenFieldNOTNull(contact, Contact.Fax, 10000)    
  }, "The Contact was not expected to be found with a non-null Fax value").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.getThisObjectWhenFieldNull(contact, Contact.Email, 10000)    
}, "The Contact was not expected to be found with a null Email value").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.getThisObjectWhenFieldNOTEqualsValue(contact, Contact.Email, contact.Email, 10000)    
  }, "The Contact was expected to be not be found with the known email").rejects.toThrow();



  
  //Ensure Object does not exist
  //Postives
  await SalesforceRequests.Contact.ensureNoObjectExistsById("NOTANEXISTINGID")
  await SalesforceRequests.Contact.ensureNoObjectExistsByField(Contact.Email, 'notgoingtobefound@example.com', 10000)
  await SalesforceRequests.Contact.ensureNoObjectExistsByWhere(`email = 'notgoingtobefound@example.com'`, 10000)

  
  //Negatives
  await expect(async () => {
    await SalesforceRequests.Contact.ensureNoObjectExistsById(contact.Id)
  }, "The Contact was not found with with the known ID").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.ensureNoObjectExistsByField(Contact.Email, contact.Email)
  }, "The Contact was not found with with the known email").rejects.toThrow();

  await expect(async () => {
    await SalesforceRequests.Contact.ensureNoObjectExistsByWhere(`email = '${email}'`)
  }, "The Contact was not found with with the known email").rejects.toThrow();


  //DELETE Request
  await SalesforceRequests.Contact.deleteObjectById(contact.Id)

  await expect(async () => {
      await SalesforceRequests.Contact.deleteObjectById("NOTANEXISTINGID");  
  }, "A non-existent Contact was Deleted").rejects.toThrow();

  //Check the delete occured
  await SalesforceRequests.Contact.ensureNoObjectExistsById(contact.Id)


  let contactTwo = await SalesforceRequests.Contact.createAndGetObject(newContactData)
  await SalesforceRequests.Contact.deleteObject(contactTwo)
  await SalesforceRequests.Contact.ensureNoObjectExists(contactTwo)


});
