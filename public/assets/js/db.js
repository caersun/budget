// TODO: should we be checking for indexedDb?
let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onerror = (event) => {
    console.log("there was an arror", event.target.errorCode);
};

request.onsuccess = (event) => {
    db = event.target.result;

    // check if online
    if (navigator.online) {
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
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: { 
                    Accept: "application/json, text/plain, */*", // TODO: ????
                    "Content Type": "application/json"
                }
            }).then((response) => response.json())
            .then(() => {
                console.log("Success!! We did something!!");
                console.log("Should we clear items in store?");

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

// listen for app to come back online
window.addEventListener("online", checkDb);

export function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    store.add(record);
};


// todo need to use indexeddb?
// use function if accessing db
// export function useIndexedDb(databaseName) {
//     return new Promise((resolve, reject) => {
//         const request = window.indexedDB.open(databaseName, 1);
//         let db;
        
//         request.onupgradeneeded = function(event) {
//             db = event.target.result;
//             // console log these bc ???
//             db.createObjectStore("pending", { autoIncrement: true });
//         };

//         request.onerror = function(event) {
//             console.log("There was an error", event.target.errorCode);
//         };

//         request.onsuccess = function(event) {
//             db = event.target.result;

//             // check if online
//             if (navigator.onLine) {
//                 checkDb;
//             }
//         };
//     });
// };