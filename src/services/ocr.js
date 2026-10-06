import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to use unpkg or bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;

/**
 * Preprocesses an image HTML element or ImageData using an offscreen canvas
 * Applies grayscale, high-contrast, and thresholding for enhanced mobile phone camera capture OCR
 */
export function preprocessImage(imageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Grayscale and contrast stretching
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Luminance formula
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Contrast boost
    gray = (gray - 128) * 1.35 + 128;
    gray = Math.max(0, Math.min(255, gray));

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Converts a PDF file into an array of rendered image data URLs using pdf.js
 */
export async function renderPdfToImages(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const pageImages = [];

  const maxPages = Math.min(pdf.numPages, 3); // process up to 3 pages for browser responsiveness

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.75 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport }).promise;
    pageImages.push(canvas.toDataURL('image/png'));
  }

  return pageImages;
}

/**
 * Performs OCR on an image or PDF file using Tesseract.js with 'eng+tam'
 * onProgress callback receives { status, progress (0 to 1) }
 */
export async function performOCR(fileOrDataUrl, onProgress = () => {}) {
  let imagesToProcess = [];

  if (fileOrDataUrl instanceof File) {
    if (fileOrDataUrl.type === 'application/pdf') {
      onProgress({ status: 'Rendering PDF pages...', progress: 0.1 });
      imagesToProcess = await renderPdfToImages(fileOrDataUrl);
    } else {
      // Image file
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(fileOrDataUrl);
      });

      // Preprocess image
      const img = new Image();
      img.src = dataUrl;
      await new Promise((res) => { img.onload = res; });
      const preprocessed = preprocessImage(img);
      imagesToProcess = [preprocessed];
    }
  } else if (typeof fileOrDataUrl === 'string') {
    // Already a data URL
    imagesToProcess = [fileOrDataUrl];
  }

  onProgress({ status: 'Initializing bilingual Tesseract OCR worker (eng + tam)...', progress: 0.25 });
  
  // Initialize worker for English + Tamil
  const worker = await createWorker(['eng', 'tam'], undefined, {
    logger: m => {
      if (m.status === 'recognizing text') {
        const p = 0.3 + (m.progress || 0) * 0.6;
        onProgress({ status: `Recognizing text (${Math.round((m.progress || 0) * 100)}%)...`, progress: Math.min(p, 0.95) });
      }
    }
  });

  let fullText = '';
  for (let i = 0; i < imagesToProcess.length; i++) {
    onProgress({ status: `Processing page ${i + 1} of ${imagesToProcess.length}...`, progress: 0.35 + (i * 0.3) });
    const ret = await worker.recognize(imagesToProcess[i]);
    fullText += (ret.data.text || '') + '\n\n';
  }

  await worker.terminate();
  onProgress({ status: 'OCR Complete!', progress: 1.0 });

  return fullText.trim();
}
