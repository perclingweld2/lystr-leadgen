import { NextResponse } from 'next/server';
import { getLeadById, getInteractionsByLeadId, updateLead } from '@/lib/db';
import { generateCallScript } from '@/lib/scoring';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = getLeadById(id);

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const interactions = getInteractionsByLeadId(id);
    const callScript = generateCallScript(lead);

    return NextResponse.json({
      success: true,
      lead,
      interactions,
      callScript,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    updateLead(id, updates);

    const lead = getLeadById(id);

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
