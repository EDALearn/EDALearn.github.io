// I want to extract content from this and url like: https://www.linkedin.com/posts/fmvilas_eventdrivenarchitecture-softwarearchitecture-activity-7300804650109227008-6bbz?rcm=ACoAAAC5JhMBfFdUjBRPcSzu5J5ygqxJrcPS3v0
// extract text from main > article > p
// extract post date maybe using a service like: https://trevorfox.com/linkedin-post-date-extractor.html
// create a folder with the date of the post in format yyyy-MM-dd
// create a file index.md with the content of the post in the folder
// download the image with css selector img.object-cover and save it as cover.jpg/png in the same folder
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { createWorker } from 'tesseract.js';

async function extractTextFromImage(filepath) {
  console.log(`📷 Extracting text from image: ${filepath}`);
  const tesseractWorker = await createWorker('eng');
  try {
    console.log('Processing image with OCR...');
    const { data: { text } } = await tesseractWorker.recognize(filepath);
    console.log('Raw text extracted from image:', text);
    
    // Get text until any of the specified delimiters
    const delimiters = ['FRAN', 'Fran', '©'];
    let title = text;
    
    console.log('Looking for delimiters:', delimiters);
    for (const delimiter of delimiters) {
      const index = text.indexOf(delimiter);
      if (index !== -1) {
        console.log(`Found delimiter "${delimiter}" at position ${index}`);
        // Get text up to the delimiter
        const possibleTitle = text.substring(0, index).trim();
        // Update title if this delimiter gives us a shorter string
        if (possibleTitle.length < title.length) {
          title = possibleTitle;
          console.log(`New shorter title found: "${title}"`);
        }
      }
    }

    // Clean up the title
    const finalTitle = title
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    console.log(`Final processed title: "${finalTitle}"`);
    
    // Terminate the worker
    await tesseractWorker.terminate();
    return finalTitle;
      
  } catch (error) {
    console.error('❌ Error extracting text from image:', error);
    await tesseractWorker.terminate();
    return null;
  }
}

async function downloadImage(url, filepath) {
  console.log(`📥 Downloading image from: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
    console.log(`✅ Image saved to: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error('❌ Error downloading image:', error);
    throw error;
  }
}

// Helper function to convert title to kebab case
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters (including colons)
    .replace(/:/g, '') // Explicitly remove colons
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

async function extractLinkedInContent(url) {
  console.log(`🔍 Processing LinkedIn URL: ${url}`);
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
    };

    console.log('Fetching LinkedIn post...');
    const response = await fetch(url, { headers });
    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('Looking for LD+JSON data...');
    const ldJsonScript = $('script[type="application/ld+json"]').html();
    if (!ldJsonScript) {
      throw new Error('LD+JSON data not found');
    }

    const ldJson = JSON.parse(ldJsonScript);
    console.log('Post metadata:', {
      headline: ldJson.headline,
      datePublished: ldJson.datePublished,
      imageUrl: ldJson.image?.url
    });

    const datePublished = new Date(ldJson.datePublished);
    const formattedDate = datePublished.toISOString().split('T')[0];
    const content = ldJson.articleBody;
    const imageUrl = ldJson.image?.url;

    console.log('Extracting hashtags from content...');
    const hashtags = content.match(/#\w+/g) || [];
    const tags = hashtags.map(tag => tag.replace('#', ''));
    console.log('Found tags:', tags);

    let title = ldJson.headline || 'LinkedIn Post';
    let imageText = null;
    console.log(`Initial title: "${title}"`);

    const folderName = `${formattedDate}-${toKebabCase(title)}`;
    let folderPath = path.join(process.cwd(), 'src/content/docs/blog', folderName);
    console.log(`Creating folder: ${folderPath}`);
    await fs.mkdir(folderPath, { recursive: true });
    console.log(`Folder created: ${folderPath}`);

    // Download and process image if available
    if (imageUrl) {
      const imagePath = path.join(folderPath, 'cover.jpg');
      await downloadImage(imageUrl, imagePath);
      
      // Extract text from image and use as title if available
      console.log('Attempting to extract title from image...');
      imageText = await extractTextFromImage(imagePath);
      if (imageText) {
        title = imageText;
        console.log(`Using title from image: "${title}"`);
        
        // Rename the folder with the new title
        const newFolderName = `${formattedDate}-${toKebabCase(title)}`;
        const newFolderPath = path.join(process.cwd(), 'src/content/docs/blog', newFolderName);
        
        console.log(`Renaming folder from ${folderPath} to ${newFolderPath}`);
        await fs.rename(folderPath, newFolderPath);
        
        // Update folderPath for subsequent operations
         folderPath = newFolderPath;
      } else {
        console.log('Could not extract title from image, keeping original title');
      }
    } else {
      console.log('No image URL found in post');
    }
    

    // Strip query parameters from URL for canonical
    const canonicalUrl = url.split('?')[0];

    console.log('Creating markdown file...');
    const markdown = `---
title: "${title}"
date: ${formattedDate}
featured: false
canonical: "${canonicalUrl}"
cover:
  alt: "${imageText || title}"
  image: ./cover.jpg
authors:
  - fmvilas
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
---

${content}

Originally posted on LinkedIn: [${title}](${canonicalUrl})

![${imageText || title}](./cover.jpg)
`;

    await fs.writeFile(path.join(folderPath, 'index.md'), markdown);
    console.log(`✅ Content successfully saved to ${folderPath}`);
  } catch (error) {
    console.error('❌ Error processing LinkedIn content:', error);
    throw error;
  }
}

const linkedInUrl = process.argv[2];

if (!linkedInUrl) {
  console.error('❌ Please provide a LinkedIn URL as an argument');
  console.error('Example: node content-downloader.js https://www.linkedin.com/posts/...');
  process.exit(1);
}

console.log('🚀 Starting LinkedIn content downloader...');
extractLinkedInContent(linkedInUrl)
  .then(() => console.log('✨ Process completed successfully'))
  .catch(error => {
    console.error('💥 Process failed:', error);
    process.exit(1);
  });
