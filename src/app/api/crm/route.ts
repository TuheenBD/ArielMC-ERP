import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import initialLeads from '@/data/crmLeads.json';
import initialActivities from '@/data/initialCrmActivities.json';
import initialTasks from '@/data/initialCrmTasks.json';
import initialSettings from '@/data/initialCrmSettings.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'crmDatabaseSnapshot.json');

// Real-Time Sync Configuration with Master CRM (Strictly scoped to ARIELMC entity)
const STRICT_COMPANY_CODE = 'ARIELMC';
const MASTER_CRM_SYNC_URL = process.env.MASTER_CRM_SYNC_URL || 'https://crm.arielmc.com/api/sync/arielmc';
const SYNC_SECRET = process.env.ARIELMC_SYNC_SECRET || 'arielmc-sovereign-sync-key-2026';

interface CrmDatabasePayload {
  leads: any[];
  activities: any[];
  tasks: any[];
  settings: any;
  inboundInquiries?: any[];
  metadata: {
    version: string;
    dbEngine: string;
    createdAt: string;
    lastSaved: string;
    totalLeads: number;
    totalActivities: number;
    totalTasks: number;
  };
}

// Helper to get initial seed database
function getInitialSeedDatabase(): CrmDatabasePayload {
  const timestamp = new Date().toISOString();
  return {
    leads: initialLeads,
    activities: initialActivities,
    tasks: initialTasks,
    settings: initialSettings,
    inboundInquiries: [],
    metadata: {
      version: '2.0.0',
      dbEngine: 'ArielMC Native Relational Storage Engine',
      createdAt: timestamp,
      lastSaved: timestamp,
      totalLeads: initialLeads.length,
      totalActivities: initialActivities.length,
      totalTasks: initialTasks.length,
    },
  };
}

