import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

// GET handler to retrieve the database contents
export async function GET() {
  try {
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: 'Database file not found' }, { status: 404 });
    }
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to read database: ' + error.message },
      { status: 500 }
    );
  }
}

// POST handler to update the database contents (auth guarded)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (session !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Simple verification of JSON schema structure
    if (!body.profile || !body.brands || !body.projects || !body.contact_settings || !body.contents || !body.news) {
      return NextResponse.json(
        { error: 'Invalid database structure. Required fields: profile, brands, projects, contact_settings, contents, news' },
        { status: 400 }
      );
    }

    fs.writeFileSync(dbPath, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to write database: ' + error.message },
      { status: 500 }
    );
  }
}
