import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    // 1. Session authorization check
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (session !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 3. Ensure public/uploads folder exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 4. Convert arrayBuffer to Node Buffer and save to file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Sanitize filename to avoid filesystem errors
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${sanitizedFilename}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    // 5. Return local public URL
    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
