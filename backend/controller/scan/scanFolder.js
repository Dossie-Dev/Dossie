const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const base64 = require('base64-img');
const APIError = require('../../utils/apiError');
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../../utils/catchAsync');

require("dotenv").config({
  path: "./../.env"
});


if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set. Please set it in the environment variables.');
}

const upload = multer({ dest: 'uploads/' });

// Function to optimize the image before processing
async function optimizeImage(imagePath) {
  const optimizedPath = `${imagePath}-optimized.jpg`;
  try {
    await sharp(imagePath)
      .jpeg({ quality: 85 })
      .toFile(optimizedPath);
    return optimizedPath;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return null;
  }
}

// Function to encode image to base64
function encodeImageToBase64(imagePath) {
  try {
    return base64.base64Sync(imagePath);
  } catch (error) {
    console.error('Error encoding image to base64:', error);
    return null;
  }
}

// Function to extract research paper data using OpenAI API
async function extractResearchPaperData(base64Image) {
  const systemPrompt = `
  You are an OCR-like data extraction tool that extracts structured research paper data from images.

  1. Extract the following keys and structure the output as JSON for accepting the response Don't add any other text:
     {
         "title": "Example Document Title",
         "authors": ["Author 1", "Author 2"],
         "department": "Department Name",
         "data": "Concatenated text representing the contents of the document."
         "page_number": "Page number"
     }
  2. The "title" key should contain the document's title. If not present, set it to "null".
  3. The "authors" key should be a list of authors' names. If not present, set it to an empty list.
  4. The "department" key should contain the department name. If not present, set it to "null".
  5. The "data" key should contain the full text of the document, concatenated across multiple pages. Preserve paragraph structure as much as possible. If no text is found, set it to "null".
  6. The "page_number" key should contain the page number. If not present, set it to "null".
  7. Do not add any additional metadata (e.g., file_name, session_id) to the output.
  8. Ensure compliance with privacy regulations when handling the data.
  9. Do not interpolate, guess, or generate data; extract only what is present in the images.
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        response_format: {type: 'json_object'},
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'image_url', image_url: { url: `data:image/png;base64,${base64Image}` } },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error extracting data from OpenAI API:', error.response?.data || error.message);
    return null;
  }
}

// Route to upload a folder and process its contents
 exports.scanFolder = catchAsync(async (req, res, next) => {

  // const sessionUuid = crypto.randomUUID();
  const files = [].concat(req.files.files); // Convert files to an array if it's a single file req.files;
  console.log(files)
  if (!files || files.length === 0) {
    return next(new APIError('There is no file', StatusCodes.NOT_FOUND)); 
  }

  const extractedDataList = [];

  for (const file of files) {

    // const sessionFolder = path.join(__dirname, 'uploads', sessionUuid);

    console.log(file);

    // if (!fs.existsSync(sessionFolder)) {
    //   fs.mkdirSync(sessionFolder, { recursive: true });
    // }

    // const filePath = path.join(sessionFolder, file.filename);
    // fs.renameSync(file.path, filePath);

    // Step 1: Optimize the image
    // const optimizedImagePath = await optimizeImage(filePath);

    // if (optimizedImagePath) {
    //   // Step 2: Convert optimized image to base64

    //   const base64Image = encodeImageToBase64(optimizedImagePath);

    // create abase64 image
    const base64Image = file.data.toString('base64');

      if (base64Image) {
        // Step 3: Extract data from the research paper using OpenAI API
          const extractedData = await extractResearchPaperData(base64Image);

          if (!extractedData) {
            return next(new APIError(`Failed to extract data from image: ${file.originalname}`, StatusCodes.BAD_REQUEST));
          }


          


          extractedDataList.push(JSON.parse(extractedData));
      }else{
        return next( new APIError(`Failed to extract data from image: ${file.originalname}`, StatusCodes.BAD_REQUEST));

      }
  }


  return res.status(200).json({
    status: 'success',
    message: 'Data extracted successfully',
    data: extractedDataList,
  });



});

