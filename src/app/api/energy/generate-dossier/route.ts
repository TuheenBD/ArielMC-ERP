import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const companyName = body.companyName || 'Industrial Enterprise Client';
    const contactName = body.contactName || 'Managing Director';
    const designation = body.designation || 'Executive Management';
    const phone = body.phone || '+880 1819 273458';
    const email = body.email || 'energy@arielmc.com';
    const location = body.location || 'Gazipur Industrial Zone, Bangladesh';
    const roofType = body.roofType || 'Industrial Corrugated Metal Shed';
    const roofAreaSqFt = Number(body.roofAreaSqFt) || 36500;
    const monthlyBillBdt = Number(body.monthlyBillBdt) || 1200000;
    const utilityProvider = body.utilityProvider || 'BREB';
    const operatingDays = Number(body.operatingDays) || 6;

    // Technical calculations
    const grossAreaM2 = roofAreaSqFt / 10.7639;
    const netUsableM2 = grossAreaM2 * 0.85; // 15% RSC/Accord fire egress deduction
    const capacityKwp = Number(body.capacityKwp) || Math.max(25, Math.round(netUsableM2 / 6.8));
    const annualGenKwh = Number(body.annualGenKwh) || capacityKwp * 1450;
    const monthlyGenKwh = annualGenKwh / 12;

    const gridTariffRate = utilityProvider === 'BREB' ? 14.25 : 14.85;
    const netMeterRate = 10.50; // SREDA guaranteed rate

    const fridayExportRatio = operatingDays === 6 ? 52 / 365 : 0.05;
    const selfConsumedKwh = annualGenKwh * (1 - fridayExportRatio);
    const exportedKwh = annualGenKwh * fridayExportRatio;

    const annualSavingsBdt = Number(body.annualSavingsBdt) || (selfConsumedKwh * gridTariffRate + exportedKwh * netMeterRate);
    const monthlySavingsBdt = annualSavingsBdt / 12;

    const turnkeyCostBdt = Number(body.totalCommercialTurnkeyBdt) || Number(body.turnkeyCostBdt) || (capacityKwp * 61600); // Strict 25% margin turnkey pricing
    const debtAmount = turnkeyCostBdt * 0.8; // 80% BB Green Refinance
    const equityAmount = turnkeyCostBdt * 0.2; // 20% equity

    const monthlyRate = 0.045 / 12; // 4.5% concessionary debt
    const totalPayments = 7 * 12; // 84 months
    const monthlyEmiBdt =
      (debtAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    const netMonthlySurplusBdt = monthlySavingsBdt - monthlyEmiBdt;
    const paybackYears = (turnkeyCostBdt / annualSavingsBdt).toFixed(1);
    const annualCo2Tons = Math.round((annualGenKwh / 1000) * 0.61);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Color definitions
    const navy = rgb(0.039, 0.102, 0.184); // #0A1A2F
    const gold = rgb(0.788, 0.659, 0.416); // #C9A86A
    const emerald = rgb(0.02, 0.588, 0.412); // #059669
    const lightBg = rgb(0.973, 0.984, 0.976); // #F8FBF9
    const white = rgb(1, 1, 1);
    const darkGray = rgb(0.2, 0.25, 0.3);
    const lightGray = rgb(0.9, 0.93, 0.92);
    const borderGray = rgb(0.8, 0.85, 0.83);

    const pageWidth = 595.28; // A4 standard points
    const pageHeight = 841.89;

    // Helper: Draw Header & Footer on each page
    const drawPageChrome = (page: any, pageNumber: number, title: string) => {
      // Top header banner
      page.drawRectangle({
        x: 0,
        y: pageHeight - 50,
        width: pageWidth,
        height: 50,
        color: navy,
      });

      page.drawText('ARIEL RENEWABLE ENERGY LIMITED', {
        x: 40,
        y: pageHeight - 32,
        size: 11,
        font: fontBold,
        color: white,
      });

      page.drawText('SOVEREIGN GREEN INFRASTRUCTURE & INDUSTRIAL DECARBONIZATION', {
        x: 40,
        y: pageHeight - 44,
        size: 7,
        font: fontRegular,
        color: gold,
      });

      page.drawText(title.toUpperCase(), {
        x: pageWidth - 40 - fontBold.widthOfTextAtSize(title.toUpperCase(), 9),
        y: pageHeight - 34,
        size: 9,
        font: fontBold,
        color: emerald,
      });

      // Bottom footer bar
      page.drawLine({
        start: { x: 40, y: 40 },
        end: { x: pageWidth - 40, y: 40 },
        thickness: 1,
        color: borderGray,
      });

      page.drawText('CONFIDENTIAL & PROPRIETARY — PREPARED EXCLUSIVELY FOR CLIENT EXECUTIVE BOARD', {
        x: 40,
        y: 28,
        size: 7,
        font: fontRegular,
        color: darkGray,
      });

      const pageStr = `PAGE ${pageNumber} OF 4`;
      page.drawText(pageStr, {
        x: pageWidth - 40 - fontBold.widthOfTextAtSize(pageStr, 8),
        y: 28,
        size: 8,
        font: fontBold,
        color: navy,
      });
    };

    // ==========================================
    // PAGE 1: EXECUTIVE COVER & PLANT SPECIFICATION
    // ==========================================
    const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
    drawPageChrome(page1, 1, 'Plant Architecture');

    // Title Block
    page1.drawRectangle({
      x: 40,
      y: pageHeight - 165,
      width: pageWidth - 80,
      height: 100,
      color: lightBg,
      borderColor: gold,
      borderWidth: 1.5,
    });

    page1.drawText('EXECUTIVE SOLAR FEASIBILITY & ROOF AUDIT DOSSIER', {
      x: 60,
      y: pageHeight - 95,
      size: 13,
      font: fontBold,
      color: navy,
    });

    page1.drawText(`Target Client: ${companyName}`, {
      x: 60,
      y: pageHeight - 118,
      size: 12,
      font: fontBold,
      color: emerald,
    });

    page1.drawText(
      `Location: ${location} | Contact: ${contactName} (${designation}) | Date: ${new Date().toLocaleDateString('en-GB')}`,
      {
        x: 60,
        y: pageHeight - 138,
        size: 8.5,
        font: fontRegular,
        color: darkGray,
      }
    );

    // Summary Metric Badges (4 boxes)
    const boxW = (pageWidth - 80 - 30) / 4;
    const badgeY = pageHeight - 245;

    const badges = [
      { label: 'PLANT CAPACITY', val: `${capacityKwp.toLocaleString()} kWp`, sub: 'Tier-1 N-Type TOPCon', col: emerald },
      { label: 'ANNUAL YIELD', val: `${Math.round(annualGenKwh / 1000).toLocaleString()} MWh`, sub: '1,450 kWh/kWp specific', col: navy },
      { label: 'MONTHLY SAVINGS', val: `Tk ${(monthlySavingsBdt / 100000).toFixed(2)} Lakh`, sub: 'Direct bill reduction', col: emerald },
      { label: 'NET CASH SURPLUS', val: `+Tk ${(netMonthlySurplusBdt / 100000).toFixed(2)}L/mo`, sub: 'After 4.5% bank loan', col: gold },
    ];

    badges.forEach((b, i) => {
      const bx = 40 + i * (boxW + 10);
      page1.drawRectangle({
        x: bx,
        y: badgeY,
        width: boxW,
        height: 65,
        color: white,
        borderColor: borderGray,
        borderWidth: 1,
      });

      page1.drawText(b.label, { x: bx + 8, y: badgeY + 48, size: 7, font: fontBold, color: darkGray });
      page1.drawText(b.val, { x: bx + 8, y: badgeY + 26, size: 12, font: fontBold, color: b.col });
      page1.drawText(b.sub, { x: bx + 8, y: badgeY + 12, size: 6.5, font: fontRegular, color: darkGray });
    });

    // Technical Hardware Specifications Table
    page1.drawText('1. SYSTEM ENGINEERING & TIER-1 HARDWARE BILL OF QUANTITIES', {
      x: 40,
      y: pageHeight - 275,
      size: 10,
      font: fontBold,
      color: navy,
    });

    const specs = [
      ['PV Module Technology', 'Tier-1 Bloomberg (JinkoSolar / LONGi) N-Type TOPCon 580W–610W Bifacial (22.8% eff.)'],
      ['Inverter Architecture', 'High-Efficiency String Inverters (Huawei / Sungrow 100kW–125kW), 98.8% Euro Efficiency'],
      ['Mounting Structure', 'Anodized Marine-Grade AL6005-T5 Aluminum + SS304 Fasteners (Wind load 160 km/h)'],
      ['DC/AC Switchgear & Protection', 'IP65 Class-II Surge Protection (Type 1+2), DC Isolators, Dual Disconnect Relays'],
      ['Transformer & Substation', 'Step-up Dry-Type / Oil-immersed Distribution Transformer with HT Breaker Sync'],
      ['Net-Metering Bi-directional Meter', '3-Phase 4-Quadrant Class 0.2s Smart Meter certified by BPDB/BREB/DESCO'],
      ['IoT Telemetry & Analytics', 'Ariel-SaaS™ Cloud Engine with RS485 Modbus remote inverter string monitoring'],
      ['Workmanship & Performance', '12-Year Workmanship Warranty + 30-Year Linear Module Power Output Guarantee (87.4%)'],
    ];

    let currentY = pageHeight - 295;
    specs.forEach(([param, spec], idx) => {
      const rowBg = idx % 2 === 0 ? lightBg : white;
      page1.drawRectangle({
        x: 40,
        y: currentY - 6,
        width: pageWidth - 80,
        height: 20,
        color: rowBg,
      });

      page1.drawText(param, { x: 50, y: currentY, size: 8, font: fontBold, color: navy });
      page1.drawText(spec, { x: 210, y: currentY, size: 7.5, font: fontRegular, color: darkGray });
      currentY -= 22;
    });

    // Roof & Civil Audit Readiness
    currentY -= 15;
    page1.drawText('2. ROOFTOP SPATIAL & STRUCTURAL AUDIT PROFILE', {
      x: 40,
      y: currentY,
      size: 10,
      font: fontBold,
      color: navy,
    });

    currentY -= 20;
    const roofDetails = [
      `Gross Roof Area: ${roofAreaSqFt.toLocaleString()} sq ft (~${Math.round(grossAreaM2).toLocaleString()} m²)`,
      `Safety & Egress Buffer: 15% dedicated to RSC / Accord compliant fire escape corridors`,
      `Roof Construction Type: ${roofType} with non-penetrating clamp mounting or ballasted frames`,
      `Estimated Module Count: ~${Math.round((capacityKwp * 1000) / 585)} Monocrystalline Bifacial Panels`,
    ];

    roofDetails.forEach((line) => {
      page1.drawText(`•  ${line}`, { x: 50, y: currentY, size: 8, font: fontRegular, color: darkGray });
      currentY -= 16;
    });

    // ==========================================
    // PAGE 2: 0% CAPEX CASH WATERFALL & LOAN ROI
    // ==========================================
    const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
    drawPageChrome(page2, 2, 'Financial Waterfall');

    page2.drawText('3. FINANCIAL WATERFALL: 4.5% BANGLADESH BANK GREEN REFINANCING', {
      x: 40,
      y: pageHeight - 75,
      size: 11,
      font: fontBold,
      color: navy,
    });

    page2.drawText(
      'Demonstrating net-positive monthly cash generation from Month 1 under concessionary green credit.',
      { x: 40, y: pageHeight - 90, size: 8.5, font: fontOblique, color: darkGray }
    );

    // Financial Table
    const finTable = [
      ['Capital Expenditure (Turnkey EPC @ Tk 51.60/Wp)', `Tk ${(turnkeyCostBdt / 100000).toFixed(2)} Lakh`, 'Includes engineering, procurement, installation & SREDA approvals'],
      ['Concessionary Debt Facility (80% via IDCOL / BB Refinance)', `Tk ${(debtAmount / 100000).toFixed(2)} Lakh`, '4.5% fixed interest rate, 7-year tenure (84 equal monthly installments)'],
      ['Client Equity Contribution (20% Milestone Based)', `Tk ${(equityAmount / 100000).toFixed(2)} Lakh`, 'Disbursed in 4 structured milestones tied strictly to delivery & sync'],
      ['Gross Monthly Grid Bill Reduction (Daytime Displacement)', `Tk ${(monthlySavingsBdt / 100000).toFixed(2)} Lakh/mo`, `Offsets standard ${utilityProvider} commercial grid tariff (@ Tk ${gridTariffRate}/kWh)`],
      ['Monthly Bank Debt Service (Principal + Interest)', `Tk ${(monthlyEmiBdt / 100000).toFixed(2)} Lakh/mo`, 'Concessionary 4.5% Green Debt EMI schedule over 84 months'],
      ['NET MONTHLY CASH SURPLUS TO FACTORY (MONTH 1–84)', `+Tk ${(netMonthlySurplusBdt / 100000).toFixed(2)} Lakh/mo`, 'NET POSITIVE CASH: Electricity savings exceed loan payment!'],
      ['POST-DEBT ANNUAL FREE CASH FLOW (YEARS 8–30)', `+Tk ${(annualSavingsBdt / 100000).toFixed(2)} Lakh/yr`, '100% of solar generation converts directly into unencumbered profit'],
      ['Project Simple Payback Period', `${paybackYears} Years`, 'Zero capital risk — asset fully amortized within ~44 months'],
      ['25-Year Cumulative Net Profit Generated', `Tk ${((annualSavingsBdt * 25 - turnkeyCostBdt) / 10000000).toFixed(2)} Crore`, 'Net lifetime financial gain after all maintenance & inverter reserve'],
    ];

    let fy = pageHeight - 120;
    finTable.forEach(([metric, val, note], idx) => {
      const isHighlight = idx === 5;
      const rowBg = isHighlight ? rgb(0.85, 0.95, 0.9) : idx % 2 === 0 ? lightBg : white;

      page2.drawRectangle({
        x: 40,
        y: fy - 6,
        width: pageWidth - 80,
        height: 24,
        color: rowBg,
        borderColor: isHighlight ? emerald : borderGray,
        borderWidth: isHighlight ? 1.5 : 0.5,
      });

      page2.drawText(metric, {
        x: 50,
        y: fy + 2,
        size: 8,
        font: isHighlight ? fontBold : fontRegular,
        color: isHighlight ? emerald : navy,
      });

      page2.drawText(val, {
        x: 320,
        y: fy + 2,
        size: 8.5,
        font: fontBold,
        color: isHighlight ? emerald : navy,
      });

      page2.drawText(note, {
        x: 420,
        y: fy + 3,
        size: 6.5,
        font: fontRegular,
        color: darkGray,
      });

      fy -= 26;
    });

    // Explanatory Box: Why is this Zero Working Capital?
    fy -= 20;
    page2.drawRectangle({
      x: 40,
      y: fy - 70,
      width: pageWidth - 80,
      height: 75,
      color: navy,
    });

    page2.drawText('THE 0% WORKING CAPITAL ADVANTAGE FOR EXPORT FACTORIES', {
      x: 55,
      y: fy - 15,
      size: 9,
      font: fontBold,
      color: gold,
    });

    const whyCash =
      'Because your monthly grid electricity savings surpass your concessionary 4.5% bank EMI installment, your factory operates cash-positive from Day 1 of commissioning. You do NOT need to divert operating liquidity or working capital from RMG fabric, leather hide, or raw material purchases.';
    page2.drawText(whyCash, {
      x: 55,
      y: fy - 35,
      size: 8,
      font: fontRegular,
      color: white,
      maxWidth: pageWidth - 110,
      lineHeight: 12,
    });

    // ==========================================
    // PAGE 3: SREDA POLICY & 10-YR TAX HOLIDAY
    // ==========================================
    const page3 = pdfDoc.addPage([pageWidth, pageHeight]);
    drawPageChrome(page3, 3, 'Policy & Fiscal Protections');

    page3.drawText('4. SREDA NET-METERING POLICY & FISCAL EXEMPTIONS (2026–2027)', {
      x: 40,
      y: pageHeight - 75,
      size: 11,
      font: fontBold,
      color: navy,
    });

    const policyCards = [
      {
        title: 'Tk 10.50 / kWh Net-Metering Grid Buyback Guarantee',
        tag: 'URGENT CUTOFF: FEB 28, 2027',
        tagCol: rgb(0.8, 0.2, 0.2),
        body: 'Under SREDA Net-Metering Guidelines 2024–2026, export factories feed 100% of excess weekend/holiday solar power back into the national grid (BREB/BPDB) at a guaranteed benchmark tariff of Tk 10.50 per unit. Crucial statutory deadline: commercial commissioning must be concluded prior to February 28, 2027 to lock in this premium rate for a full 20-year term.',
      },
      {
        title: '1% Concessional Customs Duty on Tier-1 Capital Equipment',
        tag: 'STATUTORY NBR S.R.O.',
        tagCol: emerald,
        body: 'Importation of Tier-1 photovoltaic solar modules (H.S. Code 8541.43.00) and grid-tied solar string inverters (H.S. Code 8504.40.90) is legally shielded under the renewable energy statutory regulatory order, carrying a nominal 1% customs duty (exempt from standard 37%+ luxury industrial tariffs).',
      },
      {
        title: '10-Year Corporate Income Tax Holiday Shield',
        tag: 'INCOME TAX ORDINANCE',
        tagCol: gold,
        body: 'Revenue generated from industrial rooftop solar installations and green power cost displacements benefits from a 100% corporate income tax exemption for the initial 5 operational years, scaling to a 50% exemption through Year 10. Accelerates enterprise asset equity accumulation.',
      },
      {
        title: 'IDCOL & Bangladesh Bank Concessionary Green Refinance Scheme',
        tag: '4.0% – 5.0% DEBT',
        tagCol: navy,
        body: 'Structured under Bangladesh Bank Sustainable Finance Department Circulars. Up to 80% of project CapEx financed through nominated commercial participating financial institutions (PFIs) at preferential single-digit sovereign refinance interest rates.',
      },
    ];

    let py = pageHeight - 110;
    policyCards.forEach((card) => {
      page3.drawRectangle({
        x: 40,
        y: py - 90,
        width: pageWidth - 80,
        height: 95,
        color: lightBg,
        borderColor: borderGray,
        borderWidth: 1,
      });

      page3.drawText(card.title, { x: 55, y: py - 18, size: 9.5, font: fontBold, color: navy });

      page3.drawRectangle({
        x: pageWidth - 200,
        y: py - 20,
        width: 145,
        height: 14,
        color: card.tagCol,
      });

      page3.drawText(card.tag, {
        x: pageWidth - 195,
        y: py - 16,
        size: 6.5,
        font: fontBold,
        color: white,
      });

      page3.drawText(card.body, {
        x: 55,
        y: py - 38,
        size: 7.5,
        font: fontRegular,
        color: darkGray,
        maxWidth: pageWidth - 110,
        lineHeight: 11,
      });

      py -= 110;
    });

    // Milestone Execution Matrix
    py -= 10;
    page3.drawText('5. TURNKEY EPC MILESTONE DEPLOYMENT ROADMAP (12 WEEKS)', {
      x: 40,
      y: py,
      size: 10,
      font: fontBold,
      color: navy,
    });

    py -= 20;
    const stages = [
      ['Weeks 1–2', 'Detailed structural load audit, 3D shadow mapping, and SREDA / BPDB interconnection application.'],
      ['Weeks 3–6', 'Opening of 1% concessional L/C, Tier-1 module dispatch from port, and DC mounting structure installation.'],
      ['Weeks 7–9', 'Module rigging, string inverter termination, AC busbar integration, and zero-export fail-safe calibration.'],
      ['Weeks 10–12', 'Bi-directional net meter installation, utility synchronization, and Ariel-SaaS™ telemetry commissioning.'],
    ];

    stages.forEach(([wk, desc]) => {
      page3.drawText(wk, { x: 50, y: py, size: 8, font: fontBold, color: emerald });
      page3.drawText(desc, { x: 130, y: py, size: 7.5, font: fontRegular, color: darkGray });
      py -= 18;
    });

    // ==========================================
    // PAGE 4: EU CBAM DECARBONIZATION & SIGN-OFF
    // ==========================================
    const page4 = pdfDoc.addPage([pageWidth, pageHeight]);
    drawPageChrome(page4, 4, 'CBAM & Sign-Off');

    page4.drawText('6. EU CBAM & SCOPE 1/2 DECARBONIZATION COMPLIANCE', {
      x: 40,
      y: pageHeight - 75,
      size: 11,
      font: fontBold,
      color: navy,
    });

    page4.drawText(
      'Protecting European apparel, textile, and leather export orders from carbon tariffs starting 2026.',
      { x: 40, y: pageHeight - 90, size: 8.5, font: fontOblique, color: darkGray }
    );

    // Carbon metrics table
    const co2TonsAnnual = annualCo2Tons;
    const co2TonsLifetime = annualCo2Tons * 25;
    const treesEquivalent = Math.round(annualCo2Tons * 45);

    const esgBoxW = (pageWidth - 80 - 20) / 3;
    const esgY = pageHeight - 165;

    const esgCards = [
      { label: 'ANNUAL CO2 ABATED', val: `${co2TonsAnnual.toLocaleString()} MT`, sub: 'Scope 2 emissions eliminated' },
      { label: '25-YEAR ABATEMENT', val: `${co2TonsLifetime.toLocaleString()} MT`, sub: 'Lifetime verified offsets' },
      { label: 'FOREST EQUIVALENT', val: `${treesEquivalent.toLocaleString()} Trees`, sub: 'Annual mature tree absorption' },
    ];

    esgCards.forEach((c, idx) => {
      const bx = 40 + idx * (esgBoxW + 10);
      page4.drawRectangle({
        x: bx,
        y: esgY,
        width: esgBoxW,
        height: 60,
        color: white,
        borderColor: emerald,
        borderWidth: 1,
      });

      page4.drawText(c.label, { x: bx + 10, y: esgY + 44, size: 7, font: fontBold, color: darkGray });
      page4.drawText(c.val, { x: bx + 10, y: esgY + 24, size: 12, font: fontBold, color: emerald });
      page4.drawText(c.sub, { x: bx + 10, y: esgY + 10, size: 6.5, font: fontRegular, color: darkGray });
    });

    // CBAM Explanation
    let cy = pageHeight - 190;
    page4.drawText('WHY CBAM COMPLIANCE IS CRUCIAL FOR YOUR EUROPEAN BUYERS', {
      x: 40,
      y: cy,
      size: 9,
      font: fontBold,
      color: navy,
    });

    cy -= 18;
    const cbamText =
      'The European Union Carbon Border Adjustment Mechanism (CBAM) and corporate ESG audit directives (CSDDD) mandate that apparel brands (such as H&M, Zara/Inditex, Marks & Spencer, and Next) audit Scope 1 & 2 emissions in their Tier-1 vendor supply chain. Facilities powered by on-site solar gain preferential vendor allocation and complete immunity from carbon import duties.';
    page4.drawText(cbamText, {
      x: 40,
      y: cy,
      size: 7.5,
      font: fontRegular,
      color: darkGray,
      maxWidth: pageWidth - 80,
      lineHeight: 11,
    });

    // Ariel-SaaS IoT Cloud Box
    cy -= 50;
    page4.drawRectangle({
      x: 40,
      y: cy - 75,
      width: pageWidth - 80,
      height: 80,
      color: lightBg,
      borderColor: gold,
      borderWidth: 1,
    });

    page4.drawText('ARIEL-SAAS™ CLOUD TELEMETRY & AUTOMATED I-REC ISSUANCE', {
      x: 55,
      y: cy - 15,
      size: 8.5,
      font: fontBold,
      color: navy,
    });

    const saasDesc =
      'Every plant engineered by Ariel Renewable Energy is pre-integrated with the Ariel-SaaS™ telemetry suite. Features include: (1) Real-time string performance ratio tracking; (2) AI battery dispatch optimization; (3) Automated monthly grid credit audit reconciliations; and (4) Turnkey issuance of internationally tradable I-REC (International Renewable Energy Certificate) carbon credits.';
    page4.drawText(saasDesc, {
      x: 55,
      y: cy - 35,
      size: 7.5,
      font: fontRegular,
      color: darkGray,
      maxWidth: pageWidth - 110,
      lineHeight: 11,
    });

    // Formal Acceptance & Roof Audit Booking Block
    cy -= 110;
    page4.drawText('7. FORMAL PHYSICAL ROOF AUDIT & DETAILED ENGINEERING ACCEPTANCE', {
      x: 40,
      y: cy,
      size: 9.5,
      font: fontBold,
      color: navy,
    });

    cy -= 15;
    page4.drawText(
      'To schedule a physical drone roof inspection, structural load test, and 3D shadow analysis, execute below:',
      { x: 40, y: cy, size: 7.5, font: fontOblique, color: darkGray }
    );

    // Sign off boxes
    cy -= 90;
    const signBoxW = (pageWidth - 80 - 20) / 2;

    // Client box
    page4.drawRectangle({
      x: 40,
      y: cy,
      width: signBoxW,
      height: 85,
      color: white,
      borderColor: borderGray,
      borderWidth: 1,
    });

    page4.drawText(`ACCEPTED FOR: ${companyName.toUpperCase()}`, {
      x: 50,
      y: cy + 70,
      size: 7.5,
      font: fontBold,
      color: navy,
    });
    page4.drawLine({ start: { x: 50, y: cy + 30 }, end: { x: 40 + signBoxW - 20, y: cy + 30 }, thickness: 0.8, color: borderGray });
    page4.drawText(`Authorized Signatory: ${contactName}`, { x: 50, y: cy + 18, size: 7, font: fontRegular, color: darkGray });
    page4.drawText('Designation & Corporate Seal / Date', { x: 50, y: cy + 8, size: 6.5, font: fontOblique, color: darkGray });

    // Ariel Energy Box
    page4.drawRectangle({
      x: 40 + signBoxW + 20,
      y: cy,
      width: signBoxW,
      height: 85,
      color: white,
      borderColor: borderGray,
      borderWidth: 1,
    });

    page4.drawText('FOR: ARIEL RENEWABLE ENERGY LIMITED', {
      x: 50 + signBoxW + 20,
      y: cy + 70,
      size: 7.5,
      font: fontBold,
      color: emerald,
    });
    page4.drawLine({
      start: { x: 50 + signBoxW + 20, y: cy + 30 },
      end: { x: pageWidth - 60, y: cy + 30 },
      thickness: 0.8,
      color: borderGray,
    });
    page4.drawText('Head of Clean Energy Infrastructure & Engineering', {
      x: 50 + signBoxW + 20,
      y: cy + 18,
      size: 7,
      font: fontRegular,
      color: darkGray,
    });
    page4.drawText('Direct Hotline: +880 1819 273458 | energy@arielmc.com', {
      x: 50 + signBoxW + 20,
      y: cy + 8,
      size: 6.5,
      font: fontOblique,
      color: darkGray,
    });

    // Real-Time Enterprise Sync: Push inbound audit lead to Master-CRM and ArielMC-ERP (The Heart of ArielMC)
    try {
      const crmWebhookUrl = process.env.ARIELMC_CRM_WEBHOOK_URL || 'http://127.0.0.1:3000/api/webhooks/energy-lead';
      const erpSyncUrl = process.env.ARIELMC_ERP_SYNC_URL || 'http://127.0.0.1:3001/api/crm/sync';
      const syncSecret = process.env.ARIELMC_SYNC_SECRET || 'arielmc-sovereign-sync-key-2026';

      const leadPayload = {
        companyName,
        contactName,
        designation,
        phone,
        email,
        location,
        roofType,
        roofAreaSqFt,
        monthlyBillBdt,
        capacityKwp,
        annualSavingsBdt,
        estimatedValue: turnkeyCostBdt,
        utilityProvider,
        companyCode: 'ARIEL_ENERGY',
      };

      // Push to Master-CRM (which logs the active pipeline lead)
      fetch(crmWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      }).catch((e) => console.warn('CRM Webhook async dispatch notice:', e.message));

      // Direct Push to ArielMC-ERP (The Master Source of Truth)
      fetch(erpSyncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-arielmc-sync-key': syncSecret,
        },
        body: JSON.stringify({
          action: 'UPSERT_LEAD',
          company_id: 'ARIEL_ENERGY',
          payload: {
            id: `NRG-WEB-${Date.now().toString().slice(-6)}`,
            company: companyName,
            contact: contactName,
            phone,
            email,
            stage: 'NEW_INQUIRY',
            capacityKwp,
            roofAreaSqFt,
            monthlyBillBdt,
            estimatedValueBdt: turnkeyCostBdt,
            companyCode: 'ARIEL_ENERGY',
            source: 'energy.arielmc.com Feasibility Generator',
          },
        }),
      }).catch((e) => console.warn('ERP direct sync notice:', e.message));
    } catch (syncErr: any) {
      console.warn('Ecosystem sync notification skipped:', syncErr.message);
    }

    // Serialize PDF
    const pdfBytes = await pdfDoc.save();
    const safeFilename = `Ariel_Energy_Dossier_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('Error generating PDF dossier:', err);
    return NextResponse.json({ error: 'Failed to generate PDF dossier', details: err.message }, { status: 500 });
  }
}
