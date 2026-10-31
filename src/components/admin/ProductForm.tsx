"use client";

import { useActionState, useState } from "react";

import { saveProduct, type ActionState } from "@/lib/actions";
import { sizesFor, type Product } from "@/data/products";
import { buttonClass } from "@/components/ui/button-classes";
import { Input } from "@/components/ui/input";

const empty: ActionState = {};

export function ProductForm({ product }: { product?: Product }) {
  const [department, setDepartment] = useState<Product["department"]>(product?.department ?? "clothing");
  const [state, action, pending] = useActionState(saveProduct, empty);
  const sizes = sizesFor({
    id: product?.id ?? "draft",
    name: product?.name ?? "",
    price: product?.price ?? 0,
    department,
    category: product?.category ?? "",
    image: product?.image ?? "",
    hoverImage: product?.hoverImage ?? "",
  });

  return (
    <form action={action} className="grid max-w-xl gap-4">
      {state.error ? (
        <p role="alert" className="rounded-field bg-err-bg px-3.5 py-3 text-sm text-err-fg">
          {state.error}
        </p>
      ) : null}
      <Field label="Name">
        <Input name="name" required defaultValue={product?.name} />
      </Field>
      <Field label="Id">
        <Input name="id" required defaultValue={product?.id} readOnly={Boolean(product)} placeholder="plain-tee" />
      </Field>
      <Field label="Price in cedis">
        <Input name="price" type="number" min="0" step="0.01" required defaultValue={product?.price ?? 0} />
      </Field>
      <Field label="Department">
        <select
          name="department"
          value={department}
          onChange={(event) => setDepartment(event.target.value as Product["department"])}
          className="h-[52px] w-full rounded-field border border-line bg-field px-[18px]"
        >
          <option value="clothing">Clothing</option>
          <option value="sneakers">Shoes</option>
          <option value="accessories">Accessories</option>
        </select>
      </Field>
      <Field label="Category slug">
        <Input name="category" required defaultValue={product?.category} placeholder="hoodies" />
      </Field>
      <Field label="Color">
        <Input name="color" defaultValue={product?.color} placeholder="Black" />
      </Field>
      <Field label="Photo path">
        <Input name="image" required defaultValue={product?.image} placeholder="/images/products/look-tee-01.jpg" />
      </Field>
      <Field label="Second photo">
        <Input name="hoverImage" defaultValue={product?.hoverImage} />
      </Field>
      <fieldset className="grid gap-3">
        <legend className="text-sm font-medium">Stock by size</legend>
        {sizes.map((size) => (
          <label key={size} className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 text-sm">
            <span>{size}</span>
            <Input name={`stock-${size}`} type="number" min="0" step="1" defaultValue={product?.stock?.[size] ?? 0} />
          </label>
        ))}
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} />
        Show on the homepage
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="hidden" defaultChecked={product?.hidden} />
        Hide from the shop
      </label>
      <button type="submit" disabled={pending} className={buttonClass()}>
        {pending ? "Saving" : "Save product"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
