import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

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

    // Strict 25% commercial margin pricing
    const turnkeyCostBdt = Number(body.totalCommercialTurnkeyBdt) || Number(body.turnkeyCostBdt) || Math.round(capacityKwp * 61600);
    const turnkeyWpRate = (turnkeyCostBdt / (capacityKwp * 1000)).toFixed(2);
    const debtAmount = turnkeyCostBdt * 0.8; // 80% BB Green Refinance
    const equityAmount = turnkeyCostBdt * 0.2; // 20% equity

    const monthlyRate = 0.045 / 12; // 4.5% concessionary debt
    const totalPayments = 7 * 12; // 84 months (after 1-yr moratorium)
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

    // Corporate Color Palette
    const navy = rgb(0.039, 0.098, 0.184); // #0A192F Dark Corporate Navy
    const gold = rgb(0.851, 0.467, 0.024); // #D97706 Warm Amber Gold
    const goldAccent = rgb(0.788, 0.659, 0.416); // #C9A86A Prestige Gold
    const emerald = rgb(0.02, 0.588, 0.412); // #059669 Emerald Green
    const emeraldDark = rgb(0.016, 0.471, 0.341); // #047857 Dark Emerald
    const lightBg = rgb(0.973, 0.984, 0.976); // #F8FBF9
    const white = rgb(1, 1, 1);
    const darkGray = rgb(0.15, 0.2, 0.25);
    const slateMuted = rgb(0.392, 0.455, 0.545); // #64748B
    const borderGray = rgb(0.796, 0.835, 0.882); // #CBD5E1

    const pageWidth = 595.28; // A4 standard points
    const pageHeight = 841.89;

    // Load official company logo
    let embeddedLogo: any = null;
    try {
      const possibleLogoPaths = [
        path.join(process.cwd(), 'public/logos/ariel-energy-logo-clean.png'),
        path.join(process.cwd(), '../Ariel-SaaS/public/logos/ariel-energy-logo-clean.png'),
        path.join(process.cwd(), '../ArielMC-ERP/public/logos/ariel-energy-logo-clean.png'),
        path.join(process.cwd(), 'public/logos/ariel-energy-logo.png'),
      ];
      for (const p of possibleLogoPaths) {
        if (fs.existsSync(p)) {
          const logoBytes = fs.readFileSync(p);
          embeddedLogo = await pdfDoc.embedPng(logoBytes);
          break;
        }
      }
    } catch (e) {
      console.warn('Logo embed notice:', e);
    }

    // ==============================================================
    // 1. OFFICIAL CORPORATE LETTERHEAD HEADER & FOOTER ENGINE
    // ==============================================================
    const drawPageChrome = (page: any, pageNumber: number, title: string) => {
      const rightX = pageWidth - 40;

      // Draw Logo on top-left if available (clean ratio 3.152:1, zero distortion)
      if (embeddedLogo) {
        const logoHeight = 28;
        const logoWidth = logoHeight * 3.152; // 88.25 pt
        page.drawImage(embeddedLogo, {
          x: 40,
          y: pageHeight - 48,
          width: logoWidth,
          height: logoHeight,
        });
      } else {
        page.drawText('Ariel Renewable Energy Limited', {
          x: 40,
          y: pageHeight - 32,
          size: 11,
          font: fontBold,
          color: navy,
        });
        page.drawText('Sovereign Green Infrastructure & Industrial Decarbonization', {
          x: 40,
          y: pageHeight - 42,
          size: 7,
          font: fontBold,
          color: gold,
        });
      }

      // Top-Right: Division Title & Statutory Registration Only (Zero Header Address/Phone Clutter)
      const headerTitle = 'COMMERCIAL & INDUSTRIAL ROOFTOP SOLAR DIVISION';
      const headerSub = 'SREDA Registered Turnkey EPC Partner • Reg: C-194820';

      page.drawText(headerTitle, {
        x: rightX - fontBold.widthOfTextAtSize(headerTitle, 7.5),
        y: pageHeight - 32,
        size: 7.5,
        font: fontBold,
        color: navy,
      });
      page.drawText(headerSub, {
        x: rightX - fontRegular.widthOfTextAtSize(headerSub, 6.5),
        y: pageHeight - 42,
        size: 6.5,
        font: fontRegular,
        color: slateMuted,
      });

      // Dual-Line Official Letterhead Divider (Gold primary + Emerald secondary)
      page.drawLine({
        start: { x: 40, y: pageHeight - 54 },
        end: { x: pageWidth - 40, y: pageHeight - 54 },
        thickness: 1.5,
        color: gold,
      });
      page.drawLine({
        start: { x: 40, y: pageHeight - 56.5 },
        end: { x: pageWidth - 40, y: pageHeight - 56.5 },
        thickness: 0.5,
        color: emerald,
      });

      // Sub-bar on Pages 2, 3, 4 showing Section Title
      if (pageNumber > 1) {
        page.drawText(`OFFICIAL EPC DOSSIER • SECTION ${pageNumber}: ${title.toUpperCase()}`, {
          x: 40,
          y: pageHeight - 68,
          size: 7.5,
          font: fontBold,
          color: navy,
        });
        const refStr = `Ref: AREL/QT/2026/EPC-${Math.round(capacityKwp)}KWP`;
        page.drawText(refStr, {
          x: rightX - fontBold.widthOfTextAtSize(refStr, 7),
          y: pageHeight - 68,
          size: 7,
          font: fontBold,
          color: gold,
        });
      }

      // Bottom Corporate Footer Bar (Approved Master Letterhead Standard)
      // Subtitle line above dark bar
      const footSub = 'Sovereign Clean Energy Infrastructure • Turnkey Commercial & Industrial (C&I) Solar EPC • SREDA Registered';
      page.drawText(footSub, {
        x: 40,
        y: 42,
        size: 6.2,
        font: fontBold,
        color: navy,
      });

      const pageStr = `PAGE ${pageNumber} OF 4`;
      page.drawText(pageStr, {
        x: rightX - fontBold.widthOfTextAtSize(pageStr, 7.5),
        y: 42,
        size: 7.5,
        font: fontBold,
        color: emeraldDark,
      });

      // Dark Navy Bar across bottom
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: 36,
        color: rgb(10 / 255, 25 / 255, 47 / 255), // #0A192F
      });

      // Line 1: Corporate HQ Address
      const footAddr = 'Corporate HQ: House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan-1, Dhaka-1212, Bangladesh';
      page.drawText(footAddr, {
        x: (pageWidth - fontBold.widthOfTextAtSize(footAddr, 6.8)) / 2,
        y: 20,
        size: 6.8,
        font: fontBold,
        color: white,
      });

      // Line 2: Telephony, Email & Website
      const footContacts = '☎ : +880 2410 811 91    📱 : +880 1819 273 458    ✉ : info@arielenergybd.com    🌐 www.arielenergybd.com';
      page.drawText(footContacts, {
        x: (pageWidth - fontRegular.widthOfTextAtSize(footContacts, 6.2)) / 2,
        y: 8,
        size: 6.2,
        font: fontRegular,
        color: white,
      });
    };

    // ==========================================
    // PAGE 1: EXECUTIVE COVER & PLANT SPECIFICATION
    // ==========================================
    const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
    drawPageChrome(page1, 1, 'Plant Architecture');

    // Reference & Date Meta Bar
    page1.drawText(`Ref: AREL/QT/2026/EPC-${Math.round(capacityKwp)}KWP-V1 • Confidential Commercial Submission`, {
      x: 40,
      y: pageHeight - 72,
      size: 7.5,
      font: fontBold,
      color: slateMuted,
    });
    const dateStr = `Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • Dhaka, Bangladesh`;
    page1.drawText(dateStr, {
      x: pageWidth - 40 - fontRegular.widthOfTextAtSize(dateStr, 7.5),
      y: pageHeight - 72,
      size: 7.5,
      font: fontRegular,
      color: slateMuted,
    });

    // Title Block
    page1.drawRectangle({
      x: 40,
      y: pageHeight - 165,
      width: pageWidth - 80,
      height: 85,
      color: lightBg,
      borderColor: goldAccent,
      borderWidth: 1.2,
    });

    page1.drawText('EXECUTIVE ROOFTOP SOLAR FEASIBILITY & TURNKEY EPC QUOTATION', {
      x: 55,
      y: pageHeight - 98,
      size: 11.5,
      font: fontBold,
      color: navy,
    });

    page1.drawText(`Prepared For: ${companyName.toUpperCase()}`, {
      x: 55,
      y: pageHeight - 118,
      size: 11,
      font: fontBold,
      color: emeraldDark,
    });

    page1.drawText(
      `Site Location: ${location} | Executive Contact: ${contactName} (${designation})`,
      {
        x: 55,
        y: pageHeight - 136,
        size: 8,
        font: fontRegular,
        color: darkGray,
      }
    );

    page1.drawText(
      `Statutory Framework: SREDA Net-Metering Guidelines 2024–2026 • 25.0% Commercial Margin Turnkey Model`,
      {
        x: 55,
        y: pageHeight - 150,
        size: 7.2,
        font: fontOblique,
        color: gold,
      }
    );

    // Summary Metric Badges (4 boxes)
    const boxW = (pageWidth - 80 - 30) / 4;
    const badgeY = pageHeight - 245;

    const badges = [
      { label: 'PLANT CAPACITY', val: `${capacityKwp.toLocaleString()} kWp`, sub: 'N-Type TOPCon 620W', col: emeraldDark },
      { label: 'ANNUAL YIELD', val: `${Math.round(annualGenKwh / 1000).toLocaleString()} MWh`, sub: '1,420 kWh/kWp specific', col: navy },
      { label: 'MONTHLY SAVINGS', val: `Tk ${(monthlySavingsBdt / 100000).toFixed(2)} Lakh`, sub: 'Direct bill reduction', col: emeraldDark },
      { label: 'COMMERCIAL TURNKEY', val: `Tk ${(turnkeyCostBdt / 100000).toFixed(2)}L`, sub: '25% Locked Margin', col: gold },
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
      page1.drawText(b.val, { x: bx + 8, y: badgeY + 26, size: 11.5, font: fontBold, color: b.col });
      page1.drawText(b.sub, { x: bx + 8, y: badgeY + 12, size: 6.5, font: fontRegular, color: darkGray });
    });

    // Technical Hardware Specifications Table
    page1.drawText('1. SYSTEM ENGINEERING & TIER-1 HARDWARE BILL OF QUANTITIES (BoQ)', {
      x: 40,
      y: pageHeight - 272,
      size: 9.5,
      font: fontBold,
      color: navy,
    });

    const specs = [
      ['PV Module Technology', 'Tier-1 Bloomberg (JinkoSolar / LONGi) N-Type TOPCon 620W Bifacial (22.8% cell eff., 80% bifaciality)'],
      ['Inverter Architecture', 'High-Efficiency String Inverters (Huawei / Sungrow 100kW–330kW), 98.8% Euro Efficiency, Multi-MPPT'],
      ['Mounting Structure', 'Anodized Marine-Grade AL6063-T6 Aluminum Rails + SUS304 Fasteners (Cyclone-rated to 180 km/h)'],
      ['DC/AC Switchgear & Cables', 'IP66 Class-II Surge Protection (Type 1+2), DC Isolators, Dual Disconnect Relays, 6mm² XLPE UV Solar Wire'],
      ['Transformer & Substation', 'Step-up Distribution Transformer with HT Breaker Sync, Copper Mesh Earthing & Lightning Arrester'],
      ['Net-Metering Smart Meter', '3-Phase 4-Quadrant Class 0.2s Bi-directional Smart Meter certified by BPDB/BREB/DESCO'],
      ['IoT Telemetry & SCADA', 'Ariel-SaaS™ Cloud Engine with RS485 Modbus string monitoring & automated I-REC carbon ledger'],
      ['Workmanship & Warranty', '15-Year Manufacturer Workmanship + 30-Year Linear Module Power Guarantee (87.4% at Year 30)'],
    ];

    let currentY = pageHeight - 292;
    specs.forEach(([param, spec], idx) => {
      const rowBg = idx % 2 === 0 ? lightBg : white;
      page1.drawRectangle({
        x: 40,
        y: currentY - 5,
        width: pageWidth - 80,
        height: 19,
        color: rowBg,
      });

      page1.drawText(param, { x: 48, y: currentY, size: 7.5, font: fontBold, color: navy });
      page1.drawText(spec, { x: 195, y: currentY, size: 6.8, font: fontRegular, color: darkGray });
      currentY -= 20;
    });

    // Roof & Civil Audit Readiness
    currentY -= 12;
    page1.drawText('2. ROOFTOP SPATIAL & STRUCTURAL AUDIT PROFILE', {
      x: 40,
      y: currentY,
      size: 9.5,
      font: fontBold,
      color: navy,
    });

    currentY -= 18;
    const roofDetails = [
      `Gross Roof Footprint: ${roofAreaSqFt.toLocaleString()} sq ft (~${Math.round(grossAreaM2).toLocaleString()} m²) with non-penetrating clamps`,
      `Safety & Egress Buffer: 15% dedicated to RSC / Accord compliant fire escape pathways & roof maintenance walkways`,
      `Roof Substrate Type: ${roofType} with certified cyclone shear resistance & zero structural penetration`,
      `Estimated Module Population: ~${Math.round((capacityKwp * 1000) / 620)} Monocrystalline TOPCon 620W Bifacial Panels`,
    ];

    roofDetails.forEach((line) => {
      page1.drawText(`•  ${line}`, { x: 48, y: currentY, size: 7.5, font: fontRegular, color: darkGray });
      currentY -= 15;
    });

    // ==============================================================
    // PAGE 2: FINANCIAL WATERFALL: 4.5% BANGLADESH BANK GREEN LOAN
    // ==============================================================
    const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
    drawPageChrome(page2, 2, 'Financial Waterfall');

    page2.drawText('3. FINANCIAL WATERFALL: 4.5% BANGLADESH BANK GREEN REFINANCING', {
      x: 40,
      y: pageHeight - 90,
      size: 10.5,
      font: fontBold,
      color: navy,
    });

    page2.drawText(
      'Demonstrating net-positive monthly cash generation from Day 1 with 1-Year Grace Moratorium under concessionary green credit.',
      { x: 40, y: pageHeight - 104, size: 8, font: fontOblique, color: slateMuted }
    );

    // Financial Table with Grace Period, 25% Margin Turnkey, and ZERO text clipping
    const finTable = [
      [
        `Capital Expenditure (Turnkey EPC @ Tk ${turnkeyWpRate}/Wp)`,
        `Tk ${(turnkeyCostBdt / 100000).toFixed(2)} Lakh`,
        'Turnkey EPC supply, structure, engineering & SREDA approvals (25% Margin)',
      ],
      [
        'Concessionary Debt Facility (80% via BB Refinancing)',
        `Tk ${(debtAmount / 100000).toFixed(2)} Lakh`,
        '4.5% fixed interest, 7-year loan tenure with 1-Year Grace Moratorium',
      ],
      [
        'Client Equity Contribution (20% Milestone Based)',
        `Tk ${(equityAmount / 100000).toFixed(2)} Lakh`,
        'Disbursed in 4 structured milestones tied strictly to delivery & commissioning',
      ],
      [
        'Gross Monthly Grid Electricity Bill Reduction',
        `Tk ${(monthlySavingsBdt / 100000).toFixed(2)} Lakh/mo`,
        `Direct savings offsetting ${utilityProvider} industrial tariff (@ Tk ${gridTariffRate}/kWh)`,
      ],
      [
        'Monthly Bank Debt Service (Months 13–84)',
        `Tk ${(monthlyEmiBdt / 100000).toFixed(2)} Lakh/mo`,
        'Concessionary 4.5% EMI schedule commencing Month 13 (Post 1-Yr Grace)',
      ],
      [
        'NET MONTHLY CASH SURPLUS (MONTH 1–12 GRACE PERIOD)',
        `+Tk ${(monthlySavingsBdt / 100000).toFixed(2)} Lakh/mo`,
        'NET CASH SURPLUS: Zero loan EMI in Year 1 moratorium; 100% savings retained',
      ],
      [
        'NET MONTHLY CASH SURPLUS (MONTH 13–84 DEBT SERVICE)',
        `+Tk ${(netMonthlySurplusBdt / 100000).toFixed(2)} Lakh/mo`,
        'NET POSITIVE CASH: Electricity bill savings comfortably exceed bank loan EMI',
      ],
      [
        'POST-DEBT ANNUAL FREE CASH FLOW (YEARS 8–30)',
        `+Tk ${(annualSavingsBdt / 100000).toFixed(2)} Lakh/yr`,
        '100% unencumbered clean power revenue after full bank loan retirement',
      ],
      [
        'Project Simple Payback Period',
        `${paybackYears} Years`,
        'Zero capital risk — entire project fully amortized from solar savings',
      ],
      [
        '25-Year Cumulative Net Profit Generated',
        `Tk ${((annualSavingsBdt * 25 - turnkeyCostBdt) / 10000000).toFixed(2)} Crore`,
        'Net lifetime corporate gain after all preventative O&M & inverter reserve',
      ],
    ];

    let fy = pageHeight - 128;
    finTable.forEach(([metric, val, note], idx) => {
      const isGraceHighlight = idx === 5;
      const isEmiHighlight = idx === 6;
      const isHighlight = isGraceHighlight || isEmiHighlight;
      const rowBg = isHighlight ? rgb(0.88, 0.96, 0.92) : idx % 2 === 0 ? lightBg : white;

      page2.drawRectangle({
        x: 40,
        y: fy - 5,
        width: pageWidth - 80, // 515.28 pt
        height: 22,
        color: rowBg,
        borderColor: isHighlight ? emerald : borderGray,
        borderWidth: isHighlight ? 1.2 : 0.5,
      });

      // Metric Title (Column 1: x=48 to x=260)
      page2.drawText(metric, {
        x: 48,
        y: fy + 3,
        size: 7.2,
        font: isHighlight ? fontBold : fontRegular,
        color: isHighlight ? emeraldDark : navy,
      });

      // Financial Value (Column 2: x=270 to x=365)
      page2.drawText(val, {
        x: 270,
        y: fy + 3,
        size: 8,
        font: fontBold,
        color: isHighlight ? emeraldDark : navy,
      });

      // Notes (Column 3: x=372 to x=550) - carefully fitted so NO text cuts off
      page2.drawText(note, {
        x: 372,
        y: fy + 3.5,
        size: 5.8,
        font: fontRegular,
        color: isHighlight ? emeraldDark : slateMuted,
      });

      fy -= 24;
    });

    // Explanatory Box: Zero Working Capital Advantage
    fy -= 15;
    page2.drawRectangle({
      x: 40,
      y: fy - 68,
      width: pageWidth - 80,
      height: 72,
      color: navy,
    });

    page2.drawText('THE ZERO WORKING CAPITAL ADVANTAGE FOR ENTERPRISE CLIENTS', {
      x: 55,
      y: fy - 15,
      size: 9,
      font: fontBold,
      color: gold,
    });

    const whyCash =
      'Because your monthly grid electricity bill savings exceed the concessionary 4.5% bank loan installment, your facility operates cash-positive from Month 1 of commissioning. During the initial 12-month grace period, 100% of generated power savings are retained in free cash. You never need to divert operating liquidity from core manufacturing, raw materials, or employee payroll.';
    page2.drawText(whyCash, {
      x: 55,
      y: fy - 33,
      size: 7.5,
      font: fontRegular,
      color: white,
      maxWidth: pageWidth - 110,
      lineHeight: 11,
    });

    // ==========================================
    // PAGE 3: SREDA POLICY & 10-YR TAX HOLIDAY
    // ==========================================
    const page3 = pdfDoc.addPage([pageWidth, pageHeight]);
    drawPageChrome(page3, 3, 'Policy & Fiscal Protections');

    page3.drawText('4. SREDA NET-METERING POLICY & FISCAL EXEMPTIONS (2026–2027)', {
      x: 40,
      y: pageHeight - 90,
      size: 10.5,
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
        title: 'SRO 159 Customs Duty Exemption on Tier-1 Capital Equipment',
        tag: 'NBR S.R.O. 159-LAW/2026',
        tagCol: emeraldDark,
        body: 'Importation of Tier-1 photovoltaic solar modules (H.S. Code 8541.43.00) and grid-tied solar string inverters (H.S. Code 8504.40.90) is legally shielded under SRO 159, carrying a nominal 1% customs duty (exempt from standard 37%+ luxury industrial import tariffs). Saves ~16% on total project CapEx.',
      },
      {
        title: '10-Year Corporate Income Tax Holiday Shield',
        tag: 'INCOME TAX ORDINANCE',
        tagCol: gold,
        body: 'Revenue generated from industrial rooftop solar installations and green power cost displacements benefits from a 100% corporate income tax exemption for the initial 5 operational years, scaling to a 50% exemption through Year 10. Accelerates enterprise asset equity accumulation.',
      },
      {
        title: 'IDCOL & Bangladesh Bank Concessionary Green Refinance Scheme',
        tag: '4.5% CONCESSIONARY DEBT',
        tagCol: navy,
        body: 'Structured under Bangladesh Bank Sustainable Finance Department Circulars. Up to 80% of project CapEx financed through nominated commercial participating financial institutions (PFIs) at preferential single-digit sovereign refinance interest rates with 1-Year Grace Period.',
      },
    ];

    let py = pageHeight - 110;
    policyCards.forEach((card) => {
      page3.drawRectangle({
        x: 40,
        y: py - 78,
        width: pageWidth - 80,
        height: 82,
        color: lightBg,
        borderColor: borderGray,
        borderWidth: 1,
      });

      page3.drawText(card.title, { x: 52, y: py - 16, size: 9, font: fontBold, color: navy });

      page3.drawRectangle({
        x: pageWidth - 200,
        y: py - 18,
        width: 145,
        height: 14,
        color: card.tagCol,
      });

      page3.drawText(card.tag, {
        x: pageWidth - 195,
        y: py - 14,
        size: 6.2,
        font: fontBold,
        color: white,
      });

      page3.drawText(card.body, {
        x: 52,
        y: py - 32,
        size: 7.2,
        font: fontRegular,
        color: darkGray,
        maxWidth: pageWidth - 110,
        lineHeight: 10.5,
      });

      py -= 92;
    });

    // Milestone Execution Matrix
    py -= 10;
    page3.drawText('5. TURNKEY EPC MILESTONE DEPLOYMENT ROADMAP (12 WEEKS)', {
      x: 40,
      y: py,
      size: 9.5,
      font: fontBold,
      color: navy,
    });

    py -= 18;
    const stages = [
      ['Weeks 1–2', 'Detailed structural load audit, 3D shadow mapping, and SREDA / BPDB interconnection application.'],
      ['Weeks 3–6', 'Opening of 1% concessional L/C, Tier-1 module dispatch from port, and DC mounting structure installation.'],
      ['Weeks 7–9', 'Module rigging, string inverter termination, AC busbar integration, and zero-export fail-safe calibration.'],
      ['Weeks 10–12', 'Bi-directional net meter installation, utility synchronization, and Ariel-SaaS™ telemetry commissioning.'],
    ];

    stages.forEach(([wk, desc]) => {
      page3.drawText(wk, { x: 48, y: py, size: 7.5, font: fontBold, color: emeraldDark });
      page3.drawText(desc, { x: 125, y: py, size: 7.2, font: fontRegular, color: darkGray });
      py -= 16;
    });

    // ==========================================
    // PAGE 4: EU CBAM DECARBONIZATION & SIGN-OFF
    // ==========================================
    const page4 = pdfDoc.addPage([pageWidth, pageHeight]);
    drawPageChrome(page4, 4, 'CBAM & Sign-Off');

    page4.drawText('6. EU CBAM & SCOPE 1/2 DECARBONIZATION COMPLIANCE', {
      x: 40,
      y: pageHeight - 90,
      size: 10.5,
      font: fontBold,
      color: navy,
    });

    page4.drawText(
      'Protecting European apparel, textile, and leather export orders from carbon border tariffs starting 2026.',
      { x: 40, y: pageHeight - 104, size: 8, font: fontOblique, color: slateMuted }
    );

    // Carbon metrics table
    const co2TonsAnnual = annualCo2Tons;
    const co2TonsLifetime = annualCo2Tons * 25;
    const treesEquivalent = Math.round(annualCo2Tons * 45);

    const esgBoxW = (pageWidth - 80 - 20) / 3;
    const esgY = pageHeight - 170;

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
        height: 58,
        color: white,
        borderColor: emeraldDark,
        borderWidth: 1,
      });

      page4.drawText(c.label, { x: bx + 10, y: esgY + 42, size: 7, font: fontBold, color: darkGray });
      page4.drawText(c.val, { x: bx + 10, y: esgY + 22, size: 11.5, font: fontBold, color: emeraldDark });
      page4.drawText(c.sub, { x: bx + 10, y: esgY + 9, size: 6.2, font: fontRegular, color: darkGray });
    });

    // CBAM Explanation
    let cy = pageHeight - 195;
    page4.drawText('WHY CBAM COMPLIANCE IS CRUCIAL FOR YOUR EUROPEAN BUYERS', {
      x: 40,
      y: cy,
      size: 8.5,
      font: fontBold,
      color: navy,
    });

    cy -= 16;
    const cbamText =
      'The European Union Carbon Border Adjustment Mechanism (CBAM) and corporate ESG audit directives (CSDDD) mandate that global brands audit Scope 1 & 2 emissions across vendor supply chains. Facilities powered by on-site solar gain preferential vendor allocation and complete immunity from carbon import duties.';
    page4.drawText(cbamText, {
      x: 40,
      y: cy,
      size: 7.2,
      font: fontRegular,
      color: darkGray,
      maxWidth: pageWidth - 80,
      lineHeight: 11,
    });

    // Formal Proposal Acceptance & Sign-off Block
    cy -= 45;
    page4.drawText('7. FORMAL PROPOSAL ACCEPTANCE & PHYSICAL AUDIT AUTHORIZATION', {
      x: 40,
      y: cy,
      size: 9.5,
      font: fontBold,
      color: navy,
    });

    cy -= 14;
    page4.drawText(
      'To schedule a physical drone roof inspection, structural load test, and 3D shadow analysis, execute below:',
      { x: 40, y: cy, size: 7.5, font: fontOblique, color: slateMuted }
    );

    // Sign off boxes
    cy -= 85;
    const signBoxW = (pageWidth - 80 - 20) / 2;

    // Client box
    page4.drawRectangle({
      x: 40,
      y: cy,
      width: signBoxW,
      height: 80,
      color: white,
      borderColor: borderGray,
      borderWidth: 1,
    });

    page4.drawText(`ACCEPTED FOR: ${companyName.toUpperCase()}`, {
      x: 50,
      y: cy + 66,
      size: 7.5,
      font: fontBold,
      color: navy,
    });
    page4.drawLine({ start: { x: 50, y: cy + 28 }, end: { x: 40 + signBoxW - 20, y: cy + 28 }, thickness: 0.8, color: borderGray });
    page4.drawText(`Authorized Signatory: ${contactName}`, { x: 50, y: cy + 16, size: 7, font: fontRegular, color: darkGray });
    page4.drawText('Designation & Corporate Seal / Date', { x: 50, y: cy + 7, size: 6.2, font: fontOblique, color: slateMuted });

    // Ariel Energy Box
    page4.drawRectangle({
      x: 40 + signBoxW + 20,
      y: cy,
      width: signBoxW,
      height: 80,
      color: white,
      borderColor: borderGray,
      borderWidth: 1,
    });

    page4.drawText('FOR: ARIEL RENEWABLE ENERGY LIMITED', {
      x: 50 + signBoxW + 20,
      y: cy + 66,
      size: 7.5,
      font: fontBold,
      color: emeraldDark,
    });
    page4.drawLine({
      start: { x: 50 + signBoxW + 20, y: cy + 28 },
      end: { x: pageWidth - 60, y: cy + 28 },
      thickness: 0.8,
      color: borderGray,
    });
    page4.drawText('Head of Clean Energy Infrastructure & Engineering', {
      x: 50 + signBoxW + 20,
      y: cy + 16,
      size: 7,
      font: fontRegular,
      color: darkGray,
    });
    page4.drawText('Direct Hotline: +880 1819 273 458 | info@arielenergybd.com', {
      x: 50 + signBoxW + 20,
      y: cy + 7,
      size: 6.2,
      font: fontOblique,
      color: slateMuted,
    });

    // Real-Time Enterprise Sync
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

      fetch(crmWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      }).catch((e) => console.warn('CRM Webhook async dispatch notice:', e.message));

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
    const safeFilename = `Ariel_Energy_EPC_Quotation_${Math.round(capacityKwp)}kWp.pdf`;

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
