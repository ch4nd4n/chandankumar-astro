---
title: "Issue with Microsoft Azure Functions connecting to CosmosDB"
date: 2021-10-30
tags:
  - JavaScript
  - Azure
---
This one was a pesky annoying issue that ate up a lot of my time. The solution was just deletion of a line.
I couldn't find the exact issue on stackoverflow, but there were some hints. Like generated JSON has issues.

While following Azure Documentation on connecting Azure function with Cosmos DB, I ran into following error.

```log
[2021-10-29T19:05:02.795Z] The 'HttpTrigger1' function is in error: Unable to configure binding 'outputDocument' of type 'cosmosDB'. This may indicate invalid function.json properties. Input string was not in a correct format.
```

The issue was with generated `function.json` file, I had to snip out the following to get it working

```json
    "collectionThroughput": ""
```

So the final node looked something like

```json
{
  "type": "cosmosDB",
  "direction": "out",
  "name": "outputDocument",
  "databaseName": "my-database",
  "collectionName": "my-container",
  "createIfNotExists": false,
  "connectionStringSetting": "CosmosDbConnectionString",
  "partitionKey": "{id}"
}
```

Azure should update the code generation logic or the document https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-output?tabs=javascript