// Read database from file, fallback to seed
async function readCrmDatabase(): Promise<CrmDatabasePayload> {
  try {
    const fileExists = await fs.stat(DB_FILE_PATH).then(() => true).catch(() => false);
    if (!fileExists) {
      const initialDb = getInitialSeedDatabase();
      await fs.writeFile(DB_FILE_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }

    const content = await fs.readFile(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.warn('Failed to read CRM database file, serving in-memory initial seed:', error);
    return getInitialSeedDatabase();
  }
}

// Write database to disk safely
async function writeCrmDatabase(db: CrmDatabasePayload): Promise<void> {
  db.metadata.lastSaved = new Date().toISOString();
  db.metadata.totalLeads = db.leads.length;
  db.metadata.totalActivities = db.activities.length;
  db.metadata.totalTasks = db.tasks.length;

  try {
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing CRM database to disk:', error);
    throw error;
  }
}

// GET: Fetch CRM Database
export async function GET(request: NextRequest) {
  try {
    const db = await readCrmDatabase();
    return NextResponse.json({
      success: true,
      dbEngine: 'ArielMC Native Database',
      data: db,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to read CRM database' },
      { status: 500 }
    );
  }
}

// POST: Full CRUD operations for Native CRM Database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload, id } = body;

    const db = await readCrmDatabase();

    switch (action) {
      case 'UPSERT_LEAD': {
        if (!payload || !payload.id) {
          return NextResponse.json({ success: false, error: 'Lead payload with ID required' }, { status: 400 });
        }
        // Force ARIELMC entity tag
        payload.companyCode = STRICT_COMPANY_CODE;
        payload.company_id = STRICT_COMPANY_CODE;

        const existingIdx = db.leads.findIndex((l) => l.id === payload.id);
        if (existingIdx >= 0) {
          db.leads[existingIdx] = { ...db.leads[existingIdx], ...payload, updatedAt: new Date().toISOString() };
        } else {
          db.leads.unshift({ ...payload, createdAt: payload.createdAt || new Date().toISOString() });
        }
        await writeCrmDatabase(db);

        // Bi-directional relay to Master CRM (ARIELMC entity only)
        if (MASTER_CRM_SYNC_URL) {
          fetch(MASTER_CRM_SYNC_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-arielmc-sync-key': SYNC_SECRET,
            },
            body: JSON.stringify({
              action: 'UPSERT_LEAD',
              company_id: STRICT_COMPANY_CODE,
              payload,
              forwardToErp: false, // Prevents ping-pong loop
            }),
          }).catch((err) => console.warn('Master CRM sync relay warning (non-blocking):', err));
        }

        return NextResponse.json({ success: true, action, lead: payload, totalLeads: db.leads.length });
      }

      case 'DELETE_LEAD': {
        const leadId = id || payload?.id;
        if (!leadId) {
          return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });
        }
        db.leads = db.leads.filter((l) => l.id !== leadId);
        // Also remove associated tasks and activities
        db.tasks = db.tasks.filter((t) => t.leadId !== leadId);
        await writeCrmDatabase(db);

        // Bi-directional relay to Master CRM (ARIELMC entity only)
        if (MASTER_CRM_SYNC_URL) {
          fetch(MASTER_CRM_SYNC_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-arielmc-sync-key': SYNC_SECRET,
            },
            body: JSON.stringify({
              action: 'DELETE_LEAD',
              company_id: STRICT_COMPANY_CODE,
              id: leadId,
              forwardToErp: false, // Prevents ping-pong loop
            }),
          }).catch(() => {});
        }

        return NextResponse.json({ success: true, action, deletedId: leadId, totalLeads: db.leads.length });
      }

      case 'UPSERT_ACTIVITY': {
        if (!payload || !payload.id) {
          return NextResponse.json({ success: false, error: 'Activity payload with ID required' }, { status: 400 });
        }
        const actIdx = db.activities.findIndex((a) => a.id === payload.id);
        if (actIdx >= 0) {
          db.activities[actIdx] = { ...db.activities[actIdx], ...payload };
        } else {
          db.activities.unshift(payload);
        }
        await writeCrmDatabase(db);
        return NextResponse.json({ success: true, action, activity: payload, totalActivities: db.activities.length });
      }

      case 'DELETE_ACTIVITY': {
        const actId = id || payload?.id;
        if (!actId) {
          return NextResponse.json({ success: false, error: 'Activity ID required' }, { status: 400 });
        }
        db.activities = db.activities.filter((a) => a.id !== actId);
        await writeCrmDatabase(db);
        return NextResponse.json({ success: true, action, deletedId: actId });
      }

      case 'UPSERT_TASK': {
        if (!payload || !payload.id) {
          return NextResponse.json({ success: false, error: 'Task payload with ID required' }, { status: 400 });
        }
        const taskIdx = db.tasks.findIndex((t) => t.id === payload.id);
        if (taskIdx >= 0) {
          db.tasks[taskIdx] = { ...db.tasks[taskIdx], ...payload };
        } else {
          db.tasks.unshift(payload);
        }
        await writeCrmDatabase(db);
        return NextResponse.json({ success: true, action, task: payload, totalTasks: db.tasks.length });
      }

      case 'DELETE_TASK': {
        const taskId = id || payload?.id;
        if (!taskId) {
          return NextResponse.json({ success: false, error: 'Task ID required' }, { status: 400 });
        }
        db.tasks = db.tasks.filter((t) => t.id !== taskId);
        await writeCrmDatabase(db);
        return NextResponse.json({ success: true, action, deletedId: taskId });
      }

      case 'UPDATE_SETTINGS': {
        if (!payload) {
          return NextResponse.json({ success: false, error: 'Settings payload required' }, { status: 400 });
        }
        db.settings = { ...db.settings, ...payload };
        await writeCrmDatabase(db);
        return NextResponse.json({ success: true, action, settings: db.settings });
      }

      case 'RECORD_INBOUND': {
        // Direct website lead intake API (replaces Google Apps Script webhooks)
        if (!payload) {
          return NextResponse.json({ success: false, error: 'Inbound payload required' }, { status: 400 });
        }
        const inboundId = payload.id || `INB-${Date.now()}`;
        const newLead = {
          id: `LEAD-${Date.now()}`,
          company: payload.company || payload.name || 'Inbound Inquiry',
          tier: payload.tier || 'TIER_3',
          market: payload.market || 'UK',
          country: payload.country || 'United Kingdom',
          channel: 'WEBSITE_FORM',
          contact: payload.contact || payload.name || 'Pending',
          role: payload.role || 'Buyer / Merchandiser',
          email: payload.email || '',
          phone: payload.phone || '',
          website: payload.website || '',
          address: payload.address || '',
          focus: payload.focus || payload.interest || 'Multi-Division',
          interest: payload.interest || 'Inbound Catalog Inquiry',
          priority: 'HIGH',
          stage: 'PROSPECT',
          value: payload.value ? Number(payload.value) : null,
          cur: 'USD',
          nextAction: 'Qualify buyer requirements & send digital line sheet',
          nextDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          lastContact: new Date().toISOString().split('T')[0],
          touches: 1,
          owner: 'Syed Akramul Hassan',
          notes: payload.message || payload.notes || 'Inbound lead received via ArielMC Web Portal API.',
          createdAt: new Date().toISOString(),
        };

        db.leads.unshift(newLead);
        if (!db.inboundInquiries) db.inboundInquiries = [];
        db.inboundInquiries.unshift({ id: inboundId, ...payload, receivedAt: new Date().toISOString(), leadId: newLead.id });

        await writeCrmDatabase(db);
        return NextResponse.json({ success: true, action, lead: newLead });
      }

      case 'RESTORE_BACKUP': {
        if (!payload || !Array.isArray(payload.leads)) {
          return NextResponse.json({ success: false, error: 'Invalid backup structure. Must contain leads array.' }, { status: 400 });
        }
        const restoredDb: CrmDatabasePayload = {
          leads: payload.leads || [],
          activities: payload.activities || [],
          tasks: payload.tasks || [],
          settings: payload.settings || db.settings,
          inboundInquiries: payload.inboundInquiries || [],
          metadata: {
            version: '2.0.0',
            dbEngine: 'ArielMC Native Relational Storage Engine',
            createdAt: db.metadata?.createdAt || new Date().toISOString(),
            lastSaved: new Date().toISOString(),
            totalLeads: (payload.leads || []).length,
            totalActivities: (payload.activities || []).length,
            totalTasks: (payload.tasks || []).length,
          },
        };
        await writeCrmDatabase(restoredDb);
        return NextResponse.json({ success: true, action, totalLeads: restoredDb.leads.length });
      }

      case 'RESET_DEFAULT': {
        const defaultDb = getInitialSeedDatabase();
        await writeCrmDatabase(defaultDb);
        return NextResponse.json({ success: true, action, totalLeads: defaultDb.leads.length });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update CRM database' },
      { status: 500 }
    );
  }
}
