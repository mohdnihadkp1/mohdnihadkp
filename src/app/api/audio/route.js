import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing file id parameter', { status: 400 });
  }

  // Google Drive direct download URL
  const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;

  try {
    const response = await fetch(driveUrl, {
      headers: {
        // Provide a user agent to prevent Google from blocking empty requests
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Google Drive returned ${response.status}`, { status: response.status });
    }

    const headers = new Headers();
    // Pass through necessary headers
    const contentType = response.headers.get('content-type');
    if (contentType) headers.set('Content-Type', contentType);
    
    const contentLength = response.headers.get('content-length');
    if (contentLength) headers.set('Content-Length', contentLength);
    
    // We want the browser to interpret this as a streamable media
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Access-Control-Allow-Origin', '*');

    // Return the readable stream directly to the client
    return new NextResponse(response.body, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return new NextResponse('Failed to fetch audio stream', { status: 500 });
  }
}
