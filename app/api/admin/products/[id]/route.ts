import { NextRequest } from 'next/server';
import { ok, badRequest } from '../../../../../lib/http';
import { z } from 'zod';

const UpdateProductSchema = z.object({
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  maxCapacity: z.string().min(1).optional(),
  clrRange: z.string().min(1).optional(),
  dieCost: z.string().min(1).optional(),
  cycleTime: z.string().min(1).optional(),
  weight: z.string().min(1).optional(),
  price: z.string().min(1).optional(),
  mandrel: z.enum(['Available', 'Standard', 'No']).optional(),
  totalScore: z.number().min(0).max(10).optional(),
  description: z.string().optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = UpdateProductSchema.parse(body);
    const { id } = await params;

    // In a real app, you would update the database here
    // For now, we'll just return success


    return ok({ 
      message: 'Product updated successfully',
      id: id,
      updates: validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return badRequest('Invalid data: ' + error.issues.map(e => e.message).join(', '));
    }
    return badRequest('Failed to update product');
  }
}
