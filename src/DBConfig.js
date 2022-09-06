export const DBConfig = {
  name: "MyDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "products",
      storeConfig: { keyPath: "WPID" },
      storeSchema: [
        //   { name: "WPID", keypath: "WPID", options: { unique: false } },
        //   { name: "fullname", keypath: "fullname", options: { unique: false } },
        //   { name: "age", keypath: "age", options: { unique: false } }
      ]
    },
    {
      store: "customers",
      storeConfig: { keyPath: "WPId" },
      storeSchema: [
        //   { name: "WPID", keypath: "WPID", options: { unique: false } },
        //   { name: "fullname", keypath: "fullname", options: { unique: false } },
        //   { name: "age", keypath: "age", options: { unique: false } }
      ]
    },
    {
      store: "modifiers",
      storeConfig: { keyPath: "Id" },
      storeSchema: [
        //   { name: "WPID", keypath: "WPID", options: { unique: false } },
        //   { name: "fullname", keypath: "fullname", options: { unique: false } },
        //   { name: "age", keypath: "age", options: { unique: false } }
      ]
    }
  ]
};
