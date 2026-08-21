import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as XLSX from "xlsx";

// This runs on the Next.js edge/Node server and proxies to the Cloudflare Worker
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const modules = searchParams.get("modules");
  const format = searchParams.get("format") || "xlsx";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8787";

  if (!modules) {
    return NextResponse.json({ error: "No modules specified" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("ethsltd_session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch raw JSON data from our Cloudflare backend
    const res = await fetch(`${apiUrl}/api/v1/admin/exports?modules=${encodeURIComponent(modules)}`, {
      method: 'GET',
      headers: {
        'Cookie': `ethsltd_session=${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await res.json();

    if (!result.success || !result.data) {
      return NextResponse.json({ error: result.error || "Failed to fetch data" }, { status: 500 });
    }

    const data: Record<string, any[]> = result.data;
    const wb = XLSX.utils.book_new();

    // 2. Build the Excel Workbook
    for (const [moduleName, rows] of Object.entries(data)) {
      // Ensure we don't have sheets with more than 31 characters
      const safeSheetName = moduleName.substring(0, 31);
      
      // If a table is empty, add a placeholder row so the sheet isn't completely invalid
      const sheetData = rows.length > 0 ? rows : [{ "Notice": "No data available" }];
      const ws = XLSX.utils.json_to_sheet(sheetData);
      
      XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
    }

    // 3. Export as XLSX or CSV
    if (format === "csv") {
      // For CSV with multiple modules, we combine them into one text stream
      let csvContent = "";
      for (const [moduleName, rows] of Object.entries(data)) {
         csvContent += `\n\n--- ${moduleName.toUpperCase()} ---\n\n`;
         const sheetData = rows.length > 0 ? rows : [{ "Notice": "No data available" }];
         const ws = XLSX.utils.json_to_sheet(sheetData);
         csvContent += XLSX.utils.sheet_to_csv(ws);
      }
      
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="ETHSLTD_Export_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Default to Excel
    const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="ETHSLTD_Export_${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });

  } catch (error: any) {
    console.error("Export generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate export" }, { status: 500 });
  }
}
