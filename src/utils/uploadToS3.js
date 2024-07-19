import axios from "axios";
import api from "./api";

//presigned URL
const getPresignedUrl = async (fileInfo) => 
{
  try 
  {
    const user=JSON.parse(localStorage.getItem("user"));
    const authToken=user.authToken;

    const response = await api.post(`/services/presigned-url`, fileInfo,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      }
    });

    return response.data.data;
  } 
  catch(error) 
  {
    console.error("Error getting presigned URL", error);
    return null;
  }
};

//PUT request
export const uploadToS3 = async ({file,fileType,featureName,filePath}) => 
{
  if (!file) return '';

  // console.log(file);

  const presignedUrlResponse = await getPresignedUrl({
    file: file.name,
    fileType: fileType,
    featureName: featureName,
    filePath: filePath,
    bucketName: "ASSETS",
    isPublic: false,
  });

  if (!presignedUrlResponse) return '';

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
    return objectUrl;
  } 
  catch(error) 
  {
    console.log(error);
    console.error("Error uploading file to S3", error);
    return '';
  }
};