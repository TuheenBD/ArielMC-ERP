import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PERMITTED_COMPANIES = ['ARIELMC', 'ARIEL_ENERGY'];
const SYNC_SECRET = process.env.ARIELMC_SYNC_SECRET || 'arielmc-sovereign-sync-key-2026';
const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'crmDatabaseSnapshot.json');

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('x-arielmc-sync-key') || request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '').trim();
  return token === SYNC_SECRET;
}

/**
 * POST /api/crm/sync
 * Receives real-time lead & deal updates from Master CRM and Ariel Energy portals.
 * STRICT ISOLATION GUARD: Drops any record that does not belong to ARIELMC or ARIEL_ENERGY.
 */
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or missing x-arielmc-sync-key' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, company_id, payload, id } = body;

    const targetCompany = company_id || payload?.companyCode || payload?.company_id || 'ARIELMC';

    // Strict entity verification
    if (!PERMITTED_COMPANIES.includes(targetCompany)) {
      return NextResponse.json(
        {
          success: false,
          error: `Isolation Rejection: ERP will not accept records for entity '${targetCompany}'. Permitted entities: ${PERMITTED_COMPANIES.join(', ')}.`,
        },
        { status: 403 }
      );
    }

    if (payload && payload.companyCode && !PERMITTED_COMPANIES.includes(payload.companyCode)) {
      return NextResponse.json(
        {
          success: false,
          error: `Isolation Rejection: Payload companyCode '${payload.companyCode}' is forbidden.`,
        },
        { status: 403 }
      );
    }

    // Read current database
    let db: any = { leads: [], activities: [], tasks: [], settings: {}, metadata: {} };
    try {
      const fileData = await fs.readFile(DB_FILE_PATH, 'utf-8');
      db = JSON.parse(fileData);
    } catch {}

    if (!Array.isArray(db.leads)) {
      db.leads = [];
    }

    if (action === 'UPSERT_LEAD' && payload) {
      payload.companyCode = targetCompany;
      payload.company_id = targetCompany;
      const existingIdx = db.leads.findIndex((l: any) => l.id === payload.id);
      if (existingIdx >= 0) {
        db.leads[existingIdx] = { ...db.leads[existingIdx], ...payload, updatedAt: new Date().toISOString() };
      } else {
        db.leads.unshift({ ...payload, createdAt: payload.createdAt || new Date().toISOString() });
      }
      await fs.writeFile(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');

      return NextResponse.json({
        success: true,
        action,
        entity: targetCompany,
        leadId: payload.id,
        message: `Lead synchronized to ArielMC ERP for entity '${targetCompany}'`,
      });
    }

    if (action === 'DELETE_LEAD') {
      const targetId = id || payload?.id;
      db.leads = db.leads.filter((l: any) => l.id !== targetId);
      await fs.writeFile(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');

      return NextResponse.json({
        success: true,
        action,
        entity: targetCompany,
        deletedId: targetId,
        message: 'Lead deleted from ArielMC ERP via Master CRM sync',
      });
    }

    return NextResponse.json({ success: true, message: 'Sync ping received', entity: targetCompany });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'ERP sync endpoint error' },
      { status: 500 }
    );
  }
}
