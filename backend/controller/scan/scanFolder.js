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

  1. Extract the following keys and structure the output as JSON:
     {
         "title": "Example Document Title",
         "authors": ["Author 1", "Author 2"],
         "department": "Department Name",
         "data": "Concatenated text representing the contents of the document."
     }
  2. The "title" key should contain the document's title. If not present, set it to "null".
  3. The "authors" key should be a list of authors' names. If not present, set it to an empty list.
  4. The "department" key should contain the department name. If not present, set it to "null".
  5. The "data" key should contain the full text of the document, concatenated across multiple pages. Preserve paragraph structure as much as possible. If no text is found, set it to "null".
  6. Do not add any additional metadata (e.g., file_name, session_id) to the output.
  7. Ensure compliance with privacy regulations when handling the data.
  8. Do not interpolate, guess, or generate data; extract only what is present in the images.
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract data from this research paper image.' },
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
    throw error;
  }
}

// Route to upload a folder and process its contents
 exports.scanFolder = catchAsync(async (req, res, next) => {

  // create the session id
  const sessionUuid = crypto.randomUUID();
  const files = req.files;
  if (!files || files.length === 0) {
    return next(new APIError('There is no file', StatusCodes.NOT_FOUND)); 
  }

  const extractedDataList = [];

  for (const file of files.files) {

    const sessionFolder = path.join(__dirname, 'uploads', sessionUuid);

    console.log(sessionFolder)

    if (!fs.existsSync(sessionFolder)) {
      fs.mkdirSync(sessionFolder, { recursive: true });
    }

    const filePath = path.join(sessionFolder, file.filename);
    fs.renameSync(file.path, filePath);

    // Step 1: Optimize the image
    const optimizedImagePath = await optimizeImage(filePath);

    if (optimizedImagePath) {
      // Step 2: Convert optimized image to base64
      const base64Image = encodeImageToBase64(optimizedImagePath);

      if (base64Image) {
        // Step 3: Extract data from the research paper using OpenAI API
        try {
          const extractedData = await extractResearchPaperData(base64Image);
          extractedDataList.push(JSON.parse(extractedData));
        } catch (error) {
          return res.status(500).send(`Failed to extract data from file: ${file.originalname}`);
        }
      } else {
        return res.status(500).send(`Failed to encode image: ${file.originalname}`);
      }
    } else {
      return res.status(500).send(`Failed to optimize image: ${file.originalname}`);
    }

  }

  res.status(200).json({
    status: 'success',
    message: 'Data extracted successfully',
    data: extractedDataList,
  });



});

