import dbConnect from '@/app/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

// GET: List all products or get by id
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const product = await Product.findById(id);
    return NextResponse.json(product);
  }
  const products = await Product.find({});
  return NextResponse.json(products);
}

// POST: Create new product (admin only)
export async function POST(req) {
  const body = await req.json();
  await dbConnect();
  const product = await Product.create(body);
  return NextResponse.json(product);
}

// PUT: Update product (admin only)
export async function PUT(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const body = await req.json();
  const product = await Product.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(product);
}

// DELETE: Delete product (admin only)
export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
