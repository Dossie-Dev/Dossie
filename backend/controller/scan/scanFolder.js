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
const { ResearchPaper } = require('../../models/research.paper.model');

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


// merge the data extracted from each image
function mergeExtractedData(extractedPages) {
  let mergedData = {
    title: null,
    authors: new Set(), // Use Set to avoid duplicate authors
    department: null,
    data: "", // Concatenated text
  };

  extractedPages.forEach((pageData) => {
    if (!mergedData.title && pageData.title) {
      mergedData.title = pageData.title;
    }

    if (!mergedData.department && pageData.department) {
      mergedData.department = pageData.department;
    }

    if (pageData.authors && pageData.authors.length > 0) {
      pageData.authors.forEach(author => mergedData.authors.add(author));
    }

    if (pageData.data) {
      mergedData.data += pageData.data + "\n\n"; // Maintain paragraph structure
    }
  });

  return {
    title: mergedData.title || "Unknown Title",
    authors: Array.from(mergedData.authors), // Convert Set to Array
    department: mergedData.department || "Unknown Department",
    data: mergedData.data.trim(),
  };
}




// Function to extract research paper data using OpenAI API
async function extractResearchPaperDataBatch(base64Images) {
  const systemPrompt = `
  You are an OCR-like data extraction tool that extracts structured research paper data from images.

  - Extract the following keys and structure the output as a **valid JSON object**. **Do not add any extra text, explanations, or formatting.**
  
  \`\`\`json
  {
    "title": "Example Document Title",
    "authors": ["Author 1", "Author 2"],
    "department": "Department Name",
    "data": "Concatenated text representing the contents of the document."
  }
  \`\`\`

  - If the title is missing, set "title": null.
  - If no authors are found, set "authors": [].
  - If the department is missing, set "department": null.
  - If no text is extracted, set "data": null.
  - **Output only JSON**. Do not add additional metadata, explanations, or any other formatting.
  - Each page may contain different parts of the document, so extract text as accurately as possible.
  `;

  try {
    const apiCalls = base64Images.map((base64Image, index) =>
      axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          response_format: { type: "json_object" },
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: [
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
      ).then(response => ({
        pageIndex: index, // Keep track of order
        extractedData: JSON.parse(response.data.choices[0].message.content),
      }))
    );

    // Process all images in parallel
    const results = await Promise.all(apiCalls);

    // Sort results by pageIndex to maintain correct order
    results.sort((a, b) => a.pageIndex - b.pageIndex);

    // Merge results
    return mergeExtractedData(results.map(r => r.extractedData));

  } catch (error) {
    console.error('Error extracting data from OpenAI API:', error.response?.data || error.message);
    throw error;
  }
}

 exports.scanFolder = catchAsync(async (req, res, next) => {

  // extract the current company id from the request
  const companyId = req.user.company;

  // const sessionUuid = crypto.randomUUID();
  const files = [].concat(req.files.files); // Convert files to an array if it's a single file req.files;

  if (!files || files.length === 0) {
    return next(new APIError('There is no file', StatusCodes.NOT_FOUND)); 
  }

  // sort the file by their name to ensure they are in the correct order
  files.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // map over each data to create the base64 image
  const base64Images = files.map(file => file.data.toString('base64'));
  const extractedData = await extractResearchPaperDataBatch(base64Images);

  // add the extracted data to the database

  const researchPaper = new ResearchPaper({
    title: extractedData.title,
    authors: extractedData.authors,
    department: extractedData.department,
    data: extractedData.data,
    companyId: companyId
  });


  await researchPaper.save();
  return res.status(200).json({
    status: 'success',
    message: 'Data extracted successfully',
    data: researchPaper,
  });



});

