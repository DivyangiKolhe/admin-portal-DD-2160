import { ListObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

// const listObjects = async (prefix) => {
//     try {
//         const client = new S3Client({
//             region: import.meta.env.VITE_AWS_REGION,
//             credentials: {
//                 accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//                 secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//             },
//         });

// const command = new ListObjectsCommand({
//     Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
//     Prefix: prefix,
// });

// const { Contents } = await client.send(command);
// setObjects(Contents || []);
// const newTree = buildTree(Contents || []);
// setTree(newTree);
// setCurrentNode(newTree);
//     } catch (error) {
//         console.error('Error fetching objects:', error);
//     }
// };

// const fetchS3Objects = async () => {
//   let prefix = "";

//   try {
//     const client = new S3Client({
//       region: import.meta.env.VITE_AWS_REGION,
//       credentials: {
//         accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//         secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//       },
//     });

//     const command = new ListObjectsCommand({
//       Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
//       Prefix: prefix,
//     });

//     const { Contents } = await client.send(command);
//     console.log(Contents);

//     return Contents || [];
//   } catch (error) {
//     console.error("Error fetching objects:", error);
//   }
// };

const fetchAllS3Objects = async () => {
  const client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });

  let allObjects = [];
  let isTruncated = true;
  let continuationToken = undefined;

  while (isTruncated) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
        ContinuationToken: continuationToken,
      });

      const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);

      allObjects = [...allObjects, ...(Contents || [])];
      isTruncated = IsTruncated;
      continuationToken = NextContinuationToken;
    } catch (error) {
      console.error("Error fetching objects:", error);
      break;
    }
  }

  console.log(allObjects);
  return allObjects;
};

// Function to build the Tree Structure
function buildTree(objects) {
  const root = { key: "/", children: {} };

  objects.forEach((object) => {
    const keys = object.Key.split("/");
    let currentNode = root;

    keys.forEach((key, index) => {
      if (!currentNode.children[key]) {
        currentNode.children[key] = { key, children: {} };
      }
      if (index === keys.length - 1) {
        currentNode.children[key].isFile = true;
        currentNode.children[key].fileData = object;
      }

      currentNode = currentNode.children[key];
    });
  });

  return root;
}

// Function to store the tree structure in localStorage
function storeTreeInLocalStorage(tree) {
  localStorage.setItem("treeData", JSON.stringify(tree));
}

// Function to retrieve the tree structure from localStorage
function getTreeFromLocalStorage() {
  const treeData = localStorage.getItem("treeData");
  return treeData ? JSON.parse(treeData) : null;
}

// Function to get the tree structure
async function getTree() {
  let tree = getTreeFromLocalStorage();
  if (!tree) {
    // const objects = await fetchS3Objects();
    const objects=await fetchAllS3Objects();
    tree = buildTree(objects);
    storeTreeInLocalStorage(tree);
  }
  return tree;
}

export { getTree };
