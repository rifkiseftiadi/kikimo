import dbConnect from '@/app/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();
  await dbConnect();
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }
  const hashed = bcrypt.hashSync(password, 10);
  const user = await User.create({ email, password: hashed });
  return NextResponse.json({ message: 'User registered', user: { email: user.email } });
}
