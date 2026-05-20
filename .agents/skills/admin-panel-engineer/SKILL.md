---
name: admin-panel-engineer
description: Builds the admin dashboard (Thiên Đạo) using Next.js, shadcn/ui, and React Query for Thiên Nam Engine.
---

# Skill: Admin Panel Engineer

## Purpose

Builds and maintains the admin dashboard ("Thiên Đạo") for Thiên Nam Engine using Next.js, TailwindCSS, shadcn/ui, React Query, and React Hook Form with Zod validation.

## When to Use

- Creating a new admin page
- Building a form for world mutation (event creation, item grant, etc.)
- Adding a data table with search and pagination
- Building an audit log viewer
- Creating a dashboard widget
- Adding role-based access control

## Inputs Expected

- Page to create or modify
- Data to display or mutate
- Required admin role level
- Form fields and validation rules

## Workflow

### Page Structure

1. Read `apps/admin/app/` for existing page patterns
2. Read `apps/admin/src/lib/` for API client and utilities
3. Read `.cursor/rules/050-admin-panel.mdc` for admin role requirements
4. Create page at `apps/admin/app/[section]/page.tsx`:

```typescript
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const giveItemSchema = z.object({
  characterId: z.string().cuid(),
  itemId: z.string().min(1),
  quantity: z.number().int().min(1).max(1000),
  reason: z.string().min(10, "Lý do phải có ít nhất 10 ký tự"),
  evidence: z.string().url().optional(),
});

type GiveItemForm = z.infer<typeof giveItemSchema>;

export default function GiveItemPage() {
  const form = useForm<GiveItemForm>({
    resolver: zodResolver(giveItemSchema),
    defaultValues: { quantity: 1 },
  });

  const mutation = useMutation({
    mutationFn: async (data: GiveItemForm) => {
      const res = await fetch("/api/admin/items/give", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      // Show toast
    },
  });

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tặng Vật Phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))}>
            {/* Form fields */}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang xử lý..." : "Tặng vật phẩm"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Form Validation Rules

Every mutation form requires:
1. **Reason field** — Required text, min 10 characters
2. **Evidence field** — Optional URL
3. **Preview** — Show what will change before confirm
4. **Confirmation** — "Are you sure?" with summary
5. **Auto-log** — Submit creates AdminAuditLog

### API Route

```typescript
// apps/admin/src/app/api/admin/items/give/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

const GiveItemSchema = z.object({
  characterId: z.string().cuid(),
  itemId: z.string().min(1),
  quantity: z.number().int().min(1).max(1000),
  reason: z.string().min(10),
  evidence: z.string().url().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const data = GiveItemSchema.parse(body);

  // Call admin API (via internal service call or direct Prisma)
  await prisma.$transaction(async (tx) => {
    await tx.inventoryItem.create({
      data: { characterId: data.characterId, itemId: data.itemId, quantity: data.quantity },
    });
    await tx.adminAuditLog.create({
      data: {
        adminId: session.adminId,
        action: "ITEM_GIVE",
        targetType: "character",
        targetId: data.characterId,
        newValue: { itemId: data.itemId, quantity: data.quantity },
        reason: data.reason,
        evidence: data.evidence,
      },
    });
  });

  return NextResponse.json({ success: true });
}
```

### Data Table

```typescript
// Using shadcn/ui Table + TanStack Query
const { data, isLoading } = useQuery({
  queryKey: ["players"],
  queryFn: async () => {
    const res = await fetch("/api/admin/players");
    return res.json();
  },
});
```

## Output Format

- New/updated page in `apps/admin/app/`
- API route in `apps/admin/src/app/api/admin/`
- Updated navigation in sidebar
- Form validation schema
- Toast notifications for success/error

## Quality Bar

- Every mutation form has reason + evidence fields
- Every mutation calls AdminAuditLog
- Role level checked on every API route
- Preview before execute for economy changes
- Form validation with Zod schemas
- Error handling with user-friendly messages
- Loading states on all async operations
- Consistent dark theme matching Discord aesthetic

## Anti-Patterns

- Mutations without AdminAuditLog
- Missing role checks on API routes
- Mutations without reason field
- Form without Zod validation
- Direct Prisma calls without transactions
- Exposing sensitive data in API responses
- Missing error handling
- Mutations that bypass the API (direct Prisma from client)

## Related Files

- `apps/admin/app/`
- `apps/admin/src/lib/api.ts`
- `apps/admin/src/components/ui/` (shadcn components)
- `.cursor/rules/050-admin-panel.mdc`
- `.cursor/rules/080-security-and-audit.mdc`
