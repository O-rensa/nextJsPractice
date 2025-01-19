import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";

export default function AdminProductsPage() {
	return (<>
		<div className="flex justify-between items-center gap-4">
			<PageHeader>
				Products
			</PageHeader>
			
			<Button asChild>
				<Link href="/admin/products/new">
					Add Product
				</Link>
			</Button>
		</div>
		<ProductsTable></ProductsTable>
	</>);
}

async function ProductsTable() {
	const products = await db.product.findMany({ 
		select: { 
			id: true, 
			name: true, 
			priceInCents: true, 
			isAvailableForPurchase: true,
			_count: { select: { orders: true }},
		},
		orderBy: { name: "asc" }
	});

	if (0 === products.length) {
		return(
			<p>No Products Found</p>
		);
	}

	return (<Table>
		<TableHeader>
			<TableRow>
				<TableHead className="w-0">
					<span className="sr-only">
						Available For Purchase
					</span>
				</TableHead>
				<TableHead>Name</TableHead>
				<TableHead>Price</TableHead>
				<TableHead>Orders</TableHead>
				<TableHead className="w-0">
					<span className="sr-only">
						Actions
					</span>
				</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{
				products.map((p) => (
					<TableRow key={p.id}>
						<TableCell>
							{
								p.isAvailableForPurchase ? (
									<>
										<span className="sr-only">Available</span>
										<CheckCircle />
									</>
								) : (
									<>
										<span className="sr-only">Unavailable</span>
										<XCircle />
									</>
								)
							}
						</TableCell>
						<TableCell>{p.name}</TableCell>
						<TableCell>{formatCurrency(p.priceInCents / 100)}</TableCell>
						<TableCell>{formatNumber(p._count.orders)}</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<MoreVertical />
									<span className="sr-only">Actions</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem asChild>
										<a download href={`/admin/products/${p.id}/download`}>
											Download
										</a>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href={`/admin/products/${p.id}/edit`}>
											Edit
										</Link>
									</DropdownMenuItem>
									<ActiveToggleDropdownItem id={p.id} isAvailableForPurchase={p.isAvailableForPurchase}/>
									<DropdownMenuSeparator />
									<DeleteDropdownItem id={p.id} disabled={p._count.orders > 0}/>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))
			}
		</TableBody>
	</Table>);
}