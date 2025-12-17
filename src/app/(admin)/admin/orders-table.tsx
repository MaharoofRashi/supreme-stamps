"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, CheckCircle, Clock, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner or use basic alert
import Link from "next/link";
import { OrderDetailsSheet } from "./order-details-sheet";

type Order = {
    id: string;
    createdAt: Date;
    status: string;
    customerName: string;
    items: any[];
    totalPrice: number;
    deliveryMethod: string;
    // ... other fields
}

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                toast.success("Order status updated");
            } else {
                toast.error("Failed to update status");
            }
        } catch (e) {
            toast.error("Error updating status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-800 hover:bg-amber-100";
            case "PROCESSING": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
            case "READY": return "bg-green-100 text-green-800 hover:bg-green-100";
            case "DELIVERED": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
            default: return "bg-secondary text-secondary-foreground";
        }
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}>
                            <TableCell className="font-mono text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                                {order.id.slice(-8)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{order.customerName}</div>
                                <div className="text-xs text-muted-foreground">{order.items.length} stamps</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex -space-x-2">
                                    {order.items.map((item, i) => (
                                        i < 3 && <div key={i} className="w-6 h-6 rounded-full border border-white bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                                            {item.shape[0].toUpperCase()}
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="w-6 h-6 rounded-full border border-white bg-muted flex items-center justify-center text-[8px]">+{order.items.length - 3}</div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="font-bold">AED {order.totalPrice}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{order.deliveryMethod}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={getStatusColor(order.status)} variant="secondary">
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}>
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "PENDING"); }}>
                                            <Clock className="mr-2 h-4 w-4 text-amber-500" /> Mark Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "PROCESSING"); }}>
                                            <FileText className="mr-2 h-4 w-4 text-blue-500" /> Mark Processing
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "READY"); }}>
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Mark Ready
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "DELIVERED"); }}>
                                            <Truck className="mr-2 h-4 w-4 text-gray-500" /> Mark Delivered
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <OrderDetailsSheet
                order={selectedOrder}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />
        </>
    );
}
