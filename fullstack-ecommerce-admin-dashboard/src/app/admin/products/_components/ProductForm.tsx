"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useActionState, useState } from "react";
import { formatCurrency } from "@/lib/formatter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addProduct } from "../../_actions/products";

export function ProductForm() {
  const [error, action] = useActionState(addProduct, {});
  const [priceInCents, setPriceInCents] = useState<number>(0);

  let priceInCentsInput: undefined | number = undefined;
  let priceInCentsOnChange = (e: any) => {
    priceInCentsInput = e.target.value;
    if (undefined === e.target.value) {
      setPriceInCents(0);
    } else {
      setPriceInCents(e.target.value)
    }
  }

  return (<form className="space-y-8" action={action}>
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input type="text" id="name" name="name" required />
      { error?.name && <div className="text-destructive">{error.name}</div> }
    </div>

    <div className="space-y-2">
      <Label htmlFor="priceInCents">Price In Cents</Label>
      <Input type="number" id="priceInCents" name="priceInCents" required value={priceInCentsInput} onChange={e => priceInCentsOnChange(e)} /> 
      <div className="text-muted-foreground">
        {formatCurrency((priceInCents || 0) / 100)}
      </div>
      { error?.priceInCents && <div className="text-destructive">{error.priceInCents}</div> }
    </div> 

    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" name="description" required />
      { error?.description && <div className="text-destructive">{error.description}</div> }
    </div>

    <div className="space-y-2">
      <Label htmlFor="file">File</Label>
      <Input type="file" id="file" name="file" required />
      { error?.file && <div className="text-destructive">{error.file}</div> }
    </div>

    <div className="space-y-2">
      <Label htmlFor="image">Image</Label>
      <Input type="file" id="image" name="image" required />
      { error?.image && <div className="text-destructive">{error.image}</div> }
    </div>

    <Button type="submit" onClick={e => setPriceInCents(0)}>Save</Button>
  </form>); }