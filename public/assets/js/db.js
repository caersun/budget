let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onerror = (event) => {
    console.log("there was an arror", event.target.errorCode);
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("hello from onsucess!");
    console.log("db", db);

    // check if online
    if (navigator.onLine) {
        console.log("we're online!");
        checkDb;
    }
};

function checkDb() {
    // on a transaction on pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // access your pending object store
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            console.log("I'm a fetch in db.js");
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: { 
                    Accept: "application/json, text/plain, */*", // TODO: ????
                    "Content Type": "application/json"
                }
            }).then((response) => response.json())
            .then(() => {
                // if successful, open a transaction on your pending db
                const transaction = db.transaction(["pending"], "readwrite");
                // access your pending object store
                const store = transaction.objectStore("pending");
                // clear all items from the store
                store.clear();
            });
        };
    }
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    store.add(record);
};

// listen for app to come back online
window.addEventListener("online", checkDb);

module.exports = { saveRecord };