
import { IDBPDatabase, openDB } from 'idb';

export const indexDatabase = (storeName, itemArray) => {
    const dbName = "POSDB";

    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
        // Handle errors.
        console.log("IndexDB Not created")
    };
    request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create an objectStore to hold information about our customers. We're
        // going to use "ssn" as our key path because it's guaranteed to be
        // unique - or at least that's what I was told during the kickoff meeting.
        const objectStore = db.createObjectStore(storeName, { keyPath: "WPID" });

        // Create an index to search customers by name. We may have duplicates
        // so we can't use a unique index.
        objectStore.createIndex("products", "WPID", { unique: false });

        // // Create an index to search customers by email. We want to ensure that
        // // no two customers have the same email, so use a unique index.
        // objectStore.createIndex("email", "email", { unique: true });

        // Use transaction oncomplete to make sure the objectStore creation is
        // finished before adding data into it.
        objectStore.transaction.oncomplete = (event) => {
            // Store values in the newly created objectStore.
            const customerObjectStore = db.transaction(storeName, "readwrite").objectStore(storeName);
            itemArray.forEach((item) => {
                customerObjectStore.add(item);
            });
        };
    };
}
//export default indexDatabase