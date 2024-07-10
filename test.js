import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "http://192.168.163.152:9200",
});

client
  .ping()
  .then(() => {
    console.log("ping successful");
  })
  .catch((err) => {
    console.log("Error pinging", err);
  });

// client.indices.create({
//   index: "lokendratest",
// });

// client.indices.put_settings({
//   index: "lokendratest",
//   body: {
//     settings: {
//       max_ngram_diff: 19,
//       analysis: {
//         filter: {
//           autocomplete_filter: {
//             type: "ngram",
//             min_gram: "1",
//             max_gram: "20",
//           },
//         },
//         analyzer: {
//           autocomplete: {
//             filter: ["lowercase", "autocomplete_filter"],
//             type: "custom",
//             tokenizer: "standard",
//           },
//         },
//       },
//       number_of_replicas: "1",
//     },
//   },
// });

// const searchProperty = {
//   type: "text",
//   analyzer: "autocomplete",
//   search_analyzer: "standard",
// };

// client.indices.putMapping({
//   index: "lokendratest",
//   body: {
//     properties: {
//       id: { type: "keyword" },
//       createdAt: { type: "date" },
//       updatedAt: { type: "date" },
//       name: searchProperty,
//       email: searchProperty,
//       image: { type: "keyword" },
//       active: { type: "keyword" },
//     },
//   },
// });

// client.index({
//   index: "lokendrausers",
//   type: "_doc",
//   id: "112121",
//   body: {
//     name: "Test user",
//     email: "testmail@gmail.com",
//     image: "ncweibcniwebi",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     active: true,
//   },
// });

const result = await client.search({
  index: "lokendrausers",
  body: {
    query: {
      multi_match: {
        query: "test",
        fields: ["name", "email"],
      },
    },
  },
});

console.log(result.body.hits.hits);
