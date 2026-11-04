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
      userApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'NO_API_KEY',
          message: 'No Gemini API key found on server or client.'
        },
        { status: 400 }
      );
    }

    // Build conversation history for Gemini API
    const contents: { role: string; parts: { text: string }[] }[] = [];

    // Inject system instructions as the very first context or developer instruction
    const systemPromptWithContext = `${ARIELMC_SYSTEM_INSTRUCTION}\n\n### Current ERP Session Context:\n- Station: ${clientContext?.station || 'ArielMC BD (Dhaka Station)'}\n- Active Currency: ${clientContext?.currency || 'USD ($)'}\n- Active Products Count: ${clientContext?.productsCount || 62}\n- Date/Time: ${new Date().toISOString()}`;

    // Convert messages array
    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach((m: { sender?: string; role?: string; text?: string; content?: string }) => {
        const text = m.text || m.content || '';
        if (!text) return;
        const role = (m.sender === 'user' || m.role === 'user') ? 'user' : 'model';
        contents.push({
          role,
          parts: [{ text }]
        });
      });
    }

    // Try Gemini 2.0 Flash first, fallback to Gemini 1.5 Flash
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError: any = null;
    let replyText = '';

    for (const model of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
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
            break;
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          lastError = errData;
        }
      } catch (err: any) {
        lastError = err?.message || err;
      }
    }

    if (!replyText) {
      return NextResponse.json(
        {
          success: false,
          error: 'GEMINI_CALL_FAILED',
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
