import dbConnect from '@/app/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

// GET: List all users (admin only)
export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const users = await User.find({}, '-password');
  return NextResponse.json(users);
}

// PATCH: Update user role (admin only)
export async function PATCH(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { userId, role } = await req.json();
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
  return NextResponse.json(user);
}

// DELETE: Delete user (admin only)
export async function DELETE(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  await User.findByIdAndDelete(userId);
  return NextResponse.json({ success: true });
}
