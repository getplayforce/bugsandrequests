import { createTypedSalesforceObject, Playforce, SalesforceObjectInterface, } from 'playforce';
import { Contact, objectType } from './defs/objects/Contact.def.js';
export { Contact, objectType }; // Export both for use elsewhere

/**
 * Custom business logic methods related to the Contact object.
 */
export const ContactBase = createTypedSalesforceObject<Contact>(objectType);

export function contactMethods(contactBase: SalesforceObjectInterface<Contact>) {
    return {
    
    getContactObjectByEmail: async (email: string): Promise<Contact> => {
        // NOTE: this will be called on the object returned by `createTypedSalesforceObject`
        return await contactBase.getObjectByField(Contact.Email, email);
    },

    getContactObjectByEmailSOQLQuery: async (email: string): Promise<Contact> => {
        const response = await Playforce.SOQL.SOQLQuery(`SELECT Id FROM ${objectType} WHERE Email = '${email}'`);
        if (response.records?.[0]?.Id) {
            return await contactBase.getObjectById(response.records[0].Id);
        }
        throw new Error(`No contact found for email: ${email}`);
    },

    getContactObjectByEmailSOQLQueryExactlyOneValue: async (email: string): Promise<Contact> => {
        const id = await Playforce.SOQL.SOQLQueryExactlyOneValue(`SELECT Id FROM ${objectType} WHERE Email = '${email}'`);
        return await contactBase.getObjectById(id);
    },

    getContactObjectByEmailSOQLQueryExactlyOneValueWait: async (email: string): Promise<Contact> => {
        const id = await Playforce.SOQL.SOQLQueryWhenExactlyOneValue(`SELECT Id FROM ${objectType} WHERE Email = '${email}'`);
        return await contactBase.getObjectById(id);
    },
};
}

