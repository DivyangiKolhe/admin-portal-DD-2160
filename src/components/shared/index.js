import axios from "axios";
import api from "../../utils/api";
// import cheerio from "cheerio";

export const stripHtmlTags=(html) => {
  return html.replace(/<[^>]*>/g, '');
}

//S3 Upload Presigned URL
const getPresignedUrl = async (fileInfo) => 
{
  try 
  {
    const user=JSON.parse(localStorage.getItem("user"));
    const authToken=user.authToken;

    const response = await api.post("/presigned-url-new", fileInfo,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      }
    });
    // console.log(response);

    return response.data.data;
  } 
  catch(error) 
  {
    console.error("Error getting presigned URL", error);
    return null;
  }
};

//S3 Upload PUT request
export const uploadToS3 = async (file) => 
{
  if (!file) return;

  // console.log(file);

  const presignedUrlResponse = await getPresignedUrl({
    file: file.name,
    fileType: "image",
    featureName: "meditation-routine",
    bucketName: "assets",
    isPublic: false,
  });

  if (!presignedUrlResponse) return;

  const { presignedUrl, objectUrl } = presignedUrlResponse;

  try 
  {
    const user=JSON.parse(localStorage.getItem("user"));
    const authToken=user.authToken;

    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type
      },
    });

    console.log(objectUrl);

    return objectUrl;
  } 
  catch(error) 
  {
    console.log(error);
    console.error("Error uploading file to S3", error);
    return '';
  }
};

// export const addTailwindToText = (editedBlogText) => {
//   // Create a cheerio object from the editedBlogText string
//   const cheerioObject = cheerio.load(editedBlogText);

//   // Add the h1 class to all h1 tags
//   cheerioObject("h1").addClass("h1 text-2xl");

//   // Add the h2 class to all h2 tags
//   cheerioObject("h2").addClass("h2 text-lg");

//   // Add the h3 class to all h3 tags
//   cheerioObject("h3").addClass("h3 text-base");

//   // Get the edited HTML string from the cheerio object
//   const editedBlogTextChanged = cheerioObject.html();

//   return editedBlogTextChanged;
// };

// export const extractText = (text) => {
//   const cheerioObject = cheerio.load(text);

//   // Get all text nodes from the cheerio object
//   const textNodes = cheerioObject
//     .root()
//     .contents()
//     .filter((node) => node.type === "text");
//   // Extract the normal text from the text nodes
//   const normalText = textNodes
//     .map((textNode) => textNode.text().trim())
//     .filter((text) => text !== "");

//   // console.log(normalText);

//   // Slice the normal text up to 65 characters
//   const slicedNormalText = normalText.map((text) => text.slice(0, 75));

//   return slicedNormalText;
// };
