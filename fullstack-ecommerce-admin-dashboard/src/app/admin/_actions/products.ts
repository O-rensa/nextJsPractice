"use server"

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(file => 
  file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine(file => file.size > 0, "Required"),
  image: imageSchema.refine(file => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const product = result.data;
  console.log(product);

  // save to file system
  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${product.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await product.file.arrayBuffer()));

  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${product.image.name}`;
  await fs.writeFile("public" + imagePath, Buffer.from(await product.image.arrayBuffer()));

  // save to database
  db.product.create({data: {
    isAvailableForPurchase: false,
    name: product.name, 
    description: product.description,
    priceInCents: product.priceInCents,
    filePath: filePath,
    imagePath: imagePath,
  }})

  redirect("/admin/products");
}