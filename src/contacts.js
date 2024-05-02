import * as fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import { error } from "node:console";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  const listContacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(listContacts);
}

export async function getContactById(contactId) {
  if (contactId === undefined) {
    throw new Error("ID is required");
  }

  const allContacts = await listContacts();
  const foundContact = allContacts.find((contact) => contact.id === contactId);

  if (foundContact === undefined) {
    return null;
  }

  return foundContact;
}

export async function removeContact(contactId) {
  if (contactId === undefined) {
    throw new Error("ID is required");
  }

  const allContacts = await listContacts();
  const deleteContactIndex = allContacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (deleteContactIndex === -1) {
    return null;
  }

  try {
    await fs.writeFile(
      contactsPath,
      JSON.stringify(
        [
          ...allContacts.slice(0, deleteContactIndex),
          ...allContacts.slice(deleteContactIndex + 1),
        ],

        undefined,
        2
      )
    );
  } catch (error) {
    throw new Error(error);
  }

  return allContacts[deleteContactIndex];
}

export async function addContact(name, email, phone) {
  if (name === undefined || email === undefined || phone === undefined) {
    throw new Error("all fields are required");
  }
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  const allContacts = await listContacts();

  try {
    await fs.writeFile(
      contactsPath,
      JSON.stringify([...allContacts, newContact], null, 2)
    );
  } catch (error) {
    throw new Error(error);
  }

  return newContact;
}
