#!/bin/bash
set -e

echo "🚀 Setting up AI Chatbot → Sales CRM Pipeline..."

# 1. Append Lead model to schema.prisma if it doesn't already exist
SCHEMA_PATH="prisma/schema.prisma"
if [ -f "$SCHEMA_PATH" ]; then
    if ! grep -q "model Lead" "$SCHEMA_PATH"; then
        echo "" >> "$SCHEMA_PATH"
        echo "model Lead {" >> "$SCHEMA_PATH"
        echo "  id              String   @id @default(cuid())" >> "$SCHEMA_PATH"
        echo "  name            String" >> "$SCHEMA_PATH"
        echo "  school          String" >> "$SCHEMA_PATH"
        echo "  phone           String" >> "$SCHEMA_PATH"
        echo "  email           String" >> "$SCHEMA_PATH"
        echo "  studentStrength Int?" >> "$SCHEMA_PATH"
        echo "  location        String?" >> "$SCHEMA_PATH"
        echo "  interest        String?" >> "$SCHEMA_PATH"
        echo "  score           Int      @default(0)" >> "$SCHEMA_PATH"
        echo "  temperature     String   @default(\"🔵 Cold\")" >> "$SCHEMA_PATH"
        echo "  status          String   @default(\"NEW\")" >> "$SCHEMA_PATH"
        echo "  createdAt       DateTime @default(now())" >> "$SCHEMA_PATH"
        echo "}" >> "$SCHEMA_PATH"
        echo "✨ Added Lead model to schema.prisma"
    else
        echo "ℹ️ Lead model already exists in schema.prisma"
    fi
else
    echo "❌ prisma/schema.prisma not found!"
    exit 1
fi

# 2. Create src/lib/leadScoring.ts
mkdir -p src/lib
cat << 'EOL' > src/lib/leadScoring.ts
interface LeadData {
  studentStrength?: number;
  interest?: string;
  location?: string;
}

export function evaluateLead(data: LeadData) {
  let score = 40; // Base score for completing chat

  if (data.studentStrength) {
    if (data.studentStrength > 1500) score += 40;
    else if (data.studentStrength > 500) score += 25;
    else score += 10;
  }

  if (data.interest?.toLowerCase().includes("full") || data.interest?.toLowerCase().includes("all")) {
    score += 20;
  }

  let temperature = "🔵 Cold";
  if (score >= 80) {
    temperature = "🔥 Hot";
  } else if (score >= 60) {
    temperature = "🟠 Warm";
  }

  return { score: Math.min(score, 100), temperature };
}
EOL
echo "✨ Created src/lib/leadScoring.ts"

# 3. Create API Route src/app/api/chat/lead/route.ts
mkdir -p src/app/api/chat/lead
cat << 'EOL' > src/app/api/chat/lead/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { evaluateLead } from '@/lib/leadScoring';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, school, phone, email, studentStrength, location, interest } = body;

    if (!name || !school || !phone || !email) {
      return NextResponse.json({ error: 'Missing required contact details' }, { status: 400 });
    }

    const { score, temperature } = evaluateLead({
      studentStrength: studentStrength ? parseInt(studentStrength) : undefined,
      location,
      interest
    });

    const newLead = await prisma.lead.create({
      data: {
        name,
        school,
        phone,
        email,
        studentStrength: studentStrength ? parseInt(studentStrength) : null,
        location,
        interest,
        score,
        temperature,
        status: 'NEW_INBOUND'
      }
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error('CRM Capture Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
EOL
echo "✨ Created src/app/api/chat/lead/route.ts"

# 4. Run prisma generate
echo "⚙️ Running npx prisma generate..."
npx prisma generate

echo "🎉 AI Chatbot → CRM pipeline setup completed successfully!"
