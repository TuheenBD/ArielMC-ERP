import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ARIELMC_SYSTEM_INSTRUCTION = `You are the executive AI Co-founder & Operations Partner embedded directly inside ArielMC ERP (Enterprise Resource Planning System).
Your user and partner is Syed Akramul Hassan, the Managing Director & Founder of Ariel Marketing & Communications Limited (ArielMC).

### Core Brand & Communication Guidelines:
- Brand Name: Always write exactly as "ArielMC" (capital A, lowercase riel, capital M, capital C, NO space). Never write "Ariel MC" or "arielmc".
- Persona: You are an intelligent, warm, highly skilled, strategic, and proactive executive peer. Call the user "Partner" or "Syed". Speak naturally, conversationally, and with genuine insight. Avoid robotic cards, rigid subject-matter templates, or bureaucratic lecturing. Be concise, direct, helpful, and solution-driven.
- Language: English (fluent, professional international commerce tone).

### ArielMC Enterprise Architecture & 5-Division Portfolio (62 Active SKUs):
1. **01 THE LEATHER COMPENDIUM (7 SKUs)**:
   - Departments: Structured Carry & Bags, Handcrafted Leather Bags, Wallets & Small Leather Goods.
   - Key Items: Knox Full-Grain Crazy Horse Bifold Wallet ($14.50 FOB, factory cost $9.50), Loko Full-Grain Long Continental Wallet ($18.50 FOB), Iris Handcrafted Denim & Leather Tote ($24.50 FOB), Bloom Series Floral Satchel ($28.00 FOB), etc.
   - Attributes: Full-grain bovine/buffalo hide, vegetable/semi-chrome tanning, LWG-audited tannery sourcing, Savar tannery estate.

2. **02 THE GOLDEN FIBER EDIT (15 SKUs)**:
   - Departments: Everyday Carry & Bags, Modern Living & Décor, Tech & Eco-Stationery, Eco-Packaging & Gifting.
   - Key Items: ArielMC Terracotta Mandala Round Jute Rug (3ft: $10.80, 4ft: $15.80 FOB), Crimson Bloom Embroidered Jute Rug ($21.00 FOB), Natural Hessian Area Rug ($18.00 FOB), Artisanal Jute Table Runner ($3.80 FOB), Heritage Riverine Braided Storage Basket ($9.50 FOB), etc.
   - Attributes: 100% biodegradable natural golden jute (Sonali Aash), zero synthetic plastic, vegetable oil spun, 90-day biodegradation.

3. **03 THE CERAMIC INDEX (28 SKUs)**:
   - Departments: Dinnerware & Tabletop, Drinkware & Café, Modern Living & Decor, Culinary Serving & Hospitality.
   - Key Items: Handcrafted Stoneware Dinner Set 16pc ($42.00 FOB), Artisan Matte Glaze Serving Platters, Porcelain Espresso Cups ($3.20 FOB), Reactive Glaze Bowls, etc.
   - Attributes: High-temperature vitrified porcelain & bone china fired at 1,320°C, zero lead and cadmium leaching (FDA 7117.06 & LFGB compliant), chip resistant.

4. **04 THREAD & WEAVE (2 SKUs)**:
   - Departments: Canvas Tote Bags.
   - Key Items: Heavyweight 450 GSM Organic Cotton Canvas Tote ($7.45 FOB), Urban Carry Denim Tote ($6.95 FOB).
   - Attributes: GOTS certified organic cotton, Sedex/BSCI audited living wage factories.

5. **05 EARTH & FORM (10 SKUs)**:
   - Departments: Botanical & Garden, Tabletop & Hospitality, Home Living & Décor, Architectural Elements.
   - Key Items: Architectural Fluted Terracotta Planter ($14.00 FOB), Terracotta Wine Cooler, Bengal Clay Hospitality Urns, Botanical Pots.
   - Attributes: Centuries-old Bengal alluvial terracotta clay, breathable root aeration, frost-resistant vitrification.

### Commercial & Trade Policies:
- **Sample Policy (SOP-B2B-SMP-2026-V1)**: Sample fees paid by buyers are **100% credited back** against their first commercial bulk production purchase order.
- **Bangladesh Bank Cash Incentives**:
  - Golden Jute Diversified Products: **9.5% Net Yield**
  - Finished Leather & Goods: **6.65% Net Yield**
  - Pottery, Terracotta & Agro-Handicrafts: **6.65% Net Yield**
- **LDC Graduation Extension to November 24, 2029**:
  - The UN General Assembly formally extended Bangladesh's LDC graduation to late 2029.
  - Deferring average 12.5% MFN tariffs across 38 destination countries.
  - EU Everything But Arms (EBA) and UK Developing Countries Trading Scheme (DCTS) provide 100% duty-free quota-free (0% tariff) access through 2029.
  - Crucial strategic mandate: "A breathing space, not a blank check" — international buyers must use this 3-year runway to diversify away from 84%+ RMG dependence into ArielMC's Jute, Leather, and Ceramic lines.
- **Mandatory Ecosystem Implementation Sequence**:
  - **1. ERP** (Master truth for Costing, BOM, FOB, Margins, MoUs)
  - **2. CRM** (Buyer pipeline, inquiries, sample requests)
  - **3. Catalog** (Digital B2B compendium, HS codes, specs, packaging)
  - **4. Website** (Public showcase, department indices, trade briefings)
  - Followed by cross-platform sync check.

### Partner Factory Network:
- Vetted partner clusters in Savar, Gazipur, Dhamrai, Narsingdi, and Narayanganj.
- Audited under Sedex SMETA 4-Pillar, BSCI Grade A, LWG Gold/Silver, OEKO-TEX Standard 100, and ISO 9001/14001.

### Guidelines for Answering:
- If Syed asks about a specific product, margin, factory, or pricing calculation, give exact numbers and practical business advice.
- If asked to draft communications (buyer replies, factory follow-ups, RFQs, proforma notices), provide ready-to-send, polished copy.
- If asked strategic questions, provide sharp commercial analysis as a trusted co-founder.
- Keep answers clean, beautifully formatted in conversational markdown, and avoid unnecessary jargon or robotic disclaimers.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userApiKey, clientContext } = body;

    const apiKey =
      (userApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY || '')
      .trim();

    console.log(`[ArielMC AI Chat] Incoming POST from station: ${clientContext?.station || 'ArielMC BD'}, messages count: ${messages?.length}, key provided: ${Boolean(apiKey)}`);

    if (!apiKey) {
      console.warn('[ArielMC AI Chat] Rejected: No API key provided.');
      return NextResponse.json(
        {
          success: false,
          error: 'NO_API_KEY',
          message: 'No Google Gemini API key configured. Please enter your API key in Settings (⚙️).'
        },
        { status: 400 }
      );
    }

    // Inject system instructions as the very first context or developer instruction
    const systemPromptWithContext = `${ARIELMC_SYSTEM_INSTRUCTION}\n\n### Current ERP Session Context:\n- Station: ${clientContext?.station || 'ArielMC BD (Dhaka Station)'}\n- Active Currency: ${clientContext?.currency || 'USD ($)'}\n- Active Products Count: ${clientContext?.productsCount || 62}\n- Date/Time: ${new Date().toISOString()}`;

    // Build sanitized conversation history for Gemini API
    const rawList: { role: 'user' | 'model'; text: string }[] = [];

    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach((m: { sender?: string; role?: string; text?: string; content?: string }) => {
        const text = (m.text || m.content || '').trim();
        if (!text) return;
        const role: 'user' | 'model' = (m.sender === 'user' || m.role === 'user') ? 'user' : 'model';
        rawList.push({ role, text });
      });
    }

    // 1. Gemini strictly requires: First message MUST be role 'user' (drop leading welcome message)
    while (rawList.length > 0 && rawList[0].role === 'model') {
      rawList.shift();
    }

    // 2. Roles must strictly alternate: merge consecutive messages with the same role
    const contents: { role: string; parts: { text: string }[] }[] = [];
    rawList.forEach((item) => {
      if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
        contents[contents.length - 1].parts[0].text += `\n\n${item.text}`;
      } else {
        contents.push({
          role: item.role,
          parts: [{ text: item.text }]
        });
      }
    });

    // 3. The last message in contents must be role 'user'
    while (contents.length > 0 && contents[contents.length - 1].role === 'model') {
      contents.pop();
    }

    if (contents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'NO_USER_MESSAGE', message: 'No valid user query provided.' },
        { status: 400 }
      );
    }

    // 1. Discover supported models dynamically for this key via ModelService.ListModels
    let candidateModels: string[] = [];

    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData?.models)) {
          const supported = listData.models
            .filter((m: any) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
            .map((m: any) => (m.name || '').replace(/^models\//, ''))
            .filter(Boolean);

          if (supported.length > 0) {
            // Sort priority: 2.0-flash > 1.5-flash > 1.5-pro > others
            supported.sort((a: string, b: string) => {
              const getScore = (name: string) => {
                if (name.includes('2.0-flash')) return 100;
                if (name.includes('1.5-flash') && !name.includes('8b')) return 80;
                if (name.includes('1.5-flash')) return 70;
                if (name.includes('1.5-pro')) return 60;
                if (name.includes('flash')) return 50;
                if (name.includes('gemini')) return 40;
                return 10;
              };
              return getScore(b) - getScore(a);
            });
            candidateModels = supported;
            console.log(`[ArielMC AI Chat] Dynamically discovered ${supported.length} models for key. Top choice: ${supported[0]}`);
          }
        }
      } else {
        const err = await listRes.text().catch(() => '');
        console.warn(`[ArielMC AI Chat] ListModels returned HTTP ${listRes.status}:`, err);
      }
    } catch (e: any) {
      console.warn('[ArielMC AI Chat] ListModels fetch exception:', e?.message);
    }

    if (candidateModels.length === 0) {
      candidateModels = [
        'gemini-2.0-flash',
        'gemini-2.0-flash-exp',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash-001',
        'gemini-1.5-flash-002',
        'gemini-1.5-pro',
        'gemini-1.5-pro-latest'
      ];
    }

    let lastError: any = null;
    let replyText = '';

    // Iterate through candidates (both v1beta and v1)
    for (const model of candidateModels.slice(0, 5)) {
      for (const apiVersion of ['v1beta', 'v1']) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
          
          const payload = {
            systemInstruction: {
              parts: [{ text: systemPromptWithContext }]
            },
            contents,
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 2048,
            }
          };

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const data = await response.json();
            const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              replyText = candidateText;
              console.log(`[ArielMC AI Chat] Successfully generated response via ${model} (${apiVersion})`);
              break;
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            lastError = errData;
            console.warn(`[Gemini API ${model} ${apiVersion} Error ${response.status}]`, errData?.error?.message || response.statusText);
          }
        } catch (err: any) {
          lastError = err?.message || err;
          console.warn(`[Gemini API ${model} ${apiVersion} Exception]`, err?.message || err);
        }
      }
      if (replyText) break;
    }

    if (!replyText) {
      const errMsg = lastError?.error?.message || (typeof lastError === 'string' ? lastError : 'Google Gemini API request failed. Please verify API key.');
      return NextResponse.json(
        {
          success: false,
          error: 'GEMINI_CALL_FAILED',
          message: errMsg,
          details: lastError
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      provider: 'google-gemini'
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

