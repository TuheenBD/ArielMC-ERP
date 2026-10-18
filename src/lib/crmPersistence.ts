import { CrmLead, CrmActivity, CrmTask, CrmSettings } from '@/types/erp';
import initialLeadsData from '@/data/crmLeads.json';
import initialActivitiesData from '@/data/initialCrmActivities.json';
import initialTasksData from '@/data/initialCrmTasks.json';
import initialSettingsData from '@/data/initialCrmSettings.json';
import { getSupabaseClient } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'arielmc_crm_database_v2';

export interface CrmDatabaseState {
  leads: CrmLead[];
  activities: CrmActivity[];
  tasks: CrmTask[];
  settings: CrmSettings;
  inboundInquiries?: any[];
  metadata?: {
    version: string;
    dbEngine: string;
    lastSaved: string;
    totalLeads: number;
    totalActivities: number;
    totalTasks: number;
  };
}

// Get fallback default state
export const getDefaultCrmDatabase = (): CrmDatabaseState => ({
  leads: initialLeadsData as unknown as CrmLead[],
  activities: initialActivitiesData as unknown as CrmActivity[],
  tasks: initialTasksData as unknown as CrmTask[],
  settings: initialSettingsData as unknown as CrmSettings,
  inboundInquiries: [],
  metadata: {
    version: '2.0.0',
    dbEngine: 'ArielMC Native Relational Storage',
    lastSaved: new Date().toISOString(),
    totalLeads: initialLeadsData.length,
    totalActivities: initialActivitiesData.length,
    totalTasks: initialTasksData.length,
  },
});

// Load full CRM database with dual-layer (Server API + LocalStorage + Default Fallback)
export const loadCrmDatabase = async (): Promise<CrmDatabaseState> => {
  // 1. Try server API
  try {
    const res = await fetch('/api/crm', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        // Cache to local storage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
          } catch {}
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Server CRM fetch failed, trying local cache:', err);
  }

  // 2. Try LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed.leads && Array.isArray(parsed.leads) && parsed.leads.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }

  // 3. Fallback to bundled seed
  const defaultDb = getDefaultCrmDatabase();
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultDb));
    } catch {}
  }
  return defaultDb;
};

// Save a Lead (Server + LocalStorage + Supabase)
export const persistCrmLead = async (lead: CrmLead): Promise<void> => {
  // Update LocalStorage first
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      const db: CrmDatabaseState = cached ? JSON.parse(cached) : getDefaultCrmDatabase();
      const idx = db.leads.findIndex((l) => l.id === lead.id);
      if (idx >= 0) {
        db.leads[idx] = { ...db.leads[idx], ...lead };
      } else {
        db.leads.unshift(lead);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    } catch {}
  }

  // Sync to Server API
  try {
    await fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPSERT_LEAD', payload: lead }),
    });
  } catch (err) {
    console.warn('Server sync error for lead:', err);
  }

  // Sync to Supabase if available
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('crm_leads').upsert({
        id: lead.id,
        company: lead.company,
        tier: lead.tier,
        market: lead.market,
        country: lead.country,
        channel: lead.channel,
        contact: lead.contact,
        role: lead.role,
        email: lead.email,
        phone: lead.phone,
        website: lead.website,
        address: lead.address,
        focus: lead.focus,
        interest: lead.interest,
        priority: lead.priority,
        stage: lead.stage,
        value: lead.value,
        cur: lead.cur || 'USD',
        next_action: lead.nextAction,
        next_date: lead.nextDate,
        last_contact: lead.lastContact,
        touches: lead.touches,
        owner: lead.owner,
        notes: lead.notes,
        source: lead.source,
      });
    } catch {}
  }
};

// Delete a Lead
export const deleteCrmLead = async (leadId: string): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const db: CrmDatabaseState = JSON.parse(cached);
        db.leads = db.leads.filter((l) => l.id !== leadId);
        db.tasks = db.tasks.filter((t) => t.leadId !== leadId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
      }
    } catch {}
  }

  try {
    await fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DELETE_LEAD', id: leadId }),
    });
  } catch (err) {
    console.warn('Server delete error for lead:', err);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('crm_leads').delete().eq('id', leadId);
    } catch {}
  }
};

// Save an Activity
export const persistCrmActivity = async (activity: CrmActivity): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      const db: CrmDatabaseState = cached ? JSON.parse(cached) : getDefaultCrmDatabase();
      const idx = db.activities.findIndex((a) => a.id === activity.id);
      if (idx >= 0) {
        db.activities[idx] = { ...db.activities[idx], ...activity };
      } else {
        db.activities.unshift(activity);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    } catch {}
  }

  try {
    await fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPSERT_ACTIVITY', payload: activity }),
    });
  } catch {}
};

// Save a Task
export const persistCrmTask = async (task: CrmTask): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      const db: CrmDatabaseState = cached ? JSON.parse(cached) : getDefaultCrmDatabase();
      const idx = db.tasks.findIndex((t) => t.id === task.id);
      if (idx >= 0) {
        db.tasks[idx] = { ...db.tasks[idx], ...task };
      } else {
        db.tasks.unshift(task);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    } catch {}
  }

  try {
    await fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPSERT_TASK', payload: task }),
    });
  } catch {}
};

// Delete a Task
export const deleteCrmTask = async (taskId: string): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const db: CrmDatabaseState = JSON.parse(cached);
        db.tasks = db.tasks.filter((t) => t.id !== taskId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
      }
    } catch {}
  }

  try {
    await fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DELETE_TASK', id: taskId }),
    });
  } catch {}
};

// Save Settings
export const persistCrmSettings = async (settings: CrmSettings): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      const db: CrmDatabaseState = cached ? JSON.parse(cached) : getDefaultCrmDatabase();
      db.settings = settings;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    } catch {}
  }

  try {
    await fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPDATE_SETTINGS', payload: settings }),
    });
  } catch {}
};

// 1-Click JSON Snapshot Export
export const exportCrmDatabaseSnapshot = (db: CrmDatabaseState): void => {
  const exportData = {
    ...db,
    exportedAt: new Date().toISOString(),
    system: 'ArielMC ERP Native CRM Suite',
  };
  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ArielMC_CRM_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 1-Click JSON Snapshot Restore
export const restoreCrmDatabaseSnapshot = async (parsedData: any): Promise<boolean> => {
  if (!parsedData || !Array.isArray(parsedData.leads)) {
    throw new Error('Invalid CRM database file: must contain a leads array.');
  }

  const restoredState: CrmDatabaseState = {
    leads: parsedData.leads,
    activities: parsedData.activities || [],
    tasks: parsedData.tasks || [],
    settings: parsedData.settings || initialSettingsData,
    inboundInquiries: parsedData.inboundInquiries || [],
    metadata: {
      version: '2.0.0',
      dbEngine: 'ArielMC Native Relational Storage',
      lastSaved: new Date().toISOString(),
      totalLeads: parsedData.leads.length,
      totalActivities: (parsedData.activities || []).length,
      totalTasks: (parsedData.tasks || []).length,
    },
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(restoredState));
  }

  try {
    await fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'RESTORE_BACKUP', payload: restoredState }),
    });
  } catch {}

  return true;
};

// Reset Database to Default Master Seed
export const resetCrmDatabaseToMasterSeed = async (): Promise<CrmDatabaseState> => {
  const defaultDb = getDefaultCrmDatabase();
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultDb));
  }

  try {
    await fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'RESET_DEFAULT' }),
    });
  } catch {}

  return defaultDb;
};
