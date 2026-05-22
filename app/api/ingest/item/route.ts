import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { publishItem } from '../../../../lib/publish';
import { slugify } from '../../../../lib/format';

const Payload = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default(['ALL']),
  dimensions: z.string().optional().nullable(),
  dispatch_postcode: z.string().optional().nullable(),
  location_notes: z.string().optional().nullable(),
  availability_start: z.string().datetime().optional().nullable(),
  decision_deadline: z.string().datetime().optional().nullable(),
  guide_price_pence: z.number().int().nonnegative(),
  transport_price_pence: z.number().int().nonnegative().default(0),
  currency: z.string().default('gbp'),
  image_urls: z.array(z.string().url()).default([]),
  files: z.array(z.object({ name: z.string(), url: z.string().url(), type: z.string().optional(), size: z.number().optional() })).default([]),
  included: z.string().optional().nullable(),
  exclusions: z.string().optional().nullable(),
  compliance_notes: z.string().optional().nullable(),
  transport_notes: z.string().optional().nullable(),
  condition_notes: z.string().optional().nullable(),
  assembly_notes: z.string().optional().nullable(),
  auto_publish: z.boolean().default(false)
});

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!process.env.INGEST_SECRET || authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const json = await req.json();
  const parsed = Payload.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });

  const payload = parsed.data;
  const id = randomUUID();
  const item = {
    id,
    title: payload.title,
    slug: slugify(payload.title),
    description: payload.description || null,
    category: payload.category || null,
    tags: payload.tags.map((tag) => tag.trim().toUpperCase()).filter(Boolean),
    status: 'draft',
    dimensions: payload.dimensions || null,
    dispatch_postcode: payload.dispatch_postcode || null,
    location_notes: payload.location_notes || null,
    availability_start: payload.availability_start || null,
    decision_deadline: payload.decision_deadline || null,
    guide_price_pence: payload.guide_price_pence,
    transport_price_pence: payload.transport_price_pence,
    currency: payload.currency.toLowerCase(),
    image_urls: payload.image_urls,
    files: payload.files,
    included: payload.included || null,
    exclusions: payload.exclusions || null,
    compliance_notes: payload.compliance_notes || null,
    transport_notes: payload.transport_notes || null,
    condition_notes: payload.condition_notes || null,
    assembly_notes: payload.assembly_notes || null
  };

  const { error } = await supabaseAdmin().from('items').insert(item);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  let publishResult = null;
  if (payload.auto_publish) publishResult = await publishItem(id);

  return NextResponse.json({ ok: true, item_id: id, auto_published: payload.auto_publish, publish: publishResult });
}
